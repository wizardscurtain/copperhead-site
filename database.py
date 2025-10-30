"""
PostgreSQL Database Configuration for Render Deployment
Migrated from MongoDB to PostgreSQL with JSONB support
"""

import os
import uuid
from datetime import datetime
from typing import Optional, Dict, Any

import databases
import sqlalchemy
from sqlalchemy import (
    Column, String, Text, DateTime, JSON, Integer, 
    create_engine, MetaData, Table, UUID
)
from sqlalchemy.dialects.postgresql import JSONB, INET
from sqlalchemy.sql import func

# Database configuration for Render PostgreSQL
DATABASE_URL = os.environ.get(
    'DATABASE_URL', 
    'postgresql://localhost:5432/copperhead_db'
)

# Handle Render's postgres:// URL format
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

# Create database instance
database = databases.Database(DATABASE_URL)
metadata = MetaData()

# Contact submissions table (migrated from MongoDB)
contact_submissions = Table(
    'contact_submissions',
    metadata,
    Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
    Column('name', String(100), nullable=False),
    Column('email', String(255), nullable=False),
    Column('message', Text, nullable=False),
    Column('submitted_at', DateTime(timezone=True), server_default=func.now()),
    Column('client_fingerprint', String(32)),
    Column('status', String(20), default='new'),
    Column('metadata', JSONB, nullable=True)  # For additional flexible data
)

# Security logs table (migrated from MongoDB)
security_logs = Table(
    'security_logs',
    metadata,
    Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
    Column('event_type', String(50), nullable=False),
    Column('timestamp', DateTime(timezone=True), server_default=func.now()),
    Column('client_ip', INET, nullable=True),
    Column('details', JSONB, nullable=True),
    Column('severity', String(20), default='medium')
)

# Sessions table (migrated from MongoDB)
sessions = Table(
    'sessions',
    metadata,
    Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
    Column('session_id', String(64), unique=True, nullable=False),
    Column('client_fingerprint', String(32), nullable=False),
    Column('created_at', DateTime(timezone=True), server_default=func.now()),
    Column('last_activity', DateTime(timezone=True), server_default=func.now()),
    Column('csrf_token', String(128)),
    Column('data', JSONB, nullable=True)  # For session data
)

# Create engine for migrations
engine = create_engine(DATABASE_URL)

# Database connection management
class DatabaseManager:
    def __init__(self):
        self.database = database
        self.is_connected = False
    
    async def connect(self):
        """Connect to PostgreSQL database"""
        try:
            await self.database.connect()
            self.is_connected = True
            print("✅ PostgreSQL database connected successfully")
        except Exception as e:
            self.is_connected = False
            print(f"❌ PostgreSQL connection failed: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from PostgreSQL database"""
        if self.is_connected:
            await self.database.disconnect()
            self.is_connected = False
            print("✅ PostgreSQL database disconnected")
    
    async def create_tables(self):
        """Create all tables if they don't exist"""
        try:
            metadata.create_all(engine)
            print("✅ PostgreSQL tables created successfully")
        except Exception as e:
            print(f"❌ Failed to create tables: {e}")
            raise

# Global database manager instance
db_manager = DatabaseManager()

# Helper functions for database operations
async def insert_contact_submission(data: Dict[str, Any]) -> str:
    """Insert contact submission into PostgreSQL"""
    submission_id = str(uuid.uuid4())
    query = contact_submissions.insert().values(
        id=submission_id,
        name=data['name'],
        email=data['email'],
        message=data['message'],
        client_fingerprint=data.get('client_fingerprint'),
        status=data.get('status', 'new'),
        metadata=data.get('metadata')
    )
    await database.execute(query)
    return submission_id

async def insert_security_log(event_type: str, client_ip: str, details: Dict[str, Any], severity: str = 'medium') -> str:
    """Insert security log into PostgreSQL"""
    log_id = str(uuid.uuid4())
    query = security_logs.insert().values(
        id=log_id,
        event_type=event_type,
        client_ip=client_ip,
        details=details,
        severity=severity
    )
    await database.execute(query)
    return log_id

async def insert_session(session_id: str, client_fingerprint: str, csrf_token: str, data: Optional[Dict[str, Any]] = None) -> str:
    """Insert session into PostgreSQL"""
    session_uuid = str(uuid.uuid4())
    query = sessions.insert().values(
        id=session_uuid,
        session_id=session_id,
        client_fingerprint=client_fingerprint,
        csrf_token=csrf_token,
        data=data
    )
    await database.execute(query)
    return session_uuid

async def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    """Get session from PostgreSQL"""
    query = sessions.select().where(sessions.c.session_id == session_id)
    result = await database.fetch_one(query)
    return dict(result) if result else None

async def update_session_activity(session_id: str) -> bool:
    """Update session last activity"""
    query = sessions.update().where(
        sessions.c.session_id == session_id
    ).values(
        last_activity=func.now()
    )
    result = await database.execute(query)
    return result > 0

async def delete_session(session_id: str) -> bool:
    """Delete session from PostgreSQL"""
    query = sessions.delete().where(sessions.c.session_id == session_id)
    result = await database.execute(query)
    return result > 0

async def cleanup_expired_sessions(timeout_seconds: int = 1800) -> int:
    """Clean up expired sessions"""
    cutoff_time = datetime.utcnow().timestamp() - timeout_seconds
    query = sessions.delete().where(
        func.extract('epoch', sessions.c.last_activity) < cutoff_time
    )
    result = await database.execute(query)
    return result

"""Initial PostgreSQL migration from MongoDB

Revision ID: 001
Revises: 
Create Date: 2025-01-27 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create contact_submissions table
    op.create_table('contact_submissions',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('submitted_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('client_fingerprint', sa.String(length=32), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Create security_logs table
    op.create_table('security_logs',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('event_type', sa.String(length=50), nullable=False),
    sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('client_ip', postgresql.INET(), nullable=True),
    sa.Column('details', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('severity', sa.String(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Create sessions table
    op.create_table('sessions',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('session_id', sa.String(length=64), nullable=False),
    sa.Column('client_fingerprint', sa.String(length=32), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('last_activity', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('csrf_token', sa.String(length=128), nullable=True),
    sa.Column('data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('session_id')
    )
    
    # Create indexes for better performance
    op.create_index('idx_contact_submissions_email', 'contact_submissions', ['email'])
    op.create_index('idx_contact_submissions_status', 'contact_submissions', ['status'])
    op.create_index('idx_contact_submissions_submitted_at', 'contact_submissions', ['submitted_at'])
    
    op.create_index('idx_security_logs_event_type', 'security_logs', ['event_type'])
    op.create_index('idx_security_logs_timestamp', 'security_logs', ['timestamp'])
    op.create_index('idx_security_logs_client_ip', 'security_logs', ['client_ip'])
    
    op.create_index('idx_sessions_session_id', 'sessions', ['session_id'])
    op.create_index('idx_sessions_last_activity', 'sessions', ['last_activity'])


def downgrade():
    # Drop indexes
    op.drop_index('idx_sessions_last_activity', table_name='sessions')
    op.drop_index('idx_sessions_session_id', table_name='sessions')
    op.drop_index('idx_security_logs_client_ip', table_name='security_logs')
    op.drop_index('idx_security_logs_timestamp', table_name='security_logs')
    op.drop_index('idx_security_logs_event_type', table_name='security_logs')
    op.drop_index('idx_contact_submissions_submitted_at', table_name='contact_submissions')
    op.drop_index('idx_contact_submissions_status', table_name='contact_submissions')
    op.drop_index('idx_contact_submissions_email', table_name='contact_submissions')
    
    # Drop tables
    op.drop_table('sessions')
    op.drop_table('security_logs')
    op.drop_table('contact_submissions')

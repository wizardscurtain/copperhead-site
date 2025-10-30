#!/usr/bin/env python3
"""
Deployment Failure Root Cause Analysis
Analyzes the deployment failure on Render platform
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any

class DeploymentFailureAnalyzer:
    """Analyzes deployment failures and provides remediation"""
    
    def __init__(self):
        self.issues = []
        self.fixes = []
        self.render_config_path = "/app/render.yaml"
        self.backend_env_path = "/app/.env"
        self.frontend_env_path = "/app/frontend/.env"
        
    def analyze_deployment_failure(self) -> Dict[str, Any]:
        """Comprehensive deployment failure analysis"""
        print("🔍 DEPLOYMENT FAILURE ROOT CAUSE ANALYSIS")
        print("="*60)
        
        # 1. Database Configuration Issues
        self._analyze_database_config()
        
        # 2. Environment Variable Issues
        self._analyze_environment_variables()
        
        # 3. Render Configuration Issues
        self._analyze_render_configuration()
        
        # 4. Service Dependencies
        self._analyze_service_dependencies()
        
        # 5. Build Process Issues
        self._analyze_build_process()
        
        # Generate remediation plan
        remediation_plan = self._generate_remediation_plan()
        
        return {
            "issues_found": len(self.issues),
            "critical_issues": self.issues,
            "remediation_fixes": self.fixes,
            "remediation_plan": remediation_plan
        }
    
    def _analyze_database_config(self):
        """Analyze database configuration issues"""
        print("💾 Analyzing Database Configuration...")
        
        # Check if using PostgreSQL vs MongoDB
        with open("/app/database.py", 'r') as f:
            db_content = f.read()
        
        if "postgresql" in db_content.lower():
            print("✅ Using PostgreSQL (Render compatible)")
        else:
            self.issues.append("Database not configured for PostgreSQL")
            self.fixes.append("Migrate to PostgreSQL for Render compatibility")
        
        # Check DATABASE_URL handling
        if "DATABASE_URL" in db_content:
            print("✅ DATABASE_URL environment variable configured")
        else:
            self.issues.append("DATABASE_URL not properly configured")
            self.fixes.append("Add DATABASE_URL environment variable handling")
        
        # Check SSL configuration
        if "sslmode=require" in db_content:
            print("✅ SSL mode configured for production")
        else:
            self.issues.append("SSL mode not configured for Render PostgreSQL")
            self.fixes.append("Add SSL mode configuration for Render")
    
    def _analyze_environment_variables(self):
        """Analyze environment variable configuration"""
        print("🌍 Analyzing Environment Variables...")
        
        # Check backend environment variables
        backend_env_exists = os.path.exists(self.backend_env_path)
        if not backend_env_exists:
            print("⚠️ Backend .env file not found (expected for Render)")
        
        # Check frontend environment variables
        if os.path.exists(self.frontend_env_path):
            with open(self.frontend_env_path, 'r') as f:
                frontend_env = f.read()
            
            if "VITE_BACKEND_URL" in frontend_env:
                print("✅ Frontend backend URL configured")
                if "copperhead-backend.onrender.com" in frontend_env:
                    print("✅ Render backend URL configured")
                else:
                    self.issues.append("Frontend not pointing to Render backend URL")
                    self.fixes.append("Update VITE_BACKEND_URL to point to Render backend")
            else:
                self.issues.append("Frontend backend URL not configured")
                self.fixes.append("Add VITE_BACKEND_URL to frontend .env")
        else:
            self.issues.append("Frontend .env file missing")
            self.fixes.append("Create frontend .env file with proper configuration")
    
    def _analyze_render_configuration(self):
        """Analyze Render deployment configuration"""
        print("🚀 Analyzing Render Configuration...")
        
        if not os.path.exists(self.render_config_path):
            self.issues.append("render.yaml configuration file missing")
            self.fixes.append("Create render.yaml configuration file")
            return
        
        with open(self.render_config_path, 'r') as f:
            render_config = f.read()
        
        # Check for PostgreSQL database configuration
        if "databases:" in render_config and "postgresql" in render_config.lower():
            print("✅ PostgreSQL database configured in render.yaml")
        else:
            self.issues.append("PostgreSQL database not configured in render.yaml")
            self.fixes.append("Add PostgreSQL database configuration to render.yaml")
        
        # Check for proper service configuration
        if "type: web" in render_config:
            print("✅ Web services configured")
        else:
            self.issues.append("Web services not properly configured")
            self.fixes.append("Configure web services in render.yaml")
        
        # Check for environment variables
        if "DATABASE_URL" in render_config:
            print("✅ DATABASE_URL configured in render.yaml")
        else:
            self.issues.append("DATABASE_URL not configured in render.yaml")
            self.fixes.append("Add DATABASE_URL configuration to render.yaml")
        
        # Check for build commands
        if "buildCommand:" in render_config:
            print("✅ Build commands configured")
        else:
            self.issues.append("Build commands not configured")
            self.fixes.append("Add build commands to render.yaml")
    
    def _analyze_service_dependencies(self):
        """Analyze service dependencies"""
        print("🔗 Analyzing Service Dependencies...")
        
        # Check requirements.txt
        if os.path.exists("/app/requirements.txt"):
            with open("/app/requirements.txt", 'r') as f:
                requirements = f.read()
            
            # Check for PostgreSQL dependencies
            if "psycopg2" in requirements or "asyncpg" in requirements:
                print("✅ PostgreSQL dependencies configured")
            else:
                self.issues.append("PostgreSQL dependencies missing")
                self.fixes.append("Add PostgreSQL dependencies to requirements.txt")
            
            # Check for database libraries
            if "databases" in requirements and "sqlalchemy" in requirements:
                print("✅ Database libraries configured")
            else:
                self.issues.append("Database libraries not properly configured")
                self.fixes.append("Add proper database libraries to requirements.txt")
        else:
            self.issues.append("requirements.txt file missing")
            self.fixes.append("Create requirements.txt with all dependencies")
        
        # Check frontend dependencies
        frontend_package_json = "/app/frontend/package.json"
        if os.path.exists(frontend_package_json):
            print("✅ Frontend package.json exists")
        else:
            self.issues.append("Frontend package.json missing")
            self.fixes.append("Ensure frontend package.json is properly configured")
    
    def _analyze_build_process(self):
        """Analyze build process issues"""
        print("🔨 Analyzing Build Process...")
        
        # Check for Alembic migrations
        if os.path.exists("/app/alembic"):
            print("✅ Alembic migrations configured")
        else:
            self.issues.append("Database migrations not configured")
            self.fixes.append("Set up Alembic for database migrations")
        
        # Check for proper Python version
        if os.path.exists("/app/runtime.txt"):
            with open("/app/runtime.txt", 'r') as f:
                runtime = f.read().strip()
            print(f"✅ Python runtime specified: {runtime}")
        else:
            self.issues.append("Python runtime not specified")
            self.fixes.append("Add runtime.txt with Python version")
        
        # Check for Procfile (alternative to render.yaml)
        if os.path.exists("/app/Procfile"):
            print("✅ Procfile exists (backup configuration)")
        else:
            print("⚠️ Procfile not found (using render.yaml)")
    
    def _generate_remediation_plan(self) -> Dict[str, Any]:
        """Generate comprehensive remediation plan"""
        print("\n🛠️ GENERATING REMEDIATION PLAN...")
        
        # Prioritize fixes
        critical_fixes = []
        important_fixes = []
        optional_fixes = []
        
        for fix in self.fixes:
            if any(keyword in fix.lower() for keyword in ['database', 'postgresql', 'url']):
                critical_fixes.append(fix)
            elif any(keyword in fix.lower() for keyword in ['environment', 'configuration']):
                important_fixes.append(fix)
            else:
                optional_fixes.append(fix)
        
        remediation_plan = {
            "phase_1_critical": {
                "description": "Critical database and configuration fixes",
                "fixes": critical_fixes,
                "estimated_time": "30-60 minutes"
            },
            "phase_2_important": {
                "description": "Important environment and service fixes",
                "fixes": important_fixes,
                "estimated_time": "15-30 minutes"
            },
            "phase_3_optional": {
                "description": "Optional improvements and optimizations",
                "fixes": optional_fixes,
                "estimated_time": "15-30 minutes"
            }
        }
        
        return remediation_plan
    
    def generate_fixed_configurations(self):
        """Generate corrected configuration files"""
        print("\n🔧 GENERATING CORRECTED CONFIGURATIONS...")
        
        # Generate corrected render.yaml
        corrected_render_yaml = self._generate_corrected_render_yaml()
        
        # Generate corrected database configuration
        corrected_database_config = self._generate_corrected_database_config()
        
        # Generate corrected environment variables
        corrected_env_vars = self._generate_corrected_env_vars()
        
        return {
            "render_yaml": corrected_render_yaml,
            "database_config": corrected_database_config,
            "environment_variables": corrected_env_vars
        }
    
    def _generate_corrected_render_yaml(self) -> str:
        """Generate corrected render.yaml configuration"""
        return '''
# Corrected Render Blueprint for Copperhead Consulting Inc
# PostgreSQL + Static Hosting Configuration

services:
  # Backend API Service
  - type: web
    name: copperhead-backend
    env: python
    plan: starter
    buildCommand: |
      pip install -r requirements.txt
      python -m alembic upgrade head
    startCommand: python server.py
    healthCheckPath: /api/health
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: copperhead-db
          property: connectionString
      - key: ENVIRONMENT
        value: production
      - key: CSRF_SECRET
        generateValue: true
      - key: SESSION_SECRET
        generateValue: true

  # Frontend Static Site
  - type: web
    name: copperhead-frontend
    env: static
    buildCommand: |
      cd frontend
      yarn install
      yarn build
    staticPublishPath: ./frontend/dist
    pullRequestPreviewsEnabled: false
    headers:
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
      - path: /*
        name: Referrer-Policy
        value: strict-origin-when-cross-origin
      - path: /assets/*
        name: Cache-Control
        value: public, max-age=31536000
    routes:
      - type: rewrite
        source: /api/*
        destination: https://copperhead-backend.onrender.com/*
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  # PostgreSQL Database
  - name: copperhead-db
    databaseName: copperhead_production
    user: copperhead_user
    plan: starter
    postgresMajorVersion: 15
'''
    
    def _generate_corrected_database_config(self) -> str:
        """Generate corrected database configuration"""
        return '''
# Key fixes for database.py:
# 1. Ensure proper SSL configuration for Render
# 2. Handle postgres:// to postgresql:// conversion
# 3. Add proper error handling for connection failures

def get_database_url():
    """Get and format database URL for Render PostgreSQL"""
    database_url = os.environ.get(
        'DATABASE_URL', 
        'postgresql://localhost:5432/copperhead_db'
    )
    
    # Handle Render's postgres:// URL format
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    # Add SSL mode for Render PostgreSQL in production
    if 'localhost' not in database_url and 'sslmode' not in database_url:
        separator = '&' if '?' in database_url else '?'
        database_url += f'{separator}sslmode=require'
    
    return database_url
'''
    
    def _generate_corrected_env_vars(self) -> Dict[str, str]:
        """Generate corrected environment variables"""
        return {
            "frontend_env": {
                "VITE_BACKEND_URL": "https://copperhead-backend.onrender.com",
                "VITE_APP_NAME": "Copperhead Consulting Inc",
                "VITE_ENVIRONMENT": "production"
            },
            "render_env_vars": {
                "DATABASE_URL": "[Automatically set by Render from database]",
                "ENVIRONMENT": "production",
                "CSRF_SECRET": "[Auto-generated by Render]",
                "SESSION_SECRET": "[Auto-generated by Render]"
            }
        }

def main():
    """Main analysis function"""
    analyzer = DeploymentFailureAnalyzer()
    
    # Run comprehensive analysis
    analysis_result = analyzer.analyze_deployment_failure()
    
    # Generate corrected configurations
    corrected_configs = analyzer.generate_fixed_configurations()
    
    # Print summary
    print("\n" + "="*60)
    print("📊 DEPLOYMENT FAILURE ANALYSIS SUMMARY")
    print("="*60)
    print(f"🚨 Issues Found: {analysis_result['issues_found']}")
    print(f"🔧 Fixes Available: {len(analysis_result['remediation_fixes'])}")
    
    if analysis_result['critical_issues']:
        print("\n🚨 CRITICAL ISSUES:")
        for i, issue in enumerate(analysis_result['critical_issues'], 1):
            print(f"  {i}. {issue}")
    
    print("\n🛠️ REMEDIATION PLAN:")
    for phase, details in analysis_result['remediation_plan'].items():
        print(f"\n{phase.upper().replace('_', ' ')}:")
        print(f"  Description: {details['description']}")
        print(f"  Estimated Time: {details['estimated_time']}")
        if details['fixes']:
            print("  Fixes:")
            for fix in details['fixes']:
                print(f"    - {fix}")
    
    # Save analysis to file
    analysis_file = "/app/deployment_failure_analysis.json"
    with open(analysis_file, 'w') as f:
        json.dump({
            "analysis_result": analysis_result,
            "corrected_configurations": corrected_configs
        }, f, indent=2)
    
    print(f"\n📄 Full analysis saved to: {analysis_file}")
    print("="*60)
    
    return analysis_result['issues_found'] == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
'''
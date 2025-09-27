#!/usr/bin/env python3
import os, json
from pathlib import Path

def load_env():
    env_file = Path(".autodev/.env")
    if not env_file.exists():
        print("❌ .autodev/.env file not found")
        return {}
    
    env_vars = {}
    for line in env_file.read_text().splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue
        if "=" in line:
            key, value = line.split("=", 1)
            env_vars[key.strip()] = value.strip()
    
    return env_vars

def get_active_playbook():
    try:
        with open(".autodev/playbooks/active_playbook.json") as f:
            data = json.load(f)
            return data.get("type", "web-development")
    except:
        return "web-development"

REQUIRED_CREDENTIALS = {
    "web-development": ["MONGO_URL", "JWT_SECRET"],
    "mobile-development": ["JWT_SECRET"],
    "backend-services": ["MONGO_URL", "JWT_SECRET"],
    "rust-development": ["POSTGRES_URL"],
    "csharp-development": ["ConnectionStrings__Default"],
    "gohighlevel-marketplace": ["GHL_CLIENT_ID", "GHL_CLIENT_SECRET", "GHL_WEBHOOK_SECRET"],
    "seo-strategy": ["GOOGLE_ANALYTICS_ID"]
}

if __name__ == "__main__":
    env = load_env()
    playbook = get_active_playbook()
    required = REQUIRED_CREDENTIALS.get(playbook, [])
    
    missing = [key for key in required if not env.get(key)]
    if missing:
        print(f"❌ Missing credentials for {playbook}: {', '.join(missing)}")
        exit(1)
    
    print(f"✅ All required credentials present for {playbook}")
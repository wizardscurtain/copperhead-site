#!/usr/bin/env python3
import json, sys
from pathlib import Path

def validate_structure():
    errors = []
    required_dirs = [".autodev/schema", ".autodev/memory", ".autodev/coordination", 
                    ".autodev/playbooks", ".autodev/credentials"]
    
    for req_dir in required_dirs:
        if not Path(req_dir).exists():
            errors.append(f"Missing required directory: {req_dir}")
    
    # Validate playbooks exist
    playbooks = [".autodev/playbooks/web-development", ".autodev/playbooks/mobile-development",
                ".autodev/playbooks/backend-services", ".autodev/playbooks/rust-development",
                ".autodev/playbooks/csharp-development", ".autodev/playbooks/gohighlevel-marketplace",
                ".autodev/playbooks/seo-strategy"]
    
    for pb in playbooks:
        if not Path(pb).exists():
            errors.append(f"Missing playbook directory: {pb}")
    
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        sys.exit(1)
    
    print("✅ Structure validation passed")

if __name__ == "__main__":
    validate_structure()
#!/usr/bin/env python3
import json
from pathlib import Path

def analyze_project_complexity():
    try:
        with open(".autodev/playbooks/active_playbook.json") as f:
            playbook_data = json.load(f)
            playbook_type = playbook_data.get("type", "web-development")
        
        # Load playbook complexity
        complexity_map = {
            "web-development": 3,
            "mobile-development": 2, 
            "backend-services": 2,
            "rust-development": 4,
            "csharp-development": 3,
            "gohighlevel-marketplace": 4,
            "seo-strategy": 2
        }
        
        complexity = complexity_map.get(playbook_type, 2)
        
        # Calculate recommendations
        if complexity <= 2:
            recommended = 1
            max_safe = 2
        elif complexity == 3:
            recommended = 2
            max_safe = 3
        else:  # complexity >= 4
            recommended = 2
            max_safe = 4
        
        return {
            "recommended": recommended,
            "max_safe": max_safe,
            "complexity_score": complexity,
            "playbook_type": playbook_type,
            "reasoning": f"Complexity {complexity}/5 for {playbook_type} suggests {recommended} sessions optimal"
        }
    
    except Exception as e:
        return {
            "recommended": 1,
            "max_safe": 2,
            "complexity_score": 1,
            "playbook_type": "unknown",
            "reasoning": f"Unable to analyze complexity: {str(e)}"
        }

if __name__ == "__main__":
    advice = analyze_project_complexity()
    print(json.dumps(advice, indent=2))
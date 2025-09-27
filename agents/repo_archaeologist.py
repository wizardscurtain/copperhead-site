#!/usr/bin/env python3
"""
Repo Archaeologist - Analyzes existing codebases and updates project state
"""

import json, os
from pathlib import Path
from datetime import datetime

def analyze_nextjs_project():
    """Analyze Next.js project structure and components"""
    analysis = {
        "framework": "Next.js 14",
        "typescript": Path("tsconfig.json").exists(),
        "app_router": Path("app").exists(),
        "components": [],
        "pages": [],
        "features": []
    }
    
    # Analyze components
    components_dir = Path("components")
    if components_dir.exists():
        for comp_file in components_dir.glob("*.tsx"):
            analysis["components"].append(comp_file.stem)
    
    # Analyze app directory
    app_dir = Path("app")
    if app_dir.exists():
        for page_dir in app_dir.iterdir():
            if page_dir.is_dir() and not page_dir.name.startswith("."):
                analysis["pages"].append(page_dir.name)
    
    # Check for SEO features
    if Path("app/sitemap.ts").exists():
        analysis["features"].append("sitemap")
    if Path("app/robots.ts").exists():
        analysis["features"].append("robots")
    
    return analysis

def update_project_state(analysis):
    """Update project state with analysis results"""
    state_file = Path(".autodev/memory/project_state.json")
    
    with open(state_file) as f:
        state = json.load(f)
    
    # Update components based on analysis
    state["components"] = [
        {
            "name": "Next.js Frontend",
            "type": "frontend",
            "framework": analysis["framework"],
            "status": "active",
            "features": analysis["features"],
            "components_detected": analysis["components"],
            "pages_detected": analysis["pages"]
        }
    ]
    
    state["last_update"] = datetime.now().isoformat() + "Z"
    state["analysis_complete"] = True
    
    with open(state_file, "w") as f:
        json.dump(state, f, indent=2)
    
    return state

if __name__ == "__main__":
    print("🔍 Repo Archaeologist analyzing Next.js project...")
    analysis = analyze_nextjs_project()
    state = update_project_state(analysis)
    
    print(f"✅ Analysis complete:")
    print(f"   Framework: {analysis['framework']}")
    print(f"   Components: {len(analysis['components'])}")
    print(f"   Pages: {len(analysis['pages'])}")
    print(f"   Features: {', '.join(analysis['features'])}")
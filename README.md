# Copperhead Consulting Inc - PWA

Professional security consulting services platform built as a Progressive Web App.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Yarn package manager

### Local Development

```bash
# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend && yarn install

# Start backend (from root)
uvicorn app:app --reload --port 8001

# Start frontend (from frontend/)
cd frontend && yarn dev
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Update environment variables with your values
3. Ensure MongoDB is running (local or Atlas)

## 📦 Project Structure

```
/
├── server.py           # FastAPI backend (main application)
├── app.py              # Entry point (imports from server.py)
├── requirements.txt    # Python dependencies
├── Procfile           # Deployment startup command
├── runtime.txt        # Python version specification
│
├── frontend/          # React + Vite frontend
│   ├── src/          # React components, pages, lib
│   ├── public/       # Static assets
│   ├── dist/         # Built output (generated)
│   └── package.json  # Frontend dependencies
│
├── backend/          # Reference (legacy structure)
│   └── .env         # Backend environment variables
│
└── docs/            # Project documentation
```

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI (Python) serving both API and static frontend
- **Database**: MongoDB (local development or Atlas in production)
- **Deployment**: Emergent platform with auto-detection

### Key Features
- Progressive Web App (PWA) with service worker
- Responsive dark theme design
- Contact forms using mailto: (no backend email service)
- Health check endpoint: `/api/health`
- Static file serving from `/app/frontend/dist`

## 🚢 Deployment

The application is configured for Emergent auto-deployment (backend) and **GitHub Pages** (static frontend) now.

### GitHub Pages (Frontend Only)

GitHub Pages serves only static files. The React/Vite frontend can be deployed independently of the FastAPI backend.

Added in this repo:
- Workflow: `.github/workflows/deploy-gh-pages.yml`
- Vite `base` auto-config via `GH_PAGES_BASE` env var
- SPA fallback: `frontend/public/404.html`
- All asset paths now resolve relative to the configured base

#### How it Works

1. On push to `main` (changes under `frontend/**`), the workflow builds the frontend with `GH_PAGES_BASE=/<repo-name>/`.
2. Output in `frontend/dist` is uploaded as a Pages artifact.
3. GitHub Pages deploys it to: `https://<your-username>.github.io/<repo-name>/`.

#### One-Time Setup

1. In your repository settings, enable GitHub Pages with the "GitHub Actions" source.
2. Merge these changes to `main`.
3. Wait for the "Deploy Frontend to GitHub Pages" workflow to finish.

#### Local Preview with Base Path

If you want to preview using the same base path your GitHub Pages site will have:

```bash
cd frontend
GH_PAGES_BASE=/copperhead-ci-clone/ yarn build && npx serve dist
```

Then open `http://localhost:3000/copperhead-ci-clone/` (adjust for the serve tool output).

### Backend (FastAPI)

For dynamic APIs you still need a separate hosting platform (Render, Railway, Fly.io, etc.). The current frontend does **not** call `/api` endpoints, so it functions fully as a static marketing site.

### Original (Emergent) Flow
1. Emergent detects Python app via `requirements.txt`
2. Installs dependencies and copies Python files
3. Builds frontend via `yarn build`
4. Starts via Procfile: `uvicorn app:app --port ${PORT}`

### Deployment Files
- `Procfile` - Startup command
- `runtime.txt` - Python version (3.11.13)
- `.slugignore` - Files to exclude from deployment (Emergent/Heroku-style)
- `.github/workflows/deploy-gh-pages.yml` - GitHub Pages build & deploy workflow
- `.env.example` - Required environment variables

## 🧪 Testing

*Note: Test suite is minimal. See `/tests` directory for available tests.*

```bash
# Run Python tests (when implemented)
pytest

# Run frontend tests (when implemented)
cd frontend && yarn test
```

## 📝 Contact & Support

**Copperhead Consulting Inc**
- Phone: (360) 519-9932
- Email: contact@copperheadci.com
- Website: https://copperheadci.com

## 📄 License

Proprietary - Copperhead Consulting Inc © 2024
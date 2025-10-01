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

The application is configured for Emergent auto-deployment:

1. Emergent detects Python app via `requirements.txt`
2. Installs dependencies and copies Python files
3. Builds frontend via `yarn build`
4. Starts via Procfile: `uvicorn app:app --port ${PORT}`

### Deployment Files
- `Procfile` - Startup command
- `runtime.txt` - Python version (3.11.13)
- `.slugignore` - Files to exclude from deployment
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
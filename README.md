# Sealmetrics API Validator

A professional web application to validate and test Sealmetrics API endpoints with real-time response analysis.

## Features

- **API Token Validation**: Securely authenticate with your Sealmetrics API token
- **Endpoint Explorer**: Browse and select from all available API endpoints
- **Parameter Configuration**: Configure endpoint parameters with smart defaults
- **Real-time Validation**: Execute API calls and see detailed responses
- **Quick Health Check**: One-click validation of core API endpoints
- **Session History**: Track all validations with export functionality
- **Professional UI**: Clean, responsive design with dark mode support

## Architecture

```
API-validator/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── config.py       # Configuration
│   │   ├── models/         # Pydantic models
│   │   ├── routers/        # API routes
│   │   └── services/       # Business logic
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Next.js 14 frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities & API client
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Local development
└── railway.toml           # Railway deployment config
```

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **httpx** - Async HTTP client
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 20+
- pnpm (recommended) or npm

### Local Development

1. **Clone and setup backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

2. **Run backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

3. **Setup frontend (new terminal):**
```bash
cd frontend
pnpm install
```

4. **Create environment file:**
```bash
cp .env.example .env.local
# Edit .env.local if needed
```

5. **Run frontend:**
```bash
pnpm dev
```

6. **Open browser:**
- Frontend: http://localhost:3000
- Backend docs: http://localhost:8000/docs

### Using Docker

```bash
docker-compose up --build
```

## Deployment to Railway

### Option 1: Railway Dashboard

1. Create a new project in [Railway](https://railway.app)
2. Add two services from GitHub:
   - **Backend**: Point to `/backend` directory
   - **Frontend**: Point to `/frontend` directory
3. Configure environment variables:

**Backend:**
```
CORS_ORIGINS=["https://api-validator.sealmetrics.com"]
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

4. Add custom domain: `api-validator.sealmetrics.com`

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Deploy frontend
cd ../frontend
railway init
railway up
```

## API Endpoints

### Validator Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/validate/token` | Validate API token |
| POST | `/validate/endpoint` | Validate specific endpoint |
| POST | `/validate/health-check` | Run quick health check |
| POST | `/validate/batch` | Validate multiple endpoints |

### Endpoints Registry

| Method | Path | Description |
|--------|------|-------------|
| GET | `/endpoints` | List all endpoints |
| GET | `/endpoints/categories` | List categories |
| GET | `/endpoints/category/{category}` | Get by category |
| GET | `/endpoints/{endpoint_id}` | Get endpoint details |

## Security

- API tokens are never stored on the server
- All communication over HTTPS
- Tokens stored only in browser memory/localStorage
- No server-side persistence of credentials

## License

Copyright © 2024 Sealmetrics. All rights reserved.

# GymApp — AI-Powered Fitness Platform

## Architecture

```
backend/
├── eureka-server/        # Service discovery (port 8761)
├── api-gateway/          # Spring Cloud Gateway (port 8080)
├── user-service/         # Auth + JWT (port 8081)
├── workout-service/      # AI workout gen via Claude (port 8082)
├── tracking-service/     # Session + set logging (port 8083)
├── notification-service/ # Kafka consumer (port 8084)
└── docker-compose.yml

frontend/
└── src/
    ├── navigation/       # React Navigation (Auth + Main)
    ├── screens/          # auth, home, workout, tracking, profile
    ├── components/       # common (Button, Input), workout, tracking
    ├── services/         # API calls per domain
    ├── store/slices/     # Redux Toolkit slices
    └── types/            # TypeScript types
```

## Quick Start

### Backend
```bash
cd backend
docker-compose up --build
```

Services start at:
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npx expo start
```

## Environment Variables
Copy `.env` to `backend/.env`:
```
CLAUDE_API_KEY=your_key_here
JWT_SECRET=your_jwt_secret_here
```

## API Endpoints (via Gateway)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/users/me | Get profile |
| POST | /api/workouts/generate | Generate AI plan |
| GET | /api/workouts | List plans |
| POST | /api/tracking/sessions | Start session |
| POST | /api/tracking/sessions/:id/log | Log a set |
| GET | /api/tracking/stats | Progress stats |

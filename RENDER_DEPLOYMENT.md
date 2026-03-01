# Deployment Instructions for Render

## Prerequisites
1. GitHub repository with your code pushed
2. Render account (free at https://render.com)
3. PostgreSQL database setup on Render

## Step 1: Create Render Account
- Go to https://render.com and sign up (free)
- Connect your GitHub account

## Step 2: Deploy PostgreSQL Database
1. Go to Dashboard → New+ → PostgreSQL
2. Set database name: `mirhapret-postgres`
3. Select **Free** plan
4. Create database
5. Copy connection details (you'll need these)

## Step 3: Deploy Backend Service
1. Go to Dashboard → New+ → Web Service
2. Connect your GitHub repo
3. Set deployment settings:
   - **Name:** mirhapret-backend
   - **Runtime:** Node
   - **Build Command:** `cd apps/backend && npm install && npm run build`
   - **Start Command:** `node apps/backend/dist/main.js`
   - **Plan:** Free

## Step 4: Add Environment Variables
In Render dashboard, add these environment variables:
```
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

DB_HOST=<your-postgres-host>
DB_PORT=<your-postgres-port>
DB_USERNAME=<your-postgres-user>
DB_PASSWORD=<your-postgres-password>
DB_DATABASE=<your-postgres-database>
DB_SYNCHRONIZE=true
DB_LOGGING=false

JWT_SECRET=<generate-a-strong-32-char-secret>
JWT_REFRESH_SECRET=<generate-another-32-char-secret>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

CORS_ORIGINS=http://localhost:3001,http://localhost:3002,http://localhost:5173

APP_NAME=Mirhapret E-commerce
APP_VERSION=1.0.0

REDIS_URL=
RABBITMQ_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Step 5: Deploy
1. Click "Deploy"
2. Wait for build completion (2-3 minutes)
3. View logs if there are issues

## Step 6: Get Your API URL
- Your API will be at: `https://mirhapret-backend.onrender.com/api/v1`
- Use this in frontend environment files

## Limitations (Free Tier)
- Service spins down after 15 min of inactivity (startup takes ~30s)
- Limited to 0.5GB RAM
- No Redis/RabbitMQ support (removed from render.yaml)
- PostgreSQL restarts monthly

## Production Improvements (Later)
- Upgrade to paid plan for always-on service
- Add Redis add-on (Render Redis: $7/month)
- Add custom domain
- Enable automatic deployments on git push

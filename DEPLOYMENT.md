# Deployment Guide

## AWS Deployment

### EC2 Setup
1. Launch EC2 instance (Ubuntu 20.04 LTS)
2. Install Docker and Docker Compose
3. Clone repository
4. Configure environment variables
5. Run `docker-compose up -d`

### RDS for MongoDB
- Use MongoDB Atlas or DocumentDB
- Update `MONGODB_URI` in backend `.env`

### Elastic Beanstalk (Alternative)
- Deploy backend as Node.js application
- Deploy frontend to S3 + CloudFront

## GCP Deployment

### Cloud Run
1. Build Docker images
2. Push to Container Registry
3. Deploy services to Cloud Run
4. Configure Cloud SQL (MongoDB) or use MongoDB Atlas

### App Engine (Alternative)
- Deploy backend to App Engine
- Deploy frontend to Firebase Hosting

## Heroku Deployment

### Backend
```bash
cd backend
heroku create agri-advisor-api
heroku addons:create mongolab:sandbox
git push heroku main
```

### Frontend
```bash
cd frontend
heroku create agri-advisor-ui
git push heroku main
```

### ML Service
- Deploy as separate Heroku app or use external service
- Update `ML_SERVICE_URL` in backend config

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=...
ML_SERVICE_URL=http://...
CORS_ORIGIN=https://...
```

### Frontend (.env)
```
REACT_APP_API_URL=https://...
REACT_APP_ML_SERVICE_URL=https://...
```

### ML Service (.env)
```
MODEL_PATH=/app/models/crop_model.pkl
API_KEY=...
```

## SSL/HTTPS
- Use Let's Encrypt for free SSL certificates
- Configure reverse proxy (Nginx) for production
- Enable HTTPS in all services

## Monitoring
- Set up logging (CloudWatch, Stackdriver)
- Configure health checks
- Set up alerts for service failures



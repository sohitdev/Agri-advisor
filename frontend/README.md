# Frontend - Agri-Advisor AI

React.js frontend application for Agri-Advisor AI.

## Features

- Clean, responsive dashboard
- State/District/Season selection
- Crop recommendations display
- Environmental snapshot
- JWT authentication
- Multi-language support (English, Hindi)
- Recommendation history

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your backend API URL
```

3. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ML_SERVICE_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login, Register components
│   ├── layout/        # Navbar, Layout components
│   ├── pages/         # Dashboard, History pages
│   └── recommendations/ # Recommendation display components
├── context/           # Auth context
├── i18n/              # Internationalization
└── utils/             # API utilities
```

## Docker

```bash
docker build -t agri-frontend .
docker run -p 3000:80 agri-frontend
```



# Agri-Advisor Frontend

The frontend for Agri-Advisor AI is built with React 18, Vite, and Tailwind CSS v4. It provides an intuitive, multilingual interface for farmers and admins to request crop recommendations, view historical data, and analyze soil and weather metrics.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Core UI library |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **React Query v3** | Data fetching, caching, and state synchronization |
| **Tailwind CSS v4** | Utility-first styling |
| **react-i18next** | Internationalization (i18n) |
| **Recharts** | Data visualization for analytics |
| **Axios** | HTTP client for API requests |
| **Lucide React** | Iconography |

## Project Structure

```text
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         
│   │   ├── auth/           # Login, Register, Password Reset
│   │   ├── layout/         # Navbar, Layout wrappers
│   │   ├── pages/          # Full page views (Dashboard, History, etc.)
│   │   └── ui/             # Reusable UI primitives (Button, Card, Input)
│   ├── context/            # Global state (AuthContext)
│   ├── data/               # Static JSON data (e.g., states/districts)
│   ├── i18n/               # Internationalization configuration and translations
│   ├── lib/                # Utility functions (Tailwind class merging)
│   ├── utils/              # API configuration and Axios interceptors
│   ├── App.jsx             # Main application router
│   └── index.css           # Global styles and Tailwind directives
├── index.html              # Entry HTML file
├── vite.config.mjs         # Vite configuration
└── nginx.conf              # Nginx server block for production Docker image
```

## Available Scripts

In the `frontend` directory, you can run:

```bash
npm run start    # Starts the Vite dev server on port 3000
npm run build    # Builds the app for production to the `dist` folder
npm run preview  # Previews the production build locally
```
*(Note: There is no native test script in package.json by default, though vitest is available in devDependencies).*

## Environment Variables

Create a `.env` file in the `frontend` root. All frontend environment variables must be prefixed with `VITE_` to be exposed to the application.

```env
# URL for the backend Node.js API
VITE_API_URL=http://localhost:5000/api

# URL for the ML service API (direct access if needed, though backend acts as proxy)
VITE_ML_SERVICE_URL=http://localhost:8000
```

## Routing and Access Control

Routes are defined in `src/App.jsx`. Access to protected routes requires a valid JWT token stored in `localStorage` and managed by the `AuthContext`.

### Public Routes
- `/` - Landing Page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Password reset confirmation
- `/terms-of-service` - Legal terms
- `/about` - About the project

### Protected Routes (Require Login)
- `/dashboard` - Main recommendation entry point
- `/history` - View past recommendations
- `/recommendations` - View generated recommendations list
- `/recommendation/:id` - Detailed view of a specific recommendation
- `/history/:id` - Detailed view of a historical record
- `/analytics` - Data visualization of past crops
- `/crops` - Crop library/encyclopedia
- `/weather` - Weather dashboards
- `/soil-analysis` - Soil metrics view
- `/market-prices` - Market price tracking
- `/profile` - User profile management

## State Management and API Layer

- **AuthContext**: Located in `src/context/AuthContext.jsx`, this provides global access to the current `user` object, `login()`, and `logout()` functions. It automatically verifies tokens on mount.
- **API Configuration**: `src/utils/api.jsx` exports a pre-configured Axios instance. It automatically attaches the JWT token from `localStorage` to the `Authorization: Bearer` header for all outgoing requests.
- **Data Fetching**: The app heavily utilizes React Query (`useQuery`, `useMutation`) for caching responses, managing loading states, and handling background refetches.

## Internationalization (i18n)

The app supports multiple languages including English, Hindi, Tamil, Telugu, Kannada, Malayalam, Gujarati, and Punjabi.

**To add a new key or language:**
1. Open `src/i18n/index.jsx`.
2. Locate the dictionary object (e.g., `en: { translation: { ... } }`).
3. Add your new key-value pair.
4. In your React components, use the hook:
   ```javascript
   import { useTranslation } from 'react-i18next';
   
   function MyComponent() {
     const { t } = useTranslation();
     return <h1>{t('my_new_key')}</h1>;
   }
   ```

## UI Primitives

The project includes custom UI primitives located in `src/components/ui/` (`Button.jsx`, `Card.jsx`, `Input.jsx`). These are styled via Tailwind and merged using `clsx` and `tailwind-merge` in `src/lib/utils.js`. Always prefer these primitives over bare HTML elements to maintain design consistency.

## Build and Docker / Nginx Notes

- The `vite.config.mjs` explicitly sets the dev server to port `3000`.
- The `Dockerfile` uses a two-stage build: it runs `npm run build` and then copies the output to an `nginx:alpine` image.
- **Nginx Configuration**: `nginx.conf` listens on port `80` by default. It proxies requests hitting `/api` directly to the `backend:5000` service in Docker.
- **Port Mapping Warning**: Because the internal Nginx container exposes port 80, if you run this standalone with Docker, you must map your host port to 80 (e.g., `docker run -p 3000:80 ...`).

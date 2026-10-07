# Agri-Advisor Backend

The backend for Agri-Advisor AI is a RESTful API built with Node.js, Express 5.x, and MongoDB. It handles user authentication, data aggregation, coordinates requests with the ML Service, and stores historical crop recommendations.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment (v16.x recommended) |
| **Express v5** | Web framework and routing |
| **Mongoose** | MongoDB object modeling and schema validation |
| **JWT & bcryptjs** | Authentication and password hashing |
| **Multer** | Handling multipart/form-data for uploads |
| **Nodemailer** | Email dispatch for password resets |
| **Jest & Supertest**| Test framework and API testing |

## Project Structure

```text
backend/
├── controllers/      # Route logic and request handling
├── middleware/       # Custom Express middlewares (auth, error handling)
├── models/           # Mongoose schemas (User, Crop, Location, Recommendation)
├── routes/           # Express route definitions mapped to controllers
├── tests/            # Jest test suites
├── utils/            # Helpers (token generation, email dispatch, economics math)
├── Dockerfile        # Production Docker configuration
├── jest.config.js    # Test configuration
└── server.js         # Application entry point and server setup
```

## Available Scripts

```bash
npm run start         # Starts the server using Node
npm run dev           # Starts the server using Nodemon for local development
npm run test          # Runs Jest test suites
npm run test:coverage # Runs Jest tests with coverage reporting
```

## Environment Variables

Create a `.env` file from `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agri-advisor
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
UPLOAD_PATH=/uploads
MAX_FILE_SIZE=5MB

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# External APIs
DATA_GOV_API_KEY=your_data_gov_api_key
```

## Data Models

Located in `models/`, the MongoDB schemas include:
- **User**: Stores `name`, `email`, hashed `password`, and `role` (user/admin).
- **Crop**: Contains reference data like `name`, `scientificName`, `season`, `description`, and `minTemperature`.
- **Location**: Maps aggregated environmental data (`state`, `district`, `coordinates`, `soilData`).
- **Recommendation**: Stores the historical output from the ML Service, tracking the `user`, `location`, `season`, `recommendations` array, and the final `selectedCrop`.

## Middleware & Security

- **Auth Middleware (`auth.js`)**: Validates the JWT Bearer token.
  - `protect`: Ensures the user is logged in and attaches the user object to `req.user`.
  - `authorize(...roles)`: Restricts endpoint access to specific roles (e.g., `'admin'`).
- **Security**: The backend implements `cors` to restrict origins based on `CORS_ORIGIN`. Passwords are irreversibly hashed using `bcryptjs` before saving.

## Endpoint Reference

All endpoints are prefixed with `/api`.

### Auth & Users (`/api/auth`, `/api/users`)
| Method | Endpoint | Auth Required | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | No | `{ name, email, password }` | Creates a new user account |
| `POST` | `/auth/login` | No | `{ email, password }` | Authenticates and returns JWT |
| `GET` | `/auth/me` | Yes | - | Returns current user profile |
| `POST` | `/auth/forgot-password` | No | `{ email }` | Sends a reset email via Nodemailer |
| `POST` | `/auth/reset-password/:token`| No | `{ password }` | Resets password using email token |
| `GET` | `/auth/reverse-geocode`| No | Query: `lat`, `lon` | Returns district/state for coordinates |
| `GET` | `/users` | Yes (Admin) | - | Lists all users |
| `PUT` | `/users/:id` | Yes | `{ name, email }` | Updates user profile |

### Recommendations (`/api/recommendations`)
| Method | Endpoint | Auth Required | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/generate` | Yes | `{ state, district, season }` | **Main ML entrypoint**: Fetches soil/weather context, calls ML service, saves, and returns recommendations |
| `GET` | `/` | Yes | - | Gets all recommendations for the user |
| `GET` | `/:id` | Yes | - | Gets a specific recommendation |
| `PUT` | `/:id/select-crop` | Yes | `{ cropName, notes }` | Updates a recommendation to mark the user's final choice |
| `DELETE`| `/:id/select-crop` | Yes | - | Removes the selected crop mark |

### Agro Data & Locations (`/api/agro-data`, `/api/locations`)
| Method | Endpoint | Auth Required | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/locations/states` | No | - | Returns available states |
| `GET` | `/locations/districts/:state`| No | - | Returns available districts for a state |
| `GET` | `/agro-data/:state/:district`| No | - | Gets specific soil/climate data for a location |
| `POST` | `/agro-data/upload` | Yes (Admin) | Form: `file` | Uploads raw CSV data via Multer |

### Market Prices (`/api/market-prices`)
| Method | Endpoint | Auth Required | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/` | Yes | Query args | Returns market prices |
| `GET` | `/available-locations` | Yes | - | Returns locations with market data |

## ML Service Integration

When a user POSTs to `/api/recommendations/generate`, the backend:
1. Validates the `state`, `district`, and `season`.
2. Queries the local MongoDB `Location` collection to find historical soil data for the district.
3. Formats the data into a schema the Python ML-Service expects.
4. Makes an HTTP POST request via `axios` to `ML_SERVICE_URL/predict`.
5. Receives the `CropRecommendation` list, saves a new `Recommendation` document to MongoDB, and returns it to the client.

## Running Tests

The test suite uses Jest and Supertest, utilizing `mongodb-memory-server` to spin up an ephemeral database in memory without affecting your actual data.

```bash
npm run test
```

*Note: If testing via Docker or certain sandboxed environments, `mongodb-memory-server` might fail to bind to random local ports (e.g., EPERM errors). This is environment-specific and does not indicate failing code.*

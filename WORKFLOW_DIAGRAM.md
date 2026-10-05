# Agri-Advisor Workflow Diagram

## System Workflow

```mermaid
flowchart TD
    A["Farmer / Admin User"] --> B["React Frontend"]
    B --> C{"User Action"}

    C --> D["Register / Login"]
    C --> E["Request Crop Recommendation"]
    C --> F["View History, Dashboard, Market Prices, Weather"]

    D --> G["Backend API: Auth Routes"]
    G --> H["MongoDB: users"]
    H --> G
    G --> B

    E --> I["Backend API: Recommendation Routes"]
    I --> J["MongoDB: locations, crops, recommendations"]
    J --> I
    I --> K["FastAPI ML Service"]
    K --> L["Crop Recommendation Model / Rule-Based Fallback"]
    L --> K
    K --> I
    I --> M["Save Recommendation Record"]
    M --> J
    I --> B

    F --> N["Backend API: Data Routes"]
    N --> O["MongoDB: agro data, market data, user data"]
    O --> N
    N --> B

    B --> P["Display Results, Environmental Snapshot, Analytics"]
```

## Recommendation Flow

```mermaid
sequenceDiagram
    participant User as Farmer
    participant FE as React Frontend
    participant API as Express Backend
    participant DB as MongoDB
    participant ML as FastAPI ML Service

    User->>FE: Select state, district, and season
    FE->>API: Send recommendation request
    API->>DB: Fetch district soil, weather, and crop history
    DB-->>API: Return environmental data
    API->>ML: Send features for prediction
    ML-->>API: Return crop recommendations and yield estimates
    API->>DB: Store recommendation history
    API-->>FE: Return ranked recommendations
    FE-->>User: Show crops, explanations, and environmental snapshot
```

## Data Preparation Flow

```mermaid
flowchart LR
    A["ISRIC SoilGrids API"] --> D["Data Scripts"]
    B["OpenWeatherMap / WeatherAPI"] --> D
    C["Government Crop Yield Data"] --> D
    D --> E["Clean and Aggregate District-Level Data"]
    E --> F["MongoDB: locations and crop records"]
    F --> G["Backend Recommendation API"]
    G --> H["ML Service Input Features"]
```

## Main Components

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Frontend | React | User interface, auth screens, recommendation forms, dashboards |
| Backend | Node.js / Express | API routes, authentication, MongoDB access, ML service coordination |
| Database | MongoDB | Users, crops, locations, recommendations, historical data |
| ML Service | FastAPI / Python | Crop recommendation and yield prediction logic |
| Data Scripts | Python | Soil, weather, and crop data acquisition and aggregation |

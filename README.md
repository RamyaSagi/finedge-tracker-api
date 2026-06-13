# FinEdge Tracker API

FinEdge Tracker API is a high-performance, secure backend financial engine built on Node.js, Express, and MongoDB. The system provides seamless user management, smart transaction ingestion with automated categorization pipelines, real-time balance calculations, and an optimized in-memory TTL caching layer.

---

## 🚀 Key Features

* **Secure User Authentication:** Automated cryptographic password hashing using Mongoose hooks and stateless JWT access control.
* **Smart Ingestion Engine:** Automated real-time transaction categorizer that processes input parameters and intelligently matches spending behaviors to industry verticals (e.g., *Transportation*, *Salary*, *Dining*).
* **High-Performance Caching Layer:** Features a localized TTL memory caching strategy (`cacheService`) to eliminate heavy disk/database reading loops on consecutive analytical summary calls.
* **Centralized Error Paradigm:** Predictable, unified JSON error interceptor separating detailed engineering stack traces in development from secure, operational feedback in production.
* **Robust Test Coverage:** Integrated End-to-End integration test matrix driven by Jest and Supertest.

---

## 📂 Architecture & Directory Topology

finedge-tracker-api/
├── src/
│   ├── config/          # Infrastructure connection profiles (MongoDB, environment)
│   ├── controllers/     # Application execution logic and response routers
│   ├── middleware/      # Global guards (Auth, Loggers, Request Validators, Error Handers)
│   ├── models/          # Strict schema definition constraints (Mongoose schemas)
│   ├── routes/          # HTTP request path routing mapping structures
│   ├── services/        # Operational business logic domain execution layers
│   ├── tests/           # Integration verification suites
│   ├── app.js           # Core application configuration blueprint
│   └── server.js        # API HTTP engine network runtime bootstrapper
├── .env                 # Environment credentials configuration parameters
├── .gitignore           # Version control staging exclude boundaries
├── package.json         # Node module dependencies manifest
└── README.md            # System documentation profile

Installation & Local Setup

    1. Prerequisites: Ensure Node.js (v16+) and MongoDB are installed.

    2. Environment: Create a .env file in the root directory:
        PORT=3000
        MONGODB_URI=mongodb://localhost:27017/finedge
        JWT_SECRET=your_secret_key

    3. Install: Run npm install in your terminal.

🎮 Running the API
    Development: Run npm start.

    Testing: Run npm test.


Here are all the registered routes for the  application:

👤 User Security Routes (/users)
    These routes handle user lifecycle events, from onboarding to authenticated session management
    | HTTP Method | Route | Controller | Purpose |
    | :--- | :--- | :--- | :--- |
    | **POST** | `/users/register` | `register` | Create a new account |
    | **POST** | `/users/login` | `login` | Authenticate and get JWT |
    | **POST** | `/transactions` | `create` | Add new record |
    | **GET** | `/transactions` | `getAll` | List all records |
    | **GET** | `/transactions/:id` | `getById` | Fetch a specific record |
    | **Update** | `/transactions/:id` | `update` | up[date] a specific record |
    | **DELETE** | `/transactions/:id` | `delete` | delete a specific record |
    | **GET** | `/summary` | `getSummary` | Get financial report |
    | **GET** | `/health` | `getHealth` | Check system status |
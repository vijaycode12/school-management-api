# 🏫 School Management API

A RESTful API built with **Node.js**, **Express.js**, and **MySQL** for managing school data with proximity-based sorting.

---

## 📁 Project Structure

```
school-management-api/
├── index.js                              # Server entry point
├── schema.sql                            # SQL schema + seed data
├── .env.example                          # Environment variable template
├── SchoolManagement.postman_collection.json
└── src/
    ├── app.js                            # Express app setup
    ├── config/
    │   └── db.js                         # MySQL connection pool + auto-init
    ├── controllers/
    │   └── schoolController.js           # Business logic
    ├── middleware/
    │   └── validators.js                 # express-validator rules
    └── routes/
        └── schoolRoutes.js               # Route definitions
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL 8.x

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd school-management-api
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

### 3. Database Setup
The app **auto-creates** the database and table on first run.  
Alternatively, run the SQL file manually:
```bash
mysql -u root -p < schema.sql
```

### 4. Start the Server
```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

---

## 🛢️ Database Schema

```sql
CREATE TABLE schools (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT(10, 6)  NOT NULL,
  longitude   FLOAT(10, 6)  NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📡 API Reference

### `GET /`
Health check — confirms the server is running.

**Response `200`**
```json
{
  "success": true,
  "message": "School Management API is running",
  "version": "1.0.0"
}
```

---

### `POST /addSchool`
Add a new school to the database.

**Request Body**
```json
{
  "name":      "Kendriya Vidyalaya",
  "address":   "Banjara Hills, Hyderabad",
  "latitude":  17.4126,
  "longitude": 78.4482
}
```

| Field       | Type    | Rules                                  |
|-------------|---------|----------------------------------------|
| `name`      | string  | Required, 2–255 chars                  |
| `address`   | string  | Required, 5–500 chars                  |
| `latitude`  | float   | Required, between –90 and 90           |
| `longitude` | float   | Required, between –180 and 180         |

**Response `201`**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Kendriya Vidyalaya",
    "address": "Banjara Hills, Hyderabad",
    "latitude": 17.4126,
    "longitude": 78.4482,
    "created_at": "2025-01-01T10:00:00.000Z"
  }
}
```

**Response `422` — Validation Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "latitude", "message": "Latitude must be a number between -90 and 90" }
  ]
}
```

---

### `GET /listSchools?latitude=<lat>&longitude=<lng>`
Fetch all schools sorted by proximity to the given location.

**Query Parameters**

| Parameter   | Type  | Required | Description          |
|-------------|-------|----------|----------------------|
| `latitude`  | float | ✅       | User's latitude      |
| `longitude` | float | ✅       | User's longitude     |

**Example**
```
GET /listSchools?latitude=17.3850&longitude=78.4867
```

**Response `200`**
```json
{
  "success": true,
  "message": "Schools retrieved and sorted by proximity",
  "user_location": { "latitude": 17.385, "longitude": 78.4867 },
  "total": 2,
  "data": [
    {
      "id": 1,
      "name": "Kendriya Vidyalaya",
      "address": "Banjara Hills, Hyderabad",
      "latitude": 17.4126,
      "longitude": 78.4482,
      "distance_km": 5.63
    },
    {
      "id": 2,
      "name": "Delhi Public School",
      "address": "Sector 45, Gurugram",
      "latitude": 28.4595,
      "longitude": 77.0266,
      "distance_km": 1253.47
    }
  ]
}
```

---

## 📐 Distance Algorithm

Distance is calculated using the **Haversine formula**, which accounts for the Earth's curvature and returns the great-circle distance in kilometres.

```
a = sin²(ΔlatRad/2) + cos(lat1Rad) * cos(lat2Rad) * sin²(ΔlonRad/2)
distance = 2 * R * atan2(√a, √(1−a))     // R = 6371 km
```

---

## 🧪 Testing with Postman

1. Open Postman → **Import** → select `SchoolManagement.postman_collection.json`
2. Set the `baseUrl` variable to your server URL (default: `http://localhost:3000`)
3. Run requests in order:
   - **Health Check** — verify server
   - **Add School** (run 2–3 times with different schools)
   - **List Schools** — pass your coordinates and observe sorted results

---

## 🚀 Deployment (Render / Railway / Fly.io)

1. Push code to GitHub
2. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app)
3. Add environment variables from `.env.example`
4. Set **Start Command**: `npm start`
5. Provision a MySQL database (e.g., Railway MySQL plugin or PlanetScale)
6. Update `baseUrl` in the Postman collection to the live URL

---

## 🔒 Security Features

- **Helmet** — sets secure HTTP headers
- **CORS** — configurable cross-origin access
- **Input validation** — all inputs validated before DB write
- **Parameterised queries** — prevents SQL injection via `mysql2`

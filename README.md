# School Management API

A simple REST API built with Node.js, Express and MySQL. It lets you add schools to a database and fetch them sorted by how close they are to a given location.

---

## Project Structure

```
school-management-api/
├── app.js                        
├── package.json                  
├── .env                          
├── database/
│   ├── mysql.js                  
│   └── schema.sql                
├── config/
│   └── env.js                    
├── routes/
│   └── school.routes.js          
├── controllers/
│   └── school.controller.js      
└── middleware/
    ├── validate.middleware.js    
    └── error.middleware.js       
```

---

## Getting Started

### What you need
- Node.js v18 or above
- MySQL 8.x running locally

### 1. Clone and install
```bash
git clone <your-repo-url>
cd school-management-api
npm install
```

### 2. Set up your .env file
Create a `.env` file in the root folder and add your MySQL details:
```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=school_management
```

### 3. Create the database table
Run the schema file in MySQL:
```bash
mysql -u root -p < database/schema.sql
```

Or paste this directly in your MySQL client:
```sql
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    address    VARCHAR(500) NOT NULL,
    latitude   FLOAT(10, 6) NOT NULL,
    longitude  FLOAT(10, 6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Start the server
```bash
# development with auto-restart
npm run dev

# normal start
npm start
```

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1/schools`

---

### GET /
Health check to confirm the server is running.

**Response**
```json
{
  "success": true,
  "message": "School Management API is running"
}
```

---

### POST /api/v1/schools/addSchool
Adds a new school. All four fields are required.

**Request body**
```json
{
  "name": "Kendriya Vidyalaya",
  "address": "Banjara Hills, Hyderabad",
  "latitude": 17.4126,
  "longitude": 78.4482
}
```

**Field rules**

| Field | Type | Validation |
|---|---|---|
| name | string | Required, non-empty |
| address | string | Required, non-empty |
| latitude | number | Required, between -90 and 90 |
| longitude | number | Required, between -180 and 180 |

**Success response (201)**
```json
{
  "success": true,
  "message": "School added successfully",
  "schoolId": 1
}
```

**Validation error (400)**
```json
{
  "success": false,
  "message": "Latitude must be a number between -90 and 90"
}
```

---

### GET /api/v1/schools/listSchools
Returns all schools sorted by distance from your location. Pass your coordinates as query params.

**Query parameters**

| Parameter | Type | Required |
|---|---|---|
| latitude | number | Yes |
| longitude | number | Yes |

**Example**
```
GET /api/v1/schools/listSchools?latitude=17.3850&longitude=78.4867
```

**Response (200)**
```json
{
  "success": true,
  "count": 2,
  "schools": [
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

## How distance is calculated

Distance between the user and each school is calculated using the Haversine formula — it gives the shortest path between two coordinates on the Earth's surface in kilometres.

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
distance = 2 × R × atan2(√a, √(1−a))
```
where R = 6371 km

---

## Testing with Postman

1. Open Postman and create a new collection called `School Management API`
2. Add two requests:
   - `POST /api/v1/schools/addSchool` — with a JSON body
   - `GET /api/v1/schools/listSchools` — with latitude and longitude as params
3. Add a few schools first, then call listSchools and you'll see them sorted nearest to farthest

---

## Deploying to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project from your repo
3. Add the MySQL plugin — Railway auto-fills the DB credentials
4. Set your environment variables in the Railway dashboard
5. Run `schema.sql` in Railway's MySQL query tab to create the table
6. Railway gives you a live URL — swap that in for localhost in Postman

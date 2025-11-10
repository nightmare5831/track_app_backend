# Track App Backend

REST API server for GPS tracking application for mining equipment.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- CORS enabled

## Setup

Install dependencies:
```bash
npm install
```

Configure environment variables in `.env`:
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackapp
```

## Run

Development mode (with auto-restart):
```bash
npm start
```

Server runs at: `http://localhost:8000`

## API Endpoints

Base URL: `http://localhost:8000/api`

### Available Endpoints

- `GET /api/` - Health check
- `GET /api/hello` - Test GET request
- `POST /api/hello` - Test POST request
  - Body: `{ "name": "string", "message": "string" }`

## Project Structure

```
src/
├── config/
│   ├── index.js       # Configuration settings
│   └── database.js    # MongoDB connection
├── controllers/
│   └── testController.js
├── models/
│   └── User.js        # User schema
├── routes/
│   └── index.js       # API routes
└── server.js          # Entry point
```

## Database Models

### User
- name (String, required)
- email (String, required, unique)
- password (String, required)
- timestamps (createdAt, updatedAt)

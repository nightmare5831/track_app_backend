# Test Data Setup Guide

## Overview
This guide will help you populate your database with test data for the GPS Track App.

## Prerequisites
- MongoDB Atlas account (or local MongoDB installation)
- Backend server configured with database connection

## Step 1: Configure Environment Variables

1. Create a `.env` file in the backend root directory:
   ```bash
   cd F:\gps_track_app\app\track_app_backend
   copy .env.example .env
   ```

2. Edit the `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=your-mongodb-connection-string-here
   PORT=8000
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   ```

### Getting MongoDB Connection String:

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `trackapp`

Example:
```
mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/trackapp?retryWrites=true&w=majority
```

#### Option B: Local MongoDB
```
mongodb://localhost:27017/trackapp
```

## Step 2: Run the Seed Script

Open a terminal in the backend directory and run:

```bash
npm run seed
```

This will create:

### Test User
- Email: `test@example.com`
- Password: `password123`

### Equipment (7 items)

**Excavators:**
1. Excavator CAT 320 (EXC-001) - Capacity: 1.2m³
2. Excavator Komatsu PC200 (EXC-002) - Capacity: 1.5m³
3. Excavator Volvo EC210 (EXC-003) - Capacity: 1.3m³

**Trucks:**
1. Dump Truck CAT 770 (TRK-001) - Capacity: 50 tons
2. Dump Truck Volvo A40G (TRK-002) - Capacity: 45 tons
3. Dump Truck Komatsu HD785 (TRK-003) - Capacity: 60 tons
4. Dump Truck CAT 775 (TRK-004) - Capacity: 55 tons

### Materials (5 items)
1. Copper Ore - 1000 tons (Mine Section A)
2. Iron Ore - 1500 tons (Mine Section B)
3. Gold Ore - 500 tons (Mine Section C)
4. Waste Rock - 2000 tons (Dump Site)
5. Diesel Fuel - 5000 liters (Fuel Station)

## Step 3: Start the Backend Server

```bash
npm run dev
```

The server should start on `http://localhost:8000`

## Step 4: Test the App

1. Open your React Native app
2. Login with:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Start Operation"
4. You should now see the list of equipment!

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `.env`
- Ensure MongoDB Atlas cluster is running
- Check your network connection
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)

### Error: "Equipment list is empty"
- Make sure the seed script ran successfully
- Check the backend logs for errors
- Verify the API is returning data: http://localhost:8000/api/equipment

### Error: "Authentication failed"
- The seed script creates a test user automatically
- Use email: `test@example.com` and password: `password123`

## Re-running the Seed Script

To clear and re-populate the database, simply run:
```bash
npm run seed
```

**Note:** This will DELETE all existing equipment and materials before creating new ones!

## Data Structure Reference

### Equipment Schema
```javascript
{
  name: String,
  type: 'excavator' | 'truck' | 'drill' | 'loader' | 'other',
  registrationNumber: String (unique),
  capacity: Number,
  status: 'active' | 'inactive' | 'maintenance',
  owner: ObjectId (User reference)
}
```

### Material Schema
```javascript
{
  name: String,
  category: 'fuel' | 'explosives' | 'tools' | 'parts' | 'consumables' | 'other',
  quantity: Number,
  unit: 'kg' | 'liter' | 'piece' | 'ton' | 'meter',
  location: String,
  owner: ObjectId (User reference)
}
```

## Adding Custom Data

You can modify `src/scripts/seedData.js` to add your own equipment and materials. Just follow the schema structure above.

## Need Help?

If you encounter any issues:
1. Check the backend console logs
2. Check the React Native console logs
3. Verify your MongoDB connection
4. Ensure the backend server is running
5. Test the API endpoints directly in your browser or Postman

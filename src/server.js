import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { config } from "./config/index.js";
import { connectDB } from "./config/database.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// Start server (only if not in Vercel serverless environment)
if (process.env.VERCEL !== '1') {
  app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
    console.log(`API available at http://localhost:${config.PORT}/api`);
    console.log(`Environment: ${config.NODE_ENV}`);
  });
}

// Export for Vercel serverless functions
export default app;

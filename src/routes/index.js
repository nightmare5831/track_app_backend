import { Router } from "express";
import { healthCheck, getHello, postHello } from "../controllers/testController.js";
import { register, login } from "../controllers/authController.js";

const routes = Router();

// Health check endpoint
routes.get("/", healthCheck);

// Auth endpoints
routes.post("/auth/register", register);
routes.post("/auth/login", login);

// Test endpoints for mobile app integration
routes.get("/hello", getHello);
routes.post("/hello", postHello);

export default routes;

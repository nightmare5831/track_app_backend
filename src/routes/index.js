import { Router } from "express";
import { healthCheck, getHello, postHello } from "../controllers/testController.js";

const routes = Router();

// Health check endpoint
routes.get("/", healthCheck);

// Test endpoints for mobile app integration
routes.get("/hello", getHello);
routes.post("/hello", postHello);

export default routes;

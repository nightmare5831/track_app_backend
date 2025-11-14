import { Router } from "express";
import { healthCheck, getHello, postHello } from "../controllers/testController.js";
import { register, login } from "../controllers/authController.js";
import { getEquipment, getEquipmentById } from "../controllers/equipmentController.js";
import { getMaterials } from "../controllers/materialController.js";
import { startActivity, stopActivity, getCurrentActivity, getActivities } from "../controllers/activityController.js";
import { auth } from "../middleware/auth.js";

const routes = Router();

// Health check endpoint
routes.get("/", healthCheck);

// Auth endpoints
routes.post("/auth/register", register);
routes.post("/auth/login", login);

// Equipment endpoints
routes.get("/equipment", auth, getEquipment);
routes.get("/equipment/:id", auth, getEquipmentById);

// Material endpoints
routes.get("/materials", auth, getMaterials);

// Activity endpoints
routes.post("/activities/start", auth, startActivity);
routes.post("/activities/:id/stop", auth, stopActivity);
routes.get("/activities/current", auth, getCurrentActivity);
routes.get("/activities", auth, getActivities);

// Test endpoints for mobile app integration
routes.get("/hello", getHello);
routes.post("/hello", postHello);

export default routes;

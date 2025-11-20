import { Router } from "express";
import { healthCheck, getHello, postHello } from "../controllers/testController.js";
import { register, login } from "../controllers/authController.js";
import { getUsers, getUserById } from "../controllers/userController.js";
import { getEquipment, getEquipmentById } from "../controllers/equipmentController.js";
import { getMaterials } from "../controllers/materialController.js";
import { getActivities, getActivitiesByType, createActivity, updateActivity, addCustomReason, getActivityDetailsOptions } from "../controllers/activityController.js";
import { startOperation, stopOperation, getCurrentOperation, getOperations, getOperationById, updateOperation } from "../controllers/operationController.js";
import { getAllActiveOperations, getAllOperations, getInactivityAlerts, getDashboardStats, getOperatorsStatus } from "../controllers/adminController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const routes = Router();

// Health check endpoint
routes.get("/", healthCheck);

// Auth endpoints
routes.post("/auth/register", register);
routes.post("/auth/login", login);

// User endpoints
routes.get("/users", auth, getUsers);
routes.get("/users/:id", auth, getUserById);

// Equipment endpoints
routes.get("/equipment", auth, getEquipment);
routes.get("/equipment/:id", auth, getEquipmentById);

// Material endpoints
routes.get("/materials", auth, getMaterials);

// Activity endpoints (reference data)
routes.get("/activities", auth, getActivities);
routes.get("/activities/type/:activityType", auth, getActivitiesByType);
routes.get("/activities/:id/details", auth, getActivityDetailsOptions);
routes.post("/activities", auth, createActivity);
routes.put("/activities/:id", auth, updateActivity);
routes.post("/activities/:id/custom-reason", auth, addCustomReason);

// Operation endpoints (operational logs)
routes.post("/operations/start", auth, startOperation);
routes.post("/operations/:id/stop", auth, stopOperation);
routes.put("/operations/:id", auth, updateOperation);
routes.get("/operations/current", auth, getCurrentOperation);
routes.get("/operations", auth, getOperations);
routes.get("/operations/:id", auth, getOperationById);

// Admin endpoints (require administrator role)
routes.get("/admin/dashboard", adminAuth, getDashboardStats);
routes.get("/admin/operations", adminAuth, getAllOperations);
routes.get("/admin/operations/active", adminAuth, getAllActiveOperations);
routes.get("/admin/alerts/inactivity", adminAuth, getInactivityAlerts);
routes.get("/admin/operators/status", adminAuth, getOperatorsStatus);

// Test endpoints for mobile app integration
routes.get("/hello", getHello);
routes.post("/hello", postHello);

export default routes;

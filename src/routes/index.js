import { Router } from "express";
import { healthCheck, getHello, postHello } from "../controllers/testController.js";
import { register, login } from "../controllers/authController.js";
import { getUsers, getUserById, assignEquipment } from "../controllers/userController.js";
import { getEquipment, getEquipmentById, getAllEquipment, createEquipment, updateEquipment, deleteEquipment } from "../controllers/equipmentController.js";
import { getMaterials } from "../controllers/materialController.js";
import { getActivities, getActivitiesByType, createActivity, updateActivity, addCustomReason, getActivityDetailsOptions, deleteActivity, deleteCustomReason } from "../controllers/activityController.js";
import { startOperation, stopOperation, getCurrentOperation, getOperations, getOperationById, updateOperation } from "../controllers/operationController.js";
import { getAllActiveOperations, getAllOperations, getInactivityAlerts, getDashboardStats, getOperatorsStatus } from "../controllers/adminController.js";
import { getDailyReport, exportToExcel, getPerformanceDashboard } from "../controllers/reportController.js";
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
routes.post("/users/assign-equipment", adminAuth, assignEquipment);

// Equipment endpoints
routes.get("/equipment", auth, getEquipment);
routes.get("/equipment/:id", auth, getEquipmentById);
routes.get("/admin/equipment", adminAuth, getAllEquipment);
routes.post("/admin/equipment", adminAuth, createEquipment);
routes.put("/admin/equipment/:id", adminAuth, updateEquipment);
routes.delete("/admin/equipment/:id", adminAuth, deleteEquipment);

// Material endpoints
routes.get("/materials", auth, getMaterials);

// Activity endpoints (reference data)
routes.get("/activities", auth, getActivities);
routes.get("/activities/type/:activityType", auth, getActivitiesByType);
routes.get("/activities/:id/details", auth, getActivityDetailsOptions);
routes.post("/activities", adminAuth, createActivity);
routes.put("/activities/:id", adminAuth, updateActivity);
routes.delete("/activities/:id", adminAuth, deleteActivity);
routes.post("/activities/:id/custom-reason", auth, addCustomReason);
routes.delete("/activities/:id/custom-reason", adminAuth, deleteCustomReason);

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

// Report endpoints (admin only)
routes.get("/reports/daily", adminAuth, getDailyReport);
routes.get("/reports/export/excel", adminAuth, exportToExcel);
routes.get("/reports/performance", adminAuth, getPerformanceDashboard);

// Test endpoints for mobile app integration
routes.get("/hello", getHello);
routes.post("/hello", postHello);

export default routes;

import express from "express";
import { authorizedRoles, verifyAuth } from "../middlewares/authenticate.js";
import { getAllStats, getPatientStats } from "../controller/dashboardController.js";


const router = express.Router();

router.get(
  "/patient",
  verifyAuth,
  authorizedRoles("patient"),
  //   cacheMiddleware("patient_stats", 5000),
  getPatientStats
);

router.get(
  "/stats",
  verifyAuth,
  authorizedRoles("admin", "doctor", "nurse", "staff"),
  //   cacheMiddleware("patient_stats", 5000),
  getAllStats
);

export default router;
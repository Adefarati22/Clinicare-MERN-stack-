import express from "express";
import { validateDoctorAvailabilitySchema } from "../utils/dataSchema.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";
import { authorizedRoles, verifyAuth } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { getAllDoctors, updateDoctor } from "../controller/doctorController.js";


const router = express.Router();

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin", "doctor", "nurse", "staff"),
  cacheMiddleware("doctors", 3600),
  getAllDoctors
);

router.patch(
  "/:id/update",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateDoctorAvailabilitySchema),
  clearCache("doctors"),
  updateDoctor
);

export default router;
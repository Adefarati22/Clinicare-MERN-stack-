import express from "express";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { validatePatientSchema } from "../utils/dataSchema.js";
import { clearCache } from "../middlewares/cache.js";
import { register } from "../controllers/patientController.js";

const router = express.Router();

router.post(
  "/register",
  verifyAuth,
  authorizedRoles("admin", "patient"), //only the patient and admin can access this route
  validateFormData(validatePatientSchema),
  clearCache("auth_user"),
  register
);

export default router;

// here we handle patient-related routes - we are registering the user as a patient - this involves validating the user's information, creating a patient record, and linking it to the user account.
// after this we move to create and import our patientRoutes
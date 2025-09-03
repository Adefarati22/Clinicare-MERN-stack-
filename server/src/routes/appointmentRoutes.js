import express from "express";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";
import {
    validateBookAppointmentSchema,
  validateConfirmAppointmentSchema,
} from "../utils/dataSchema.js";
import { bookAppointment, confirmAppointment, getAllAppointments, getAppointmentMeta, getPatientAppointments, updateAppointmentPatients } from "../controller/appointmentController.js";

const router = express.Router();
router.get(
  "/meta",
  verifyAuth,
  cacheMiddleware("appointment_meta", 10600),
  getAppointmentMeta
);

router.post(
  "/book",
  verifyAuth,
  authorizedRoles("patient"),
  validateFormData(validateBookAppointmentSchema),
  clearCache("patient_appointments"),
  clearCache("appointments"),
  bookAppointment
);

router.get(
  "/patient",
  verifyAuth,
  authorizedRoles("patient"),
  cacheMiddleware("patient_appointments", 3600),
  getPatientAppointments
);

router.patch(
  "/:id/update-patient",
  verifyAuth,
  authorizedRoles("patient"),
  validateFormData(validateBookAppointmentSchema),
  clearCache("patient_appointments"),
  updateAppointmentPatients
);

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin"),
  cacheMiddleware("appointments", 3600),
  getAllAppointments
);

router.patch(
  "/:id/update",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateConfirmAppointmentSchema),
  clearCache("appointments"),
  clearCache("patient_appointments"),
  confirmAppointment
);

export default router;
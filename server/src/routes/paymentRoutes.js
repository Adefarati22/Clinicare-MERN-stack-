import express from "express";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";
import { validateCreatePaymentSchema } from "../utils/dataSchema.js";
import { createPayment, getAllPayments, getPatientPayments, updatePaymentStatus } from "../controller/paymentController.js";


const router = express.Router();

router.post(
  "/create",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateCreatePaymentSchema),
  clearCache("payments"),
  clearCache("patient_payments"),
  createPayment
);

router.get(
  "/patient",
  verifyAuth,
  authorizedRoles("patient"),
  cacheMiddleware("patient_payments", 3600),
  getPatientPayments
);

router.patch(
  "/:id/update-payment_status",
  verifyAuth,
  clearCache("patient_payments"),
  clearCache("payments"),
  updatePaymentStatus
);

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin"),
  cacheMiddleware("payments", 3600),
  getAllPayments
);

export default router;
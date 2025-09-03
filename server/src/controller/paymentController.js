import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import paymentService from "../services/payment.service.js";
const { successResponse } = responseHandler;

export const createPayment = tryCatchFn(async (req, res, next) => {
  const responseData = await paymentService.createPayment(req.body, next);
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Payment created, An email has been sent to the receipient.",
    201
  );
});

export const getPatientPayments = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const { page, limit, query, status, startDate, endDate } = req.query;
  const responseData = await paymentService.getPatientPayments(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    startDate,
    endDate,
    userId,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Patient payments data fetched successfully",
    200
  );
});

export const updatePaymentStatus = tryCatchFn(async (req, res, next) => {
  const { id: paymentId } = req.params;
  const responseData = await paymentService.updatePaymentStatus(
    paymentId,
    req.body.reference,
    next
  );
  if (!responseData) return;
  return successResponse(res, responseData, "Payment status confirmed", 200);
});

export const getAllPayments = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, status, startDate, endDate } = req.query;
  const responseData = await paymentService.getAllPayments(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    startDate,
    endDate,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Payments data fetched successfully",
    200
  );
});
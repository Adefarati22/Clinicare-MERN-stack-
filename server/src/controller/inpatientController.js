import inpatientService from "../services/inpatient.service.js";
import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
const { successResponse } = responseHandler;

export const register = tryCatchFn(async (req, res, next) => {
  const responseData = await inpatientService.register(req.body, next);
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Inpatient registered successfully",
    201
  );
});

export const getAllInpatients = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, status, admissionDate, dischargeDate } =
    req.query;
  const responseData = await inpatientService.getAllInpatients(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    admissionDate,
    dischargeDate,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Inpatients data fetched successfully",
    200
  );
});

export const updateInpatient = tryCatchFn(async (req, res, next) => {
  const { id: inpatientId } = req.params;
  const responseData = await inpatientService.updateInpatient(
    inpatientId,
    req.body,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Inpatient updated successfully",
    200
  );
});
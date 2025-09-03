import doctorService from "../services/doctor.service.js";
import responseHandler from "../utils/responseHandler.js";
import tryCatchFn from "../utils/tryCatchFn.js";
const { successResponse } = responseHandler;

export const getAllDoctors = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, specialization, availability } = req.query;
  const responseData = await doctorService.getAllDoctors(
    parseInt(page),
    parseInt(limit),
    query,
    specialization,
    availability,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Doctors data fetched successfully",
    200
  );
});

export const updateDoctor = tryCatchFn(async (req, res, next) => {
  const { id: doctorId } = req.params;
  const responseData = await doctorService.updateDoctor(
    doctorId,
    req.body,
    next
  );
  if (!responseData) return;
  return successResponse(res, responseData, "Doctor updated successfully", 200);
});
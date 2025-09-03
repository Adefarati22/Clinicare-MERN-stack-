import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import dashboardService from "../services/dashboard.service.js";
const { successResponse } = responseHandler;

export const getPatientStats = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const patientStats = await dashboardService.getPatientStats(userId, next);
  if (!patientStats) return;
  return successResponse(
    res,
    patientStats,
    "Patient stats data fetched successfully",
    200
  );
});

export const getAllStats = tryCatchFn(async (req, res, next) => {
  const stats = await dashboardService.getAllStats(next);
  if (!stats) return;
  return successResponse(res, stats, "Stats data fetched successfully", 200);
});
import tryCatchFn from "../utils/tryCatchFn.js";
import patientService from "../services/patient.service.js";
import responseHandler from "../utils/responseHandler.js";
const { successResponse } = responseHandler;

export const register = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await patientService.register(userId, req.body, next);
  if (!responseData) return;
  return successResponse(res, responseData, "Onboarding completed", 201);
});

export const getPatient = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await patientService.getPatient(userId, next);
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Patient fetched successfully",
    200
  );
});

export const updatePatient = tryCatchFn(async (req, res, next) => {
  const { id: patientId } = req.params; //params is a way to collect values on the url, when we use useParams its means the url is going to be dynamic
  const responseData = await patientService.updatePatient(
    patientId,
    req.body,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Patient updated successfully",
    200
  );
});

export const getAllPatients = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, gender, bloodGroup } = req.query;
  const responseData = await patientService.getAllPatients(
    parseInt(page),
    parseInt(limit),
    query,
    gender,
    bloodGroup,
    next
  );
  return successResponse(
    res,
    responseData,
    "Patients data fetched successfully",
    200
  );
});
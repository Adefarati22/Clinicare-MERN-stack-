import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
import appointmentService from "../services/appointment.service.js";
const { successResponse } = responseHandler;

export const getAppointmentMeta = tryCatchFn(async (req, res, next) => {
  const appointmentMeta = await appointmentService.getAppointmentMeta(next);
  if (!appointmentMeta) return;
  return successResponse(
    res,
    appointmentMeta,
    "Appointment meta data fetched successfully",
    200
  );
});

export const bookAppointment = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const appointment = await appointmentService.bookAppointment(
    {
      ...req.body,
      userId,
    },
    next
  );
  if (!appointment) return;
  return successResponse(
    res,
    appointment,
    "Appointment booked! You will receive a confirmation email",
    201
  );
});

export const getPatientAppointments = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const { page, limit, query, status, time, startDate, endDate } = req.query;
  const responseData = await appointmentService.getPatientAppointments(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    time,
    startDate,
    endDate,
    userId,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Patient appointments data fetched successfully",
    200
  );
});

export const updateAppointmentPatients = tryCatchFn(async (req, res, next) => {
  const { id: appointmentId } = req.params;
  const responseData = await appointmentService.updateAppointmentPatients(
    appointmentId,
    req.body,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Appointment updated successfully",
    200
  );
});

export const getAllAppointments = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, status, time, startDate, endDate } = req.query;
  const responseData = await appointmentService.getAllAppointments(
    parseInt(page),
    parseInt(limit),
    query,
    status,
    time,
    startDate,
    endDate,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Appointments fetched successfully",
    200
  );
});

export const confirmAppointment = tryCatchFn(async (req, res, next) => {
  const { id: appointmentId } = req.params;
  const responseData = await appointmentService.confirmAppointment(
    appointmentId,
    req.body,
    next
  );
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Appointment updated successfully",
    200
  );
});
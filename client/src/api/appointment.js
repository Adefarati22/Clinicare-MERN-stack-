import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";


export const getAppointmentMeta = async (accessToken) => {
  return await axiosInstances.get("/appointments/meta", headers(accessToken));
};

export const bookAppointment = async ({ formData, accessToken }) => {
  return await axiosInstances.post(
    "/appointments/book",
    formData,
    headers(accessToken)
  );
};

export const getPatientsAppointment = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const time = searchParams.get("time") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (status) params.append("status", status);
  if (time) params.append("time", time);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return await axiosInstances.get(
    `/appointments/patient?${params.toString()}`,
    headers(accessToken)
  );
};

export const updatePatientsAppointment = async ({
  appointmentId,
  formData,
  accessToken,
}) => {
  return await axiosInstances.patch(
    `/appointments/${appointmentId}/update-patient`,
    formData,
    headers(accessToken)
  );
};

export const getAllAppointments = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const time = searchParams.get("time") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (time) params.append("time", time);
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return await axiosInstances.get(
    `/appointments/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const updateAppointmentStatus = async ({
  appointmentId,
  formData,
  accessToken,
}) => {
  return await axiosInstances.patch(
    `/appointments/${appointmentId}/update`,
    formData,
    headers(accessToken)
  );
};
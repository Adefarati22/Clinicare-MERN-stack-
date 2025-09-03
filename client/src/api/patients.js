import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";

export const registerPatient = async ({ formData, accessToken }) => {
  return await axiosInstances.post(
    "/patients/register",
    formData,
    headers(accessToken)
  );
};

export const getPatient = async (accessToken) => {
  return await axiosInstances.get("/patients/me", headers(accessToken));
};


export const updatePatient = async ({ patientId, formData, accessToken }) => {
  return await axiosInstances.patch(`
    /patients/${patientId}/update`,
    formData,
    headers(accessToken)
  );
};


export const getAllPatients = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const gender = searchParams.get("gender") || "";
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const params = new URLSearchParams(); //js
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (gender) params.append("gender", gender);
  if (bloodGroup) params.append("bloodGroup", bloodGroup);
  return await axiosInstances.get(
    `/patients/all?${params.toString()}`,
    headers(accessToken)
  );
};


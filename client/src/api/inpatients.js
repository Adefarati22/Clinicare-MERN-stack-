import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";


export const createInpatient = async ({ formData, accessToken }) => {
  return await axiosInstances.post(
    "/inpatients/register",
    formData,
    headers(accessToken)
  );
};

export const getAllInpatients = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const admissionDate = searchParams.get("admissionDate") || "";
  const dischargeDate = searchParams.get("dischargeDate") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (status) params.append("status", status);
  if (admissionDate) params.append("admissionDate", admissionDate);
  if (dischargeDate) params.append("dischargeDate", dischargeDate);
  return await axiosInstances.get(
    `/inpatients/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const updateInpatient = async ({ patientId, formData, accessToken }) => {
  return await axiosInstances.patch(
    `/inpatients/${patientId}/update`,
    formData,
    headers(accessToken)
  );
};
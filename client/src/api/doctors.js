import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";

export const getAllDoctors = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const specialization = searchParams.get("specialization") || "";
    const availability = searchParams.get("availability") || "";
  const params = new URLSearchParams(); //js
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (specialization) params.append("specialization", specialization);
    if (availability) params.append("availability", availability);
  return await axiosInstances.get(
    `/doctors/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const updateDoctor = async ({ doctorId, doctor, accessToken }) => {
  return await axiosInstances.patch(
    `/doctors/${doctorId}/update`,
    doctor,
    headers(accessToken)
  );
};
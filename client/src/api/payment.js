import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";

export const createPayment = async ({ formData, accessToken }) => {
  return await axiosInstances.post(
    "/payments/create",
    formData,
    headers(accessToken)
  );
};

export const getPatientPayments = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return await axiosInstances.get(
    `/payments/patient?${params.toString()}`,
    headers(accessToken)
  );
};

export const updatePaymentStatus = async ({
  paymentId,
  reference,
  accessToken,
}) => {
  return await axiosInstances.patch(
    `/payments/${paymentId}/update-payment_status`,
    { reference },
    headers(accessToken)
  );
};

export const getAllPayments = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return await axiosInstances.get(
    `/payments/all?${params.toString()}`,
    headers(accessToken)
  );
};
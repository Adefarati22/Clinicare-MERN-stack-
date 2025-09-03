import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";


export const getPatientStats = async (accessToken) => {
  return await axiosInstances.get("/dashboard/patient", headers(accessToken));
};

export const getAllStats = async (accessToken) => {
  return await axiosInstances.get("/dashboard/stats", headers(accessToken));
};
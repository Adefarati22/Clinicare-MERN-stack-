import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";

export const createRoom = async ({ formData, accessToken }) => {
  return await axiosInstances.post(
    "/rooms/create",
    formData,
    headers(accessToken)
  );
};

export const getRoomMeta = async (accessToken) => {
  return await axiosInstances.get("/rooms/meta", headers(accessToken));
};

export const getAllRooms = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const roomType = searchParams.get("roomType") || "";
    const roomStatus = searchParams.get("roomStatus") || "";
  const params = new URLSearchParams(); //js
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (roomType) params.append("roomType", roomType);
    if (roomStatus) params.append("roomStatus", roomStatus);
  return await axiosInstances.get(
    `/rooms/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const updateRoom = async ({ roomId, room, accessToken }) => {
  return await axiosInstances.patch(
    `/rooms/${roomId}/update`,
    room,
    headers(accessToken)
  );
};
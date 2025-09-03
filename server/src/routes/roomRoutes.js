import express from "express";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { validateRoomSchema } from "../utils/dataSchema.js";
import { clearCache, cacheMiddleware } from "../middlewares/cache.js";
import { createRoom, getAllRooms, getRoomMeta, updateRoom } from "../controller/roomController.js";

const router = express.Router();

router.post(
  "/create",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateRoomSchema),
  clearCache("rooms"),
  createRoom
);

router.get(
  "/meta",
  verifyAuth,
  authorizedRoles("admin"),
  cacheMiddleware("room_meta", 30000), //time
  getRoomMeta
);

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin", "doctor", "staff"),
  cacheMiddleware("rooms", 10600),
  getAllRooms
);

router.patch(
  "/:id/update",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateRoomSchema),
  clearCache("rooms"),
  updateRoom
);
export default router;

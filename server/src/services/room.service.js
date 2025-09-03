import Room from "../models/room.js";
import { roomInfo, roomStatus, roomType } from "../utils/constant.js";
import responseHandler from "../utils/responseHandler.js";

const { errorResponse, notFoundResponse } = responseHandler;

const roomService = {
  createRoom: async (roomData, next) => {
    const roomExists = await Room.findOne({ roomNumber: roomData.roomNumber });
    if (roomExists) {
      return next(errorResponse("Room number already exists", 400));
    }
    const room = await Room.create({
      ...roomData,
    });
    return room;
  },
  getRoomMeta: async () => {
    const roomMeta = {
      roomType,
      roomStatus,
      roomInfo,
    };
    return roomMeta;
  },
  getAllRooms: async (
    page = 1,
    limit = 10,
    query = "",
    roomType = "",
    roomStatus = "",
    next
  ) => {
    const sanitizeQuery = query.toLowerCase().replace(/[^\w+-]/gi, "");
    const [rooms, total] =
      sanitizeQuery || roomType || roomStatus
        ? await Promise.all([
            Room.find({
              $or: [
                {
                  roomDescription: { $regex: sanitizeQuery, $options: "i" },
                },
              ],
              ...(roomType && { roomType: roomType }),
              ...(roomStatus && { roomStatus: roomStatus }),
            })
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Room.countDocuments({
              $or: [
                {
                  roomDescription: { $regex: sanitizeQuery, $options: "i" },
                },
              ],
              ...(roomType && { roomType: roomType }),
              ...(roomStatus && { roomStatus: roomStatus }),
            }),
          ])
        : await Promise.all([
            Room.find()
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Room.countDocuments(),
          ]);
    if (!rooms) {
      return next(notFoundResponse("No rooms found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + rooms.length < total,
        limit,
      },
      rooms,
    };
  },
  //updating room data
    updateRoom: async (roomId, roomData, next) => {
      const room = await Room.findById(roomId); //here we are finding a particular document so as we can update it
      if (!room) {
        return next(notFoundResponse("No room found"));
      }
      for (const [key, value] of Object.entries(roomData)) {
        if (value) {
          room[key] = value;
        }
      }
      const updatedRoom = await room.save();
      return updatedRoom;
    },
};

export default roomService;

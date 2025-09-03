import mongoose, { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    roomNumber: {
      type: Number,
      required: [true, "Room number is required"],
      unique: true,
      min: [1, "Room number must be at least 1"],
      max: [20, "Room number must be at most 20"],
    },
    roomType: {
      type: String,
      required: [true, "Room type is required"],
      enum: ["Regular", "VIP", "ICU", "Deluxe", "Suite"],
    },
    roomPrice: {
      type: Number,
      required: [true, "Room price is required"],
    },
    roomDescription: {
      type: String,
      required: [true, "Room description is required"],
      minlength: [3, "Room description must be at least 3 characters long"],
    },
    roomStatus: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
    },
    roomCapacity: {
      type: Number,
      required: [true, "Room capacity is required"],
      min: [1, "Room capacity must be at least 1"],
      max: [5, "Room capacity must be at most 5"],
    },
    occupants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isFilled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({ roomType: 1 });
roomSchema.index({ roomPrice: 1 });
roomSchema.index({ roomCapacity: 1 });
roomSchema.index({ roomDescription: 1 });

const Room = mongoose.models.Room || model("Room", roomSchema);

export default Room;
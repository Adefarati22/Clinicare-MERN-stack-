import mongoose, { Schema, model } from "mongoose";

const doctorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    availability: {
      type: String,
      enum: ["available", "unavailable", "on leave", "sick"],
      default: "available",
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      maxlength: [50, "Specialization cannot be more than 50 characters"],
      enum: [
        "Cardiology",
        "Dermatology",
        "Gastroenterology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Psychiatry",
        "Urology",
      ],
    },
  },
  {
    timestamps: true,
  }
);

doctorSchema.index({ availability: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ userId: 1 });

const Doctor = mongoose.models.Doctor || model("Doctor", doctorSchema);

export default Doctor;
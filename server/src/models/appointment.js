import mongoose, { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    appointmentTime: {
      type: String,
      enum: ["10:00 AM", "1:00 PM", "3:00 PM"],
      required: [true, "Appointment time is required"],
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
      maxlength: [255, "Notes cannot be more than 255 characters"],
      required: [true, "Notes is required"],
    },
    response: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ appointmentTime: 1 });

const Appointment =
  mongoose.models.Appointment || model("Appointment", appointmentSchema);

export default Appointment;
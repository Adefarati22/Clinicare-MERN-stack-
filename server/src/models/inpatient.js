import mongoose, { Schema, model } from "mongoose";

const inpatientSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment is required"],
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    status: {
      type: String,
      enum: ["admitted", "discharged", "transferred"],
      default: "admitted",
    },
    admissionDate: {
      type: Date,
      required: [true, "Admission date is required"],
    },
    dischargeDate: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [255, "Notes cannot be more than 255 characters"],
      required: [true, "Notes is required"],
    },
  },
  {
    timestamps: true,
  }
);

inpatientSchema.index({ patientId: 1 });
inpatientSchema.index({ doctorId: 1 });
inpatientSchema.index({ roomId: 1 });
inpatientSchema.index({ status: 1 });
inpatientSchema.index({ admissionDate: 1 });
inpatientSchema.index({ dischargeDate: 1 });

const Inpatient =
  mongoose.models.Inpatient || model("Inpatient", inpatientSchema);

export default Inpatient;
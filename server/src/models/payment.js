import mongoose, { model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: [255, "Notes cannot be more than 255 characters"],
      required: [true, "Notes is required"],
    },
    paymentType: {
      type: String,
      enum: ["appointment", "admission", "other"],
    },
    paidAt: {
      type: Date,
    },
    reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ patientId: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.models.Payment || model("Payment", paymentSchema);

export default Payment;
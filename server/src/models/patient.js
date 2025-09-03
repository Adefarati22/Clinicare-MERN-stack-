import mongoose, { Schema, model } from "mongoose";

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Reference(ref) to the User model, - objectId is a unique identifier for documents in MongoDB
      ref: "User",
      required: [true, "User ID is required"], //the userId is required to associate the patient with a specific user - by referencing the User model we are going to use their objectId from mongoDB 
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    bloodGroup: {
      type: String,
      enum: [
        "A-positive",
        "A-negative",
        "B-positive",
        "B-negative",
        "AB-positive",
        "AB-negative",
        "O-positive",
        "O-negative",
      ],
      required: [true, "Blood group is required"],
    },
    emergencyContact: {
      type: String,
      required: [true, "Emergency contact is required"],
    },
    emergencyContactPhone: {
      type: String,
      required: [true, "Emergency contact phone is required"],
    },
    emergencyContactRelationship: {
      type: String,
      required: [true, "Emergency contact relationship is required"],
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ fullname: 1 });
patientSchema.index({ dateOfBirth: 1 });
patientSchema.index({ address: 1 });
patientSchema.index({ gender: 1 });
patientSchema.index({ bloodGroup: 1 });

const Patient = mongoose.models.Patient || model("Patient", patientSchema);

export default Patient;
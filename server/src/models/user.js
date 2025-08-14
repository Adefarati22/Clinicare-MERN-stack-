// the schema for the user
import mongoose, { Schema, model } from "mongoose";

// we define our schema first and later pass it to the model
const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    // trimming the spaces, the trim true cleans or close up the space left by the user
    trim: true,
    maxlength: [50, "Full name cannot be more than 50 characters"], //optional
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true, //this is to make sure that you don't use the same email to register again
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, //prevent password field from being sent to client
  },
  dateOfBirth: {
    type: Date,
  },
  phone: {
    type: String,
    maxlength: [14, "Phone number must not exceed 11 digit"],
  },
  avatar: {
    type: String, //its a string bcs cloudinary will help us convert the img to a url string
    default: "", // it can be blank or you can post the cloudinary url for default
  },
  avatarId: {
    //used to track the id attached to our avatar url from cloudinary incase if the user wants to delete their avatar img, so we will be able to delete from cloudinary and our database
    type: String,
  },
  role: {
    type: String,
    enum: ["patient", "doctor", "nurse", "staff", "admin"], //predefined options that must be selected
    default: "patient",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    // the otp will be saved here then compared to the token the user will input after they have received the token
    type: String,
    select: false,
  },
  verificationTokenExpiry: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetTokenExpiry: {
    type: Date,
    select: false,
  },
  isCompletedOnboard: {
    type: Boolean,
    default: false,
    select: function() {
        return this.role === "patient";
        // show field only if the user role is "patient"
    },
  },
}, 
{
// we want mongodb to create a time when each document was created
timestamps: true, //includes a createdAt and updatedAT when a doc is created
}
);

const User = mongoose.models.User || model("User", userSchema); //this checks if a model named User already exists to prevent subsequent checks, if it does not exist then it creates  it, it is useful when compiling your schema as you make changes or mongoose.models.User helps to check a list of collection to see if it exist already and if not it will create a new one (models- the collection inside the models, model-to create a single model for the new collection ) 

export default User;
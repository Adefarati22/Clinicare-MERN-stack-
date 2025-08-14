import Patient from "../models/patient.js";
import User from "../models/user.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const patientService = {
  register: async (userId, patientData, next) => {
    const patientExists = await Patient.findOne({ email: patientData.email });
    if (patientExists) {
      return next(errorResponse("Patient already exists", 400));
    }
    const patient = await Patient.create({
      userId,
      ...patientData,
    });
    //update and save user patient profile
    const user = await User.findById(userId);
    user.isCompletedOnboard = true;
    user.phone = patientData.phone;
    user.dateOfBirth = patientData.dateOfBirth;
    await user.save();
    return patient;
  },
};

export default patientService;

//the patientData is an object containing the patient's information such as fullname, email, dateOfBirth, phone, address, gender, bloodGroup, emergencyContact, emergencyContactPhone, and emergencyContactRelationship.
//we check to see if our patient already exists in the database by searching for a patient with the same email address.
//the userId is the unique identifier for the user associated with the patient record. - it is used to link the patient information to the specific user in the database. - we use it when creating the patient record to ensure it is associated with the correct user.
//userId will also be used to update the user information after the patient record is created. and populate the user fields with the patient information.
//we spread the patientData object to include all the patient's information when creating the patient record.
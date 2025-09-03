import Doctor from "../models/doctor.js";
import Inpatient from "../models/inpatient.js";
import Patient from "../models/patient.js";
import Payment from "../models/payment.js";
import Room from "../models/room.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const inpatientService = {
 register: async (formData, next) => {
    const admissionDate = new Date(formData.admissionDate);
    const dischargeDate = new Date(formData.dischargeDate);
    const currentDate = new Date();
    admissionDate.setHours(0, 0, 0, 0);
    dischargeDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (admissionDate < currentDate) {
      return next(errorResponse("Admission date cannot be in the past", 400));
    }
    if (dischargeDate < admissionDate) {
      return next(
        errorResponse("Discharge date cannot be before admission date", 400)
      );
    }
    const payment = await Payment.findOne({
      roomId: formData.roomId.toString(),
    });
    if (!payment) {
      return next(
        notFoundResponse("Cannot admit patient, Payment not found", 404)
      );
    } else if (payment.status !== "confirmed") {
      return next(errorResponse("Payment status not confirmed", 400));
    }
    const room = await Room.findById(formData.roomId);
    if (!room) {
      return next(notFoundResponse("Room not found", 404));
    } else if (room.roomPrice !== payment.amount) {
      return next(errorResponse("Payment amount and roomPrice do not match"));
    } else if (room.isFilled) {
      return next(errorResponse("Room is already filled", 400));
    } else if (room.roomStatus !== "available") {
      return next(errorResponse("Room is not available", 400));
    }
    const inpatientExists = await Inpatient.findOne({
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      roomId: formData.roomId,
      paymentId: payment._id,
      status: "admitted",
    });
    if (inpatientExists) {
      return next(errorResponse("Inpatient already exists", 400));
    }
    if (inpatientExists && inpatientExists.status === "discharged") {
      return next(
        errorResponse(
          "Payment for this room is used. Inpatient already discharged",
          400
        )
      );
    }
    const inpatient = await Inpatient.create({
      ...formData,
      paymentId: payment._id,
    });
    if (!inpatient) {
      return next(errorResponse("Inpatient could not be created", 400));
    }
    if (room.occupants.includes(inpatient.patientId)) {
      return next(errorResponse("Patient already in room", 400));
    }
    room.occupants.push(inpatient.patientId);
    if (room.occupants.length === room.roomCapacity) {
      room.isFilled = true;
    }
    await room.save();
    return inpatient;
  },
  getAllInpatients: async (
    page = 1,
    limit = 10,
    query = "",
    status = "",
    admissionDate = "",
    dischargeDate = "",
    next
  ) => {
    const sanitizeAdmissionDate = admissionDate
      ? new Date(admissionDate)
      : null;
    const sanitizeDischargeDate = dischargeDate
      ? new Date(dischargeDate)
      : null;
    const sanitizeQuery = query
      ? query.toLowerCase().replace(/[^\w\s]/gi, "")
      : "";
    const [matchingDoctors, matchingPatients] = await Promise.all([
      Doctor.find().populate("userId", "fullname").select("_id").lean(),
      Patient.find({
        $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
      })
        .select("_id")
        .lean(),
    ]);

    const doctorIds = matchingDoctors.map((doc) =>
      doc.userId.fullname.toLowerCase().includes(sanitizeQuery)
        ? doc.userId._id
        : null
    );
    const patientIds = matchingPatients.map((patient) => patient._id);
    const [inpatients, total] =
      sanitizeQuery || status || admissionDate || dischargeDate
        ? await Promise.all([
            Inpatient.find({
              ...(sanitizeQuery && {
                $or: [
                  { doctorId: { $in: doctorIds } },
                  { patientId: { $in: patientIds } },
                ],
              }),
              ...(status && { status: status }),
              ...(sanitizeAdmissionDate || sanitizeDischargeDate
                ? {
                    admissionDate: {
                      ...(sanitizeAdmissionDate && {
                        $gte: sanitizeAdmissionDate,
                      }),
                      ...(sanitizeDischargeDate && {
                        $lte: new Date(
                          sanitizeDischargeDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            })
              .populate("patientId", "fullname email phone")
              .populate("doctorId", "fullname")
              .populate("roomId", "roomNumber roomType")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Inpatient.countDocuments({
              ...(sanitizeQuery && {
                $or: [
                  { doctorId: { $in: doctorIds } },
                  { patientId: { $in: patientIds } },
                ],
              }),
              ...(status && { status: status }),
              ...(sanitizeAdmissionDate || sanitizeDischargeDate
                ? {
                    admissionDate: {
                      ...(sanitizeAdmissionDate && {
                        $gte: sanitizeAdmissionDate,
                      }),
                      ...(sanitizeDischargeDate && {
                        $lte: new Date(
                          sanitizeDischargeDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            }),
          ])
        : await Promise.all([
            Inpatient.find()
              .populate("patientId", "fullname email phone")
              .populate("doctorId", "fullname")
              .populate("roomId", "roomNumber roomType")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Inpatient.countDocuments(),
          ]);
    if (!inpatients) {
      return next(notFoundResponse("No inpatients found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + inpatients.length < total,
        limit,
      },
      inpatients,
    };
  },
 updateInpatient: async (inpatientId, formData, next) => {
    const admissionDate = new Date(formData.admissionDate);
    const dischargeDate = new Date(formData.dischargeDate);
    const currentDate = new Date();
    admissionDate.setHours(0, 0, 0, 0);
    dischargeDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (admissionDate < currentDate) {
      return next(errorResponse("Admission date cannot be in the past", 400));
    }
    if (dischargeDate < admissionDate) {
      return next(
        errorResponse("Discharge date cannot be before admission date", 400)
      );
    }
    const inpatient = await Inpatient.findById(inpatientId);
    if (!inpatient) {
      return next(notFoundResponse("Inpatient not found"));
    }
    for (const [key, value] of Object.entries(formData)) {
      if (value) {
        inpatient[key] = value;
      }
    }
    if (["discharged", "transferred"].includes(formData.status)) {
      inpatient.dischargeDate = Date.now();
      const room = await Room.findById(formData.roomId);
      room.occupants = room.occupants.filter(
        (occupant) => occupant.toString() !== inpatient.patientId.toString()
      );
      await room.save();
      await inpatient.save();
    }
    const updatedInPatient = await inpatient.save();
    return updatedInPatient;
  },
};

export default inpatientService;
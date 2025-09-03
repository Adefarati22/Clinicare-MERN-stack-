import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import Room from "../models/room.js";
import Payment from "../models/payment.js";
import responseHandler from "../utils/responseHandler.js";
import mailService from "./email.service.js";
const { errorResponse, notFoundResponse } = responseHandler;

const appointmentService = {
  getAppointmentMeta: async (next) => {
    const [patientMeta, doctorMeta, appointmentMeta, roomMeta] =
      await Promise.all([
        Patient.find().select("userId").populate("userId", "fullname").lean(),
        Doctor.find({ availability: "available" })
          .select("userId")
          .populate("userId", "fullname")
          .lean(),
        Appointment.find({ status: "scheduled" })
          .populate("patientId", "fullname")
          .lean(),
        Room.find({ isFilled: false, roomStatus: "available" }).lean(),
      ]);
    if (!patientMeta || !doctorMeta || !appointmentMeta || !roomMeta) {
      return next(
        notFoundResponse("No patient, doctor, rooms or appointments found")
      );
    }
    return {
      patientMeta,
      doctorMeta,
      appointmentMeta,
      roomMeta,
    };
  },
  bookAppointment: async (appointmentData, next) => {
    const appointmentDate = new Date(appointmentData.appointmentDate);
    const currentDate = new Date();
    appointmentDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (appointmentDate < currentDate) {
      return next(errorResponse("Appointment date cannot be in the past", 400));
    }
    const appointmentExists = await Appointment.findOne({
      patientId: appointmentData.userId,
      appointmentTime: appointmentData.appointmentTime,
      appointmentDate: appointmentData.appointmentDate,
    }).lean();
    if (
      appointmentExists &&
      new Date(appointmentData.appointmentDate) ===
        new Date(appointmentExists.appointmentDate)
    ) {
      return next(errorResponse("Appointment time already booked", 400));
    }
    const appointmentTimeExists = await Appointment.findOne({
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
    }).lean();
    if (appointmentTimeExists) {
      return next(
        errorResponse("Appointment time already exists for same date", 400)
      );
    }
    const appointment = await Appointment.create({
      ...appointmentData,
      patientId: appointmentData.userId,
    });
    return appointment;
  },
  getPatientAppointments: async (
    page = 1,
    limit = 10,
    query = "",
    status = "",
    time = "",
    startDate = "",
    endDate = "",
    userId,
    next
  ) => {
    const sanitizeStartDate = startDate ? new Date(startDate) : null;
    const sanitizeEndDate = endDate ? new Date(endDate) : null;
    const matchingPatient = await Patient.findOne({ userId: userId.toString() })
      .select("userId")
      .lean();
    if (!matchingPatient) {
      return next(notFoundResponse("No patient found"));
    }
    const [appointments, total] =
      query || status || time || startDate || endDate
        ? await Promise.all([
            Appointment.find({
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    appointmentDate: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            })
              .populate("patientId", "fullname email phone")
              .populate("doctorId", "fullname")
              .sort({ appointmentDate: 1, appointmentTime: 1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments({
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    date: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            }),
          ])
        : await Promise.all([
            Appointment.find({
              patientId: matchingPatient.userId.toString(),
            })
              .populate("patientId", "fullname email")
              .populate("doctorId", "fullname")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments({
              patientId: matchingPatient.userId.toString(),
            }),
          ]);
    if (!appointments) {
      return next(notFoundResponse("No appointments found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + appointments.length < total,
        limit,
      },
      appointments,
    };
  },
  updateAppointmentPatients: async (appointmentId, appointmentData, next) => {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(notFoundResponse("No appointment found"));
    }
    if (appointment.status === "cancelled") {
      return next(
        errorResponse(
          "Appointment has been cancelled by admin. Please create a new one"
        )
      );
    }
    if(appointment.status === "confirmed") {
      return next(
        errorResponse(
          "Appointment has been confirmed by admin. Please create a new one"
        )
      )
    }
    for (const [key, value] of Object.entries(appointmentData)) {
      if (value) {
        appointment[key] = value;
      }
    }
    const updatedAppointment = await appointment.save();
    return updatedAppointment;
  },
  getAllAppointments: async (
    page = 1,
    limit = 10,
    query = "",
    status = "",
    time = "",
    startDate = "",
    endDate = "",
    next
  ) => {
    const sanitizeStartDate = startDate ? new Date(startDate) : null;
    const sanitizeEndDate = endDate ? new Date(endDate) : null;
    const sanitizeQuery = query
      ? query
          .trim()
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
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

    const [appointments, total] =
      sanitizeQuery || time || status || startDate || endDate
        ? await Promise.all([
            Appointment.find({
              ...(sanitizeQuery && {
                $or: [
                  { doctorId: { $in: doctorIds } },
                  { patientId: { $in: patientIds } },
                ],
              }),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    appointmentDate: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999)
                        ),
                      }),
                    },
                  }
                : {}),
            })
              .populate("doctorId", "fullname")
              .populate("patientId", "fullname email phone")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments({
              ...(sanitizeQuery && {
                $or: [
                  { doctorId: { $in: doctorIds } },
                  { patientId: { $in: patientIds } },
                ],
              }),
              ...(status && { status: status }),
              ...(time && { appointmentTime: time }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    appointmentDate: {
                      ...(sanitizeStartDate && { $gte: sanitizeStartDate }),
                      ...(sanitizeEndDate && {
                        $lte: new Date(
                          sanitizeEndDate.setHours(23, 59, 59, 999) //default time in mongodb 23hours 59 minute
                        ),
                      }),
                    },
                  }
                : {}),
            }),
          ])
        : await Promise.all([
            Appointment.find()
              .populate("doctorId", "fullname")
              .populate("patientId", "fullname email phone")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit)
              .lean(),
            Appointment.countDocuments(),
          ]);
    if (!appointments) {
      return next(notFoundResponse("No appointments found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + appointments.length < total,
        limit,
      },
      appointments,
    };
  },
  confirmAppointment: async (appointmentId, appointmentData, next) => {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(notFoundResponse("No appointment found"));
    }
    const patient = await Patient.findOne({
      userId: appointment.patientId,
    }).lean();
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    for (const [key, value] of Object.entries(appointmentData)) {
      if (value) {
        appointment[key] = value;
      }
    }
    const payment = await Payment.findOne({ appointmentId: appointmentId });
    if (!payment || payment.status !== "confirmed") {
      return next(errorResponse("Appointment has not been paid for yet", 400));
    }
    const confirmAppointment = await appointment.save();
    if (!confirmAppointment) {
      return next(errorResponse("Appointment status not updated"));
    }
    if (
      confirmAppointment.status === "confirmed" ||
      confirmAppointment.status === "cancelled"
    ) {
      process.nextTick(() => {
        mailService
          .sendAppointmentStatusEmail(
            patient.email,
            patient.fullname,
            confirmAppointment.status
          )
          .catch(console.error);
      });
    }
    return confirmAppointment;
  },
};

export default appointmentService;

// lte and gte - greater than and less than in js

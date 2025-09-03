import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";
import Payment from "../models/payment.js";
import Room from "../models/room.js";
import responseHandler from "../utils/responseHandler.js";
import mailService from "./email.service.js";
const { errorResponse, notFoundResponse } = responseHandler;

const paymentService = {
createPayment: async (paymentData, next) => {
    if (paymentData.appointmentId) {
      const patientAppointment = await Appointment.findOne({
        _id: paymentData.appointmentId.toString(),
      });
      if (
        !patientAppointment ||
        patientAppointment.patientId.toString() !==
          paymentData.patientId.toString()
      ) {
        return next(notFoundResponse("No appointment found for this patient"));
      }
    }
    if (paymentData.roomId) {
      const room = await Room.findOne({ _id: paymentData.roomId });
      if (room.roomPrice !== paymentData.amount) {
        return next(
          errorResponse("Room price does not match amount to be paid")
        );
      }
    }
    const payment = await Payment.create({
      ...paymentData,
    });
    if (!payment) {
      return next(errorResponse("Payment not created"));
    }
    const patient = await Patient.findOne({
      userId: payment.patientId,
    }).lean();
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    process.nextTick(() => {
      mailService
        .sendCreatePaymentEmail(patient.email, patient.fullname, payment)
        .catch(console.error);
    });
    return payment;
  },
  getPatientPayments: async (
    page = 1,
    limit = 10,
    query = "",
    status = "",
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
    const sanitizeQuery = query
      ? query
          .trim()
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
      : "";
    const [payments, total] =
      sanitizeQuery || status || startDate || endDate
        ? await Promise.all([
            Payment.find({
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    paymentDate: {
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
              .populate("patientId", "fullname email")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments({
              patientId: matchingPatient.userId.toString(),
              ...(status && { status: status }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    paymentDate: {
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
            Payment.find({
              patientId: matchingPatient.userId.toString(),
            })
              .populate("patientId", "fullname email")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments({
              patientId: matchingPatient.userId.toString(),
            }),
          ]);
    if (!payments) {
      return next(notFoundResponse("No payments found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + payments.length < total,
        limit,
      },
      payments,
    };
  },
  updatePaymentStatus: async (paymentId, reference, next) => {
    const payment = await Payment.findById(paymentId).populate(
      "patientId",
      "fullname email"
    );
    if (!payment) {
      return next(notFoundResponse("No payment found"));
    }
    const patient = await Patient.findOne({
      userId: payment.patientId,
    }).lean();
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    payment.status = "confirmed";
    payment.paidAt = Date.now();
    payment.reference = reference.toString();
    payment.notes =
      "Your payment has been confirmed. We will contact you on the next steps";
    await payment.save();
    if (payment.status === "confirmed") {
      process.nextTick(() => {
        mailService
          .sendPaymentStatusEmail(
            patient.email,
            patient.fullname,
            payment.amount,
            payment.status
          )
          .catch(console.error);
      });
    }
    if (payment.appointmentId) {
      const appointment = await Appointment.findById(payment.appointmentId);
      if (!appointment) {
        return next(notFoundResponse("Appointment not found"));
      }
      appointment.status = "confirmed";
      await appointment.save();
      process.nextTick(() => {
        mailService
          .sendAppointmentStatusEmail(
            patient.email,
            patient.fullname,
            appointment.status
          )
          .catch(console.error);
      });
    }
    return payment;
  },
  getAllPayments: async (
    page = 1,
    limit = 10,
    query = "",
    status = "",
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
    const [payments, total] =
      sanitizeQuery || status || startDate || endDate
        ? await Promise.all([
            Payment.find({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(status && { status: status }),
              ...(sanitizeStartDate || sanitizeEndDate
                ? {
                    paymentDate: {
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
              .populate("patientId", "fullname email")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(status && { status: status }),
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
            Payment.find()
              .populate("patientId", "fullname email")
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Payment.countDocuments(),
          ]);
    if (!payments) {
      return next(notFoundResponse("No payments found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + payments.length < total,
        limit,
      },
      payments,
    };
  },
};

export default paymentService;
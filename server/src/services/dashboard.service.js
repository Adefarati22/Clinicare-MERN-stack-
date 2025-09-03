import Patient from "../models/patient.js";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
import Inpatient from "../models/inpatient.js";
import Payment from "../models/payment.js";
import Appointment from "../models/appointment.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const dashboardService = {
  getPatientStats: async (userId, next) => {
    const [appointments, payments] = await Promise.all([
      Appointment.find({ patientId: userId.toString() }),
      Payment.find({ patientId: userId.toString(), status: "confirmed" }),
    ]);
    if (!appointments || !payments) {
      return next(notFoundResponse("Documents not found"));
    }
    const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
    // Get appointments within the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.createdAt);
      return appointmentDate >= sevenDaysAgo;
    });
    const pendingPayments = await Payment.find({ status: "pending" });

    return {
      appointments,
      payments,
      appointmentCount: appointments.length,
      paymentCount: payments.length,
      totalPayments,
      recentAppointments: recentAppointments,
      recentAppointmentCount: recentAppointments.length,
      pendingPayments,
    };
  },
  getAllStats: async (next) => {
    const [appointments, payments] = await Promise.all([
      Appointment.find(),
      Payment.find({ status: "confirmed" }),
    ]);
    if (!appointments || !payments) {
      return next(notFoundResponse("Documents not found"));
    }
    const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
    // Get appointments within the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.createdAt);
      return appointmentDate >= sevenDaysAgo;
    });
    const pendingPayments = await Payment.find({ status: "pending" });

    return {
      appointments,
      payments,
      appointmentCount: appointments.length,
      paymentCount: payments.length,
      totalPayments,
      recentAppointments: recentAppointments,
      recentAppointmentCount: recentAppointments.length,
      pendingPayments,
    };
  },
};

export default dashboardService;
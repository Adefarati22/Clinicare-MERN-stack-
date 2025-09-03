import Doctor from "../models/doctor.js"
import User from "../models/user.js";
import responseHandler from "../utils/responseHandler.js";

const { notFoundResponse } = responseHandler;

const doctorService = {
  getAllDoctors: async (
    page = 1,
    limit = 10,
    query = "",
    specialization = "",
    availability = "",
    next
  ) => {
    const sanitizeQuery =
      query || specialization || availability
        ? (query || specialization || availability)
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
        : "";
    const getUsers = await User.find({
      $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
    })
      .select("_id")
      .lean();
    const userIds = getUsers.map((user) => user._id);
    const [doctors, total] = sanitizeQuery
      ? await Promise.all([
          Doctor.find({
            $or: [
              { availability: { $regex: sanitizeQuery, $options: "i" } },
              { specialization: { $regex: sanitizeQuery, $options: "i" } },
              { userId: { $in: userIds } },
            ],
            ...(availability && {
              availability: availability,
            }),
            ...(specialization && {
              specialization: specialization,
            }),
          })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("userId", "fullname phone email avatar phone"),
          Doctor.countDocuments({
            $or: [
              { availability: { $regex: sanitizeQuery, $options: "i" } },
              { specialization: { $regex: sanitizeQuery, $options: "i" } },
              { userId: { $in: userIds } },
            ],
          }),
        ])
      : await Promise.all([
          Doctor.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("userId", "fullname phone email avatar phone"),
          Doctor.countDocuments(),
        ]);
    if (!doctors) {
      return next(notFoundResponse("No doctors found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + doctors.length < total,
        limit,
      },
      doctors,
    };
  },
  updateDoctor: async (doctorId, doctorData, next) => {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(notFoundResponse("No doctor found"));
    }
    for (const [key, value] of Object.entries(doctorData)) {
      if (value) {
        doctor[key] = value;
      }
    }
    const updatedDoctor = await doctor.save();
    return updatedDoctor;
  },
};

export default doctorService;
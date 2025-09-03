import { z } from "zod";

export const validatedSignUpSchema = z.object({
  fullname: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, {
      message: "password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "password must contain at least one lowercase letter",
    })
    .regex(/[!@$%^&*(,.?":{}|<>]/, {
      message: "password must contain at least one special character",
    }),
  role: z.enum(["admin", "staff", "doctor", "nurse", "patient"]).optional(),
  availability: z.string().optional(),
  specialization: z.string().optional(),
});

export const validatedSignInSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, {
      message: "password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "password must contain at least one lowercase letter",
    })
    .regex(/[!@$%^&*(,.?":{}|<>]/, {
      message: "password must contain at least one special character",
    }),
});

export const validatedForgotSchema = z.object({
  email: z.email(),
});

export const validatedResetSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "password must contain at least one lowercase letter",
    })
    .regex(/[!@$%^&*(,.?":{}|<>]/, {
      message: "password must contain at least one special character",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "password must contain at least one lowercase letter",
    })
    .regex(/[!@$%^&*(,.?":{}|<>]/, {
      message: "password must contain at least one special character",
    }),
});

export const validatePatientSchema = z.object({
  fullname: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.email(),
  phone: z.string().min(11, {
    message: "phone number is complete",
  }),
  dateOfBirth: z.iso.date(),
  address: z.string().min(3, {
    message: "Please include an address, must be at least 3 characters long",
  }),
  gender: z.enum(["male", "female", "other"]).refine((value) => value !== "", {
    message: "Gender is required",
  }),
  bloodGroup: z
    .enum([
      "A-positive",
      "A-negative",
      "B-positive",
      "B-negative",
      "AB-positive",
      "AB-negative",
      "O-positive",
      "O-negative",
    ])
    .refine((value) => value !== "", {
      message: "Blood group is required",
    }),
  emergencyContact: z.string().min(3, {
    message: "Emergency contact must be at 3 characters long",
  }),
  emergencyContactPhone: z.string().min(11, {
    message: "Emergency contact phone must be at 11 characters long",
  }),
  emergencyContactRelationship: z.string().min(3, {
    message: "Emergency contact relationship must be at 3 characters long",
  }),
});

export const validateAccountSchema = z.object({
  verificationToken: z
    .string()
    .min(6, {
      message: "Token must be at least 6 digits",
    })
    .max(6, {
      message: "Token must not exceed 6 digits",
    }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
});

export const validateUserSchema = z.object({
  fullname: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.string().email(),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters long",
  }),
  dateOfBirth: z.string().date(),
});

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  newPassword: z
    .string()
    .min(8, {
      message: "New Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "New Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "New Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "New Password must contain at least one special character",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Confirm Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Confirm Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Confirm Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Confirm Password must contain at least one special character",
    }),
});

export const validateUpdateUserRoleSchema = z.object({
  role: z
    .enum(["staff", "doctor", "admin", "nurse", "patient"])
    .refine((value) => value !== "", {
      message: "Role is required",
    }),
});

export const validateRoomSchema = z.object({
  roomNumber: z.coerce
    .number()
    .min(1, {
      message: "Room number must be at least 1",
    })
    .max(20, {
      message: "Room number must be at most 20",
    }),
  roomType: z
    .enum(["Regular", "VIP", "ICU", "Deluxe", "Suite"])
    .refine((value) => value !== "", {
      message: "Room type is required",
    }),
  roomPrice: z.coerce.number().min(1, {
    message: "Room price must be at least 1",
  }),
  roomDescription: z.string().min(3, {
    message: "Room description must be at least 3 characters long",
  }),
  roomCapacity: z.coerce
    .number()
    .min(1, {
      message: "Room capacity must be at least 1",
    })
    .max(5, {
      message: "Room capacity must be at most 5",
    }),
  roomStatus: z
    .enum(["available", "occupied", "maintenance"])
    .refine((value) => value !== "", {
      message: "Room status is required",
    }),
});

export const validateDoctorAvailabilitySchema = z.object({
  availability: z
    .enum(["available", "unavailable", "on leave", "sick"])
    .refine((value) => value !== "", {
      message: "Availability is required",
    }),
});

export const validateBookAppointmentSchema = z.object({
  appointmentDate: z
    .string()
    .date()
    .refine((value) => value !== "", {
      message: "Appointment date is required",
    }),
  appointmentTime: z
    .enum(["10:00 AM", "1:00 PM", "3:00 PM"])
    .refine((value) => value !== "", {
      message: "Appointment time is required",
    }),
  notes: z
    .string()
    .min(3, {
      message: "Notes must be at least 3 characters long",
    })
    .max(255, {
      message: "Notes cannot be more than 255 characters",
    }),
});

export const validateConfirmAppointmentSchema = z.object({
  doctorId: z.string().min(3, {
    message: "Doctor is required",
  }),
  status: z
    .enum(["scheduled", "confirmed", "cancelled"])
    .refine((value) => value !== "", {
      message: "Confirmation status is required",
    }),
  response: z.string().min(5, {
    message: "Response must be at least 5 characters long",
  }),
});

export const validateCreatePaymentSchema = z.object({
  patientId: z.string().min(3, {
    message: "Patient is required",
  }),
  appointmentId: z.string().optional(),
  roomId: z.string().optional(),
  amount: z.coerce.number().min(1000, {
    message: "Amount must be at least 1000",
  }),
  notes: z
    .string()
    .min(3, {
      message: "Notes must be at least 3 characters long",
    })
    .max(255, {
      message: "Notes cannot be more than 255 characters",
    }),
  paymentType: z
    .enum(["appointment", "admission", "other"])
    .refine((value) => value !== "", {
      message: "Payment type is required",
    }),
});

export const validateInpatientSchema = z.object({
  patientId: z.string().min(3, {
    message: "Patient ID is required",
  }),
  doctorId: z.string().min(3, {
    message: "Doctor ID is required",
  }),
  roomId: z.string().min(3, {
    message: "Room ID is required",
  }),
  admissionDate: z.iso.date(),
  dischargeDate: z
    .union([z.string().length(0), z.string().date()])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  notes: z
    .string()
    .min(3, {
      message: "Notes must be at least 3 characters long",
    })
    .max(255, {
      message: "Notes cannot be more than 255 characters",
    }),
  status: z
    .enum(["admitted", "discharged", "transferred"])
    .refine((value) => value !== "", {
      message: "Status is required",
    }),
});
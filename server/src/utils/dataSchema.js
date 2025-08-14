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

export const validatedResetSchema = z
  .object({
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

import z from "zod";

export const loginSchema = z.object({
  email: z
    .email()
    .min(8, {
      message: "Email must contain at least 8 character(s)",
    })
    .max(40, {
      message: "Email must contain up to 40 character(s) only",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must contain at least 8 character(s)",
    })
    .max(35, {
      message: "Password must contain up to 35 character(s) only",
    }),
});

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(8, "Name Should be minimum 8 characters")
    .max(55, "Name should be maximum 55 characters"),
  email: z
    .email()
    .min(8, "Name Should be minimum 8 characters")
    .max(55, "Name should be maximum 55 characters"),

  message: z
    .string()
    .min(8, "Message Should be minimum 8 characters")
    .max(255, "Message should be maximum 255 characters"),
});

export const registerSchema = z
  .object({
    email: z
      .email()
      .min(8, {
        message: "Email must contain at least 8 character(s)",
      })
      .max(40, {
        message: "Email must contain up to 40 character(s) only",
      }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    gender: z.string().min(1, {
      message: "Gender is required",
    }),
    phoneNumber: z.string().regex(/^\d{10}$/, {
      message: "Please enter a valid 10-digit phone number.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPassSchema = z.object({
  email: z
    .email()
    .min(8, {
      message: "Email must contain at least 8 character(s)",
    })
    .max(40, {
      message: "Email must contain up to 40 character(s) only",
    }),
});

export const resetPassSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: "Password must contain at least 8 character(s)",
      })
      .max(35, {
        message: "Password must contain up to 35 character(s) only",
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Password must contain at least 8 character(s)",
      })
      .max(35, {
        message: "Password must contain up to 35 character(s) only",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

import z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(8, {
      message: "Email must contain at least 8 character(s)",
    })
    .max(40, {
      message: "Email must contain up to 40 character(s) only",
    })
    .email(),
  password: z
    .string()
    .min(8, {
      message: "Password must contain at least 8 character(s)",
    })
    .max(35, {
      message: "Password must contain up to 35 character(s) only",
    }),
});

export const registerSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
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
});

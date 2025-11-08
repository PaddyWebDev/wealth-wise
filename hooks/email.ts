"use server";
import { z } from "zod";
import { checkUserExistsByEmail } from "@/hooks/user";
import { forgotPassSchema } from "@/lib/guest-form-schemas";
import nodemailer from "nodemailer";
import { generatePasswordResetToken } from "./reset-password";

const transporter = nodemailer.createTransport({
  service: "gmail", // or "smtp", "hotmail", etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password (not regular password if Gmail)
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationLink = `${process.env.AUTH_URL}/guest/new-verification?token=${token}`;

  await transporter.sendMail({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email address",
    html: `<p> Click <a href="${verificationLink}">here</a> to verify your email address</p>`,
  });
}

export async function sendResetPassEmail(
  data: z.infer<typeof forgotPassSchema>
): Promise<{
  code: number;
  message: string;
}> {
  const validatedFields = forgotPassSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      code: 400,
      message: "Invalid Email Entered",
    };
  }

  const existingUser = await checkUserExistsByEmail(validatedFields.data.email);

  if (!existingUser) {
    return {
      code: 404,
      message: "Email Not found",
    };
  }
  const passwordResetToken = await generatePasswordResetToken(
    validatedFields.data.email
  );

  const resetLink = `${process.env.AUTH_URL}/guest/reset-password?token=${passwordResetToken.token}`;
  await transporter.sendMail({
    to: passwordResetToken.email,
    subject: "Reset your password",
    html: `<p> Click <a href="${resetLink}">here</a> to reset password</p>`,
  });
  return {
    code: 200,
    message: "Reset Email Sent",
  };
}

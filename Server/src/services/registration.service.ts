import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { PendingRegistration, User } from "../models";
import { sendVerificationEmail } from "./email.service";

export class RegistrationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "RegistrationError";
    this.statusCode = statusCode;
  }
}

const OTP_EXPIRY_MINUTES = 2;

const sanitizeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
});

const generateVerificationCode = () =>
  crypto.randomInt(100000, 1000000).toString();

export const initiateRegistration = async (payload: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) => {
  const { email, firstName, lastName, password } = payload;

  if (!email || !firstName || !lastName || !password) {
    throw new RegistrationError("All fields are required", 400);
  }

  if (password.length < 6) {
    throw new RegistrationError("Password must be at least 6 characters", 400);
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new RegistrationError("Email already registered", 409);
  }

  const existingPending = await PendingRegistration.findOne({ where: { email } });
  if (existingPending) {
    await existingPending.destroy();
  }

  // Hash the password before storing it in the temporary registration record.
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a secure 6-digit verification code and store it with a short expiry.
  const code = generateVerificationCode();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const pending = await PendingRegistration.create({
    email,
    firstName,
    lastName,
    password: hashedPassword,
    otp: code,
    otpExpiry,
  });

  // Send the verification code to the user's email.
  await sendVerificationEmail(pending.email, pending.firstName, code);

  return {
    message: "Verification code sent. Complete verification to finish registration.",
    email: pending.email,
  };
};

export const completeRegistration = async (email: string, code: string) => {
  if (!email || !code) {
    throw new RegistrationError("Email and verification code are required", 400);
  }

  const pending = await PendingRegistration.findOne({ where: { email } });

  if (!pending) {
    throw new RegistrationError("No pending registration found for this email", 400);
  }

  if (pending.otp !== code) {
    throw new RegistrationError("Invalid verification code", 400);
  }

  if (pending.otpExpiry < new Date()) {
    await pending.destroy();
    throw new RegistrationError("Verification code expired. Please register again.", 410);
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    await pending.destroy();
    throw new RegistrationError("Email already registered", 409);
  }

  // Create the user only after the verification code is successfully validated.
  const user = await User.create({
    email: pending.email,
    firstName: pending.firstName,
    lastName: pending.lastName,
    password: pending.password,
    role: "admin",
    emailVerified: true,
  });

  // Remove the temporary verification record after successful registration.
  await pending.destroy();

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "mysecret",
    { expiresIn: "7d" }
  );

  return {
    message: "Account verified and created successfully.",
    token,
    user: sanitizeUser(user),
  };
};

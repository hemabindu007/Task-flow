import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PendingRegistration, User } from "../models";
import {
  sendPasswordResetEmail,
} from "../services/email.service";
import { AuthRequest } from "../middleware/auth";
import {
  completeRegistration,
  initiateRegistration,
  RegistrationError,
} from "../services/registration.service";

const sanitizeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
});

export const register = async (req: Request, res: Response) => {
  try {
    const result = await initiateRegistration(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof RegistrationError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({ message: "Please verify your email before logging in" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(400).json({ message: "Email is not registered" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await user.update({
      resetToken,
      resetTokenExpiry,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl, user.firstName);

    res.json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error processing request" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await completeRegistration(email, otp);
    res.json(result);
  } catch (error) {
    if (error instanceof RegistrationError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error verifying email" });
  }
};

export const verifyRegistration = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const result = await completeRegistration(email, code);
    res.json(result);
  } catch (error) {
    if (error instanceof RegistrationError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Verify registration error:", error);
    res.status(500).json({ message: "Server error verifying registration" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ message: "Token and new password are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const user = await User.findOne({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error resetting password" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

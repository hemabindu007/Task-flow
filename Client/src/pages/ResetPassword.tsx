import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../services/api";
import {
  alertErrorClass,
  btnPrimaryClass,
  inputClass,
  labelClass,
  mutedTextClass,
} from "../lib/styles";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Reset failed");
      } else {
        setError("Reset failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid link">
        <div className="text-center">
          <div className={`${alertErrorClass} text-center`}>
            This password reset link is invalid.
          </div>
          <Link to="/forgot-password" className={btnPrimaryClass}>
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout title="Password updated">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-[28px] text-white">
            ✓
          </div>
          <p className={`mb-5 ${mutedTextClass}`}>
            Your password has been reset successfully. Redirecting to sign in...
          </p>
          <Link to="/login" className={btnPrimaryClass}>
            Sign in now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account"
    >
      {error && <div className={alertErrorClass}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4.5">
          <label htmlFor="password" className={labelClass}>
            New password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4.5">
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <button type="submit" className={btnPrimaryClass} disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;

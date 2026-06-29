import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../services/api";
import {
  alertErrorClass,
  btnPrimaryClass,
  inputClass,
  labelClass,
} from "../lib/styles";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const missingEmailMessage = !email
    ? "Verification email is missing. Please register again."
    : "";

  useEffect(() => {
    if (!email) {
      return;
    }

    if (timeLeft <= 0) {
      navigate("/register");
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [email, navigate, timeLeft]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.match(/^\d{6}$/)) {
      setError("Enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.verifyEmail(email, otp);
      localStorage.setItem("token", data.token);
      setSuccess(data.message || "Email verified successfully! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Verification failed");
      } else {
        setError("Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent to your inbox"
    >
      {(error || missingEmailMessage) && (
        <div className={alertErrorClass}>{error || missingEmailMessage}</div>
      )}
      {success && <div className="px-3.5 py-3 rounded-xl text-sm mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">{success}</div>}

      <div className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Verification code for <strong>{email}</strong>
      </div>
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
        Code expires in <span className="font-semibold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4.5">
          <label htmlFor="otp" className={labelClass}>
            6-digit verification code
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            className={inputClass}
            maxLength={6}
            required
          />
        </div>

        <button type="submit" className={btnPrimaryClass} disabled={loading || !email}>
          {loading ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
        Already verified? <Link to="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;

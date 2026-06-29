import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../services/api";
import {
  alertErrorClass,
  authFooterClass,
  authLinkClass,
  btnPrimaryClass,
  inputClass,
  labelClass,
  mutedTextClass,
  strongTextClass,
  subtleTextClass,
} from "../lib/styles";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <MdEmail className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className={`mb-2 leading-relaxed ${mutedTextClass}`}>
            We've sent a password reset link to
          </p>
          <p className={`mb-5 ${strongTextClass}`}>{email}</p>
          <p className={`mb-6 ${subtleTextClass}`}>
            The link expires in 1 hour. Check your spam folder if you don't see
            it.
          </p>
          <Link to="/login" className={btnPrimaryClass}>
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {error && <div className={alertErrorClass}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4.5">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <button type="submit" className={btnPrimaryClass} disabled={loading}>
          {loading ? "Sending..." : "Continue"}
        </button>
      </form>

      <div className={authFooterClass}>
        Remember your password?{" "}
        <Link to="/login" className={authLinkClass}>
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;

import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import {
  alertErrorClass,
  authFooterClass,
  authLinkClass,
  btnPrimaryClass,
  inputClass,
  labelClass,
} from "../lib/styles";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="New accounts are assigned the Admin role by default"
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
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4.5 grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="mb-4.5">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
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
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <button type="submit" className={btnPrimaryClass} disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className={authFooterClass}>
        Already have an account?{" "}
        <Link to="/login" className={authLinkClass}>
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;

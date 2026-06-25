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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your TaskFlow account">
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

        <div className="mb-4.5">
          <div className="mb-1 flex justify-end">
            <Link to="/forgot-password" className={`text-[13px] font-medium ${authLinkClass}`}>
              Forgot password?
            </Link>
          </div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <button type="submit" className={btnPrimaryClass} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className={authFooterClass}>
        Don't have an account?{" "}
        <Link to="/register" className={authLinkClass}>
          Create one
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;

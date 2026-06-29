import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type UserRole = "admin" |"employee";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export const authApi = {
  register: (data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => api.post<RegisterResponse>("/auth/register", data),

  verifyEmail: (email: string, otp: string) =>
    api.post<AuthResponse>("/auth/verify-registration", { email, code: otp }),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>("/auth/reset-password", { token, password }),

  getMe: () => api.get<{ user: User }>("/auth/me"),
};

export default api;

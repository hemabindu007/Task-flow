import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-violet-50 p-6 transition-colors duration-200 dark:from-slate-900 dark:via-indigo-950 dark:to-indigo-900">
      <div className="pointer-events-none absolute -top-24 -right-24 h-100 w-100 rounded-full bg-indigo-400 opacity-30 blur-[80px] dark:bg-indigo-600 dark:opacity-40" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-75 w-75 rounded-full bg-violet-400 opacity-30 blur-[80px] dark:bg-violet-600 dark:opacity-40" />

      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-110">
        <div className="mb-7 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 text-[28px] font-bold text-gray-900 no-underline dark:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <FiCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            TaskFlow
          </Link>
          <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-300">
            Manage tasks with clarity
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-9 shadow-2xl max-sm:p-7 dark:border-slate-700/50 dark:bg-slate-800/95">
          <div className="mb-7">
            <h1 className="mb-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

import type { UserRole } from "../services/api";

export const labelClass =
  "block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300";

export const inputClass =
  "w-full px-3.5 py-3 border border-gray-200 rounded-xl text-[15px] bg-gray-50 text-gray-900 transition focus:outline-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/15 focus:bg-white dark:border-slate-600 dark:bg-slate-700/50 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-indigo-500 dark:focus:bg-slate-700 dark:focus:ring-indigo-500/20";

export const btnPrimaryClass =
  "block w-full py-3.5 mt-1.5 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl text-[15px] font-semibold text-center transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";

export const alertErrorClass =
  "px-3.5 py-3 rounded-xl text-sm mb-4 bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800";

export const authFooterClass =
  "text-center mt-5 text-sm text-gray-500 dark:text-gray-400";

export const authLinkClass =
  "text-indigo-600 font-semibold hover:underline dark:text-indigo-400";

export const mutedTextClass = "text-gray-700 dark:text-gray-300";
export const strongTextClass = "font-semibold text-gray-900 dark:text-gray-100";
export const subtleTextClass = "text-sm text-gray-500 dark:text-gray-400";

export const roleBadgeClass = (role?: UserRole) => {
  const base =
    "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize";
  const variants: Record<UserRole, string> = {
    admin:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300",
    employee:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  };
  return role ? `${base} ${variants[role]}` : base;
};

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleToggle = () => setOpen((current) => !current);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleOverview = () => {
    setOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
        title="User menu"
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggle();
          }
        }}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:hover:bg-slate-800"
      >
        <FaUserCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
      </button>

      <div
        className={`absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition duration-200 ease-out dark:bg-slate-900 dark:ring-white/10 ${
          open ? "visible scale-100 opacity-100" : "invisible -translate-y-1 scale-95 opacity-0"
        }`}
        role="menu"
        aria-label="User profile menu"
      >
        <div className="py-2">
          <button
            type="button"
            onClick={handleOverview}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            role="menuitem"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Overview
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            role="menuitem"
          >
            <FiLogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;

import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUsers, FaProjectDiagram } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

interface AdminLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <MdDashboard className="h-5 w-5" /> },
  { to: "/employees", label: "Employees", icon: <FaUsers className="h-5 w-5" /> },
  { to: "/projects", label: "Projects", icon: <FaProjectDiagram className="h-5 w-5" /> },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-lg font-bold text-gray-900 dark:text-gray-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600 text-white">
                <FiCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              TaskFlow
            </div>
            <ThemeToggle />
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: navActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                      navActive || isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <span className="text-base" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Admin Workspace</p>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">TaskFlow</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-sm font-medium text-gray-600 dark:text-gray-400 sm:inline">
                  {user?.firstName} {user?.lastName}
                </span>
                <ProfileDropdown />
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

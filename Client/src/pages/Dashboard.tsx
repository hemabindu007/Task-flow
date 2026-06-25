import { roleBadgeClass } from "../lib/styles";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-slate-950">
      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2.5 text-[22px] font-bold text-gray-900 dark:text-gray-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-lg text-white">
            ✓
          </span>
          TaskFlow
        </div>
        <div className="flex items-center gap-3.5">
          <span className={roleBadgeClass(user?.role)}>{user?.role}</span>
          <ThemeToggle />
          <button
            className="cursor-pointer rounded-lg border border-gray-200 bg-transparent px-4.5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto min-h-[calc(100vh-70px)] max-w-250 p-12">
        <div className="rounded-[26px] border border-gray-200 bg-white p-12 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 max-sm:p-8">
          <div className="mb-4 text-5xl">👋</div>
          <h1 className="mb-3 bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-[28px] font-bold text-transparent">
            Welcome to Task Management
          </h1>
          <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
            Hello,{" "}
            <strong className="text-gray-900 dark:text-gray-100">
              {user?.firstName} {user?.lastName}
            </strong>
          </p>
          <p className="mb-8 leading-relaxed text-gray-500 dark:text-gray-400">
            You're signed in as{" "}
            <span className={roleBadgeClass(user?.role)}>{user?.role}</span>.
            Your task management workspace is ready.
          </p>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left dark:border-slate-700 dark:bg-slate-800/50">
              <span className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                Email
              </span>
              <span className="text-[15px] font-semibold break-all text-gray-900 dark:text-gray-100">
                {user?.email}
              </span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left dark:border-slate-700 dark:bg-slate-800/50">
              <span className="mb-1 block text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                Role
              </span>
              <span className="text-[15px] font-semibold text-gray-900 capitalize dark:text-gray-100">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

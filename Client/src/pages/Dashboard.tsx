import { MdWavingHand } from "react-icons/md";
import { roleBadgeClass } from "../lib/styles";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-slate-950">

      <main className="mx-auto min-h-[calc(100vh-70px)] max-w-250 p-12">
        <div className="rounded-[26px] border border-gray-200 bg-white p-12 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900 max-sm:p-8">
          <div className="mb-4 text-5xl text-indigo-600 dark:text-indigo-400">
            <MdWavingHand className="h-16 w-16" aria-hidden="true" />
          </div>
          <h1 className="mb-3 bg-linear-to-br from-indigo-600 to-violet-600 bg-clip-text text-[28px] font-bold text-transparent">
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

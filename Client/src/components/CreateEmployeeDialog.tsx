import { useMemo } from "react";
import { inputClass } from "../lib/styles";
import Modal from "./Modal";

interface CreateEmployeeDialogProps {
  open: boolean;
  loading: boolean;
  data: { firstName: string; lastName: string; email: string; role: string };
  errors: Record<string, string>;
  onClose: () => void;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

const CreateEmployeeDialog = ({
  open,
  loading,
  data,
  errors,
  onClose,
  onChange,
  onSubmit,
}: CreateEmployeeDialogProps) => {
  const roleOptions = useMemo(() => ["USER"], []);

  return (
    <Modal
      open={open}
      title="Create Employee"
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-200 dark:hover:bg-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      }
    >
      <div
        className="space-y-4"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (!loading) onSubmit();
          }
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="firstName">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className={inputClass}
            placeholder="First name"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="lastName">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className={inputClass}
            placeholder="Last name"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass}
            placeholder="Email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            value={data.role}
            onChange={(e) => onChange("role", e.target.value)}
            className={inputClass}
            disabled
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default CreateEmployeeDialog;

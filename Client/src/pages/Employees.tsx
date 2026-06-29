import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiCheckCircle,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import CreateEmployeeDialog from "../components/CreateEmployeeDialog";
import ActionIconButton from "../components/ActionIconButton";
import StatusToggleButton from "../components/StatusToggleButton";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { alertErrorClass, alertSuccessClass, btnPrimaryClass, inputClass } from "../lib/styles";
import api, { adminApi } from "../services/api";

interface EmployeeItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

const statusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const Employees = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "USER" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    id: string | null;
    name: string;
    action: "activate" | "inactivate";
  }>({ open: false, id: null, name: "", action: "activate" });

  const fetchEmployees = useCallback(async (currentPage = 1, query = search) => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/employees", {
        params: { page: currentPage, limit: 8, search: query },
      });
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        navigate("/dashboard");
        return;
      }
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Unable to load employees"
        : "Unable to load employees";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [navigate, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchEmployees(1, search);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [fetchEmployees, search]);

  const filteredItems = useMemo(() => items, [items]);

  const validate = () => {
    const nextErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFormChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/admin/employees", form);
      setForm({ firstName: "", lastName: "", email: "", role: "USER" });
      setShowCreate(false);
      setSuccess("Employee created successfully.");
      await fetchEmployees(1, search);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Unable to create employee"
        : "Unable to create employee";

      if (/email/i.test(message)) {
        setErrors((current) => ({ ...current, email: message }));
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openToggleConfirm = (employee: EmployeeItem) => {
    const action = employee.status === "active" ? "inactivate" : "activate";
    setConfirm({
      open: true,
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      action,
    });
  };

  const closeConfirm = () => {
    setConfirm((current) => ({ ...current, open: false }));
  };

  const handleConfirmToggle = async () => {
    if (!confirm.id) return;
    setToggleLoading(true);
    setError("");
    setSuccess("");
    try {
      await adminApi.toggleEmployeeStatus(confirm.id, confirm.action);
      setSuccess(
        `Employee ${confirm.action === "activate" ? "activated" : "inactivated"} successfully.`
      );
      closeConfirm();
      await fetchEmployees(page, search);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || `Unable to ${confirm.action} employee`
        : `Unable to ${confirm.action} employee`;
      setError(message);
      closeConfirm();
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {success && (
          <div className={alertSuccessClass}>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
              {success}
            </div>
          </div>
        )}
        <div className="gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Employees</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your team members and their access.</p>
          </div>
          <div className="gap-3 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className={inputClass + " w-full pl-10"}
              />
            </div>
            <div className="flex justify-end">
              {user?.role === "admin" ? (
                <button
                  className={btnPrimaryClass + " mt-0 w-full sm:w-auto px-4 py-2 !inline-flex items-center justify-center"}
                  onClick={() => setShowCreate(true)}
                >
                  <FiPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Create Employee
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {error && <div className={alertErrorClass}>{error}</div>}

        <CreateEmployeeDialog
          open={showCreate}
          loading={submitting}
          data={form}
          errors={errors}
          onClose={() => {
            setShowCreate(false);
            setErrors({});
          }}
          onChange={handleFormChange}
          onSubmit={handleCreate}
        />

        <ConfirmDialog
          open={confirm.open}
          title={confirm.action === "activate" ? "Activate Employee" : "Inactivate Employee"}
          description={`Are you sure you want to ${confirm.action} this employee?`}
          confirmLabel={confirm.action === "activate" ? "Activate" : "Inactivate"}
          cancelLabel="Cancel"
          onConfirm={handleConfirmToggle}
          onCancel={closeConfirm}
          loading={toggleLoading}
        />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading employees...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">No employees found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">First Name</th>
                    <th className="px-4 py-3">Last Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((employee) => (
                    <tr key={employee.id} className="border-t border-gray-100 dark:border-slate-800">
                      <td className="px-4 py-3">{employee.firstName}</td>
                      <td className="px-4 py-3">{employee.lastName}</td>
                      <td className="px-4 py-3">{employee.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${employee.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {statusLabel(employee.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{new Date(employee.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ActionIconButton
                            title="Edit Employee"
                            ariaLabel={`Edit ${employee.firstName} ${employee.lastName}`}
                            icon={<FiEdit2 className="h-5 w-5" aria-hidden="true" />}
                            onClick={() => {
                              // TODO: wire up edit flow
                            }}
                          />
                          <StatusToggleButton
                            status={employee.status}
                            entityName={`${employee.firstName} ${employee.lastName}`}
                            entityType="Employee"
                            activateIcon={<FiUserCheck className="h-5 w-5" aria-hidden="true" />}
                            inactivateIcon={<FiUserX className="h-5 w-5" aria-hidden="true" />}
                            onToggle={() => openToggleConfirm(employee)}
                            disabled={toggleLoading}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => fetchEmployees(page - 1, search)}
              disabled={page <= 1 || loading}
            >
              Previous
            </button>
            <button
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => fetchEmployees(page + 1, search)}
              disabled={page >= totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Employees;

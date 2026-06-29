import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import {
  FiCheckCircle,
  FiEdit2,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import ActionIconButton from "../components/ActionIconButton";
import StatusToggleButton from "../components/StatusToggleButton";
import ConfirmDialog from "../components/ConfirmDialog";
import { alertErrorClass, alertSuccessClass, btnPrimaryClass, inputClass } from "../lib/styles";
import api, { adminApi } from "../services/api";

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const statusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const Projects = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    id: string | null;
    name: string;
    action: "activate" | "inactivate";
  }>({ open: false, id: null, name: "", action: "activate" });

  const fetchProjects = useCallback(async (currentPage = 1, query = search) => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/projects", {
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
        ? err.response?.data?.message || "Unable to load projects"
        : "Unable to load projects";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [navigate, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
     void fetchProjects(1, search);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [fetchProjects, search]);

  const openToggleConfirm = (project: ProjectItem) => {
    const action = project.status === "active" ? "inactivate" : "activate";
    setConfirm({
      open: true,
      id: project.id,
      name: project.name,
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
      await adminApi.toggleProjectStatus(confirm.id, confirm.action);
      setSuccess(
        `Project ${confirm.action === "activate" ? "activated" : "inactivated"} successfully.`
      );
      closeConfirm();
      await fetchProjects(page, search);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || `Unable to ${confirm.action} project`
        : `Unable to ${confirm.action} project`;
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
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track delivery and project activity.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or description"
                className={inputClass + " w-full pl-10"}
              />
            </div>
            <button
              className={btnPrimaryClass + " mt-0 w-full sm:w-auto px-4 py-2 !inline-flex items-center justify-center"}
              onClick={() => {
                // TODO: wire up create project flow
              }}
            >
              <FiPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Project
            </button>
          </div>
        </div>

        {error && <div className={alertErrorClass}>{error}</div>}

        <ConfirmDialog
          open={confirm.open}
          title={confirm.action === "activate" ? "Activate Project" : "Inactivate Project"}
          description={`Are you sure you want to ${confirm.action} this project?`}
          confirmLabel={confirm.action === "activate" ? "Activate" : "Inactivate"}
          cancelLabel="Cancel"
          onConfirm={handleConfirmToggle}
          onCancel={closeConfirm}
          loading={toggleLoading}
        />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading projects...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">No projects found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Project Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((project) => (
                    <tr key={project.id} className="border-t border-gray-100 dark:border-slate-800">
                      <td className="px-4 py-3">{project.name}</td>
                      <td className="px-4 py-3">{project.description}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${project.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {statusLabel(project.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{new Date(project.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <ActionIconButton
                            title="Edit Project"
                            ariaLabel={`Edit ${project.name}`}
                            icon={<FiEdit2 className="h-5 w-5" aria-hidden="true" />}
                            onClick={() => {
                              // TODO: wire up edit flow
                            }}
                          />
                          <StatusToggleButton
                            status={project.status}
                            entityName={project.name}
                            entityType="Project"
                            activateIcon={<MdCheckCircle className="h-5 w-5" aria-hidden="true" />}
                            inactivateIcon={<MdCancel className="h-5 w-5" aria-hidden="true" />}
                            onToggle={() => openToggleConfirm(project)}
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
              onClick={() => fetchProjects(page - 1, search)}
              disabled={page <= 1 || loading}
            >
              Previous
            </button>
            <button
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => fetchProjects(page + 1, search)}
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

export default Projects;

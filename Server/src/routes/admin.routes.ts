import { Router } from "express";
import {
  activateAdminEmployee,
  activateAdminProject,
  deactivateAdminEmployee,
  deactivateAdminProject,
  getAdminDashboardSummary,
  getAdminEmployees,
  getAdminProjects,
  postAdminEmployee,
  postAdminProject,
  putAdminEmployee,
  putAdminProject,
} from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/dashboard-summary", getAdminDashboardSummary);
router.get("/employees", getAdminEmployees);
router.post("/employees", postAdminEmployee);
router.put("/employees/:id", putAdminEmployee);
router.patch("/employees/:id/inactivate", deactivateAdminEmployee);
router.patch("/employees/:id/activate", activateAdminEmployee);
router.get("/projects", getAdminProjects);
router.post("/projects", postAdminProject);
router.put("/projects/:id", putAdminProject);
router.patch("/projects/:id/inactivate", deactivateAdminProject);
router.patch("/projects/:id/activate", activateAdminProject);

export default router;

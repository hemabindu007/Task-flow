import { Request, Response } from "express";
import {
  activateEmployee,
  activateProject,
  AdminError,
  createEmployee,
  createProject,
  getDashboardSummary,
  inactivateEmployee,
  inactivateProject,
  listEmployees,
  listProjects,
  updateEmployee,
  updateProject,
} from "../services/admin.service";

export const getAdminDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const summary = await getDashboardSummary();
    res.json(summary);
  } catch (error) {
    console.error("Admin dashboard summary error:", error);
    res.status(500).json({ message: "Server error fetching dashboard summary" });
  }
};

export const getAdminEmployees = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = (req.query.search as string | undefined) || "";
    const employees = await listEmployees(page, limit, search);
    res.json(employees);
  } catch (error) {
    console.error("List employees error:", error);
    res.status(500).json({ message: "Server error fetching employees" });
  }
};

export const postAdminEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Create employee error:", error);
    res.status(500).json({ message: "Server error creating employee" });
  }
};

export const putAdminEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const employee = await updateEmployee(employeeId, req.body);
    res.json(employee);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Update employee error:", error);
    res.status(500).json({ message: "Server error updating employee" });
  }
};

export const deactivateAdminEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await inactivateEmployee(employeeId);
    res.json(result);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Deactivate employee error:", error);
    res.status(500).json({ message: "Server error deactivating employee" });
  }
};

export const activateAdminEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await activateEmployee(employeeId);
    res.json(result);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Activate employee error:", error);
    res.status(500).json({ message: "Server error activating employee" });
  }
};

export const getAdminProjects = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = (req.query.search as string | undefined) || "";
    const projects = await listProjects(page, limit, search);
    res.json(projects);
  } catch (error) {
    console.error("List projects error:", error);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};

export const postAdminProject = async (req: Request, res: Response) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Create project error:", error);
    res.status(500).json({ message: "Server error creating project" });
  }
};

export const putAdminProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await updateProject(projectId, req.body);
    res.json(project);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Update project error:", error);
    res.status(500).json({ message: "Server error updating project" });
  }
};

export const deactivateAdminProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await inactivateProject(projectId);
    res.json(result);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Deactivate project error:", error);
    res.status(500).json({ message: "Server error deactivating project" });
  }
};

export const activateAdminProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await activateProject(projectId);
    res.json(result);
  } catch (error) {
    if (error instanceof AdminError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error("Activate project error:", error);
    res.status(500).json({ message: "Server error activating project" });
  }
};

import bcrypt from "bcrypt";
import crypto from "crypto";
import { Op } from "sequelize";
import { Project, User } from "../models";
import { sendWelcomeEmail } from "./email.service";

export class AdminError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AdminError";
    this.statusCode = statusCode;
  }
}

const sanitizeEmployee = (user: User) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

const sanitizeProject = (project: Project) => ({
  id: project.id,
  name: project.name,
  description: project.description,
  status: project.status,
  createdAt: project.createdAt,
});

export const getDashboardSummary = async () => {
  const [employeeCount, projectCount] = await Promise.all([
    User.count({ where: { role: "employee" } }),
    Project.count(),
  ]);

  return {
    employeeCount,
    projectCount,
  };
};

export const listEmployees = async (page = 1, limit = 10, search = "") => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const offset = (safePage - 1) * safeLimit;

  const where: any = { role: "employee" };
  if (search.trim()) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: safeLimit,
    offset,
  });

  return {
    items: rows.map(sanitizeEmployee),
    page: safePage,
    limit: safeLimit,
    total: count,
    totalPages: Math.ceil(count / safeLimit),
  };
};

export const createEmployee = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}) => {
  const { firstName, lastName, email, role } = payload;

  if (role !== "USER") {
    throw new AdminError("Only USER role may be created at this time", 400);
  }

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    throw new AdminError("First name, last name, and email are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AdminError("Email must be a valid address", 400);
  }
  const existingUser = await User.findOne({
    where: { email: { [Op.iLike]: normalizedEmail } },
  });

  if (existingUser) {
    throw new AdminError("Email already exists", 409);
  }

  const temporaryPassword = `${crypto.randomBytes(8).toString("hex")}${Math.random().toString(36).slice(-4)}!A`;
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "employee",
    status: "active",
    emailVerified: true,
    forcePasswordChange: true,
  });

  try {
    await sendWelcomeEmail(user.firstName, user.lastName, user.email, temporaryPassword);
  } catch (error) {
    await user.destroy();
    throw new AdminError("Failed to send welcome email", 500);
  }

  return sanitizeEmployee(user);
};

export const updateEmployee = async (
  employeeId: string,
  payload: { firstName?: string; lastName?: string; email?: string }
) => {
  const { firstName, lastName, email } = payload;

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    throw new AdminError("First name, last name, and email are required", 400);
  }

  const user = await User.findOne({ where: { id: employeeId, role: "employee" } });
  if (!user) {
    throw new AdminError("Employee not found", 404);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailConflict = await User.findOne({
    where: {
      email: { [Op.iLike]: normalizedEmail },
      id: { [Op.ne]: employeeId },
    },
  });

  if (emailConflict) {
    throw new AdminError("Email already exists", 409);
  }

  await user.update({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
  });

  return sanitizeEmployee(user);
};

export const inactivateEmployee = async (employeeId: string) => {
  const user = await User.findOne({ where: { id: employeeId, role: "employee" } });
  if (!user) {
    throw new AdminError("Employee not found", 404);
  }

  await user.update({ status: "inactive" });
  return { message: "Employee inactivated successfully" };
};

export const activateEmployee = async (employeeId: string) => {
  const user = await User.findOne({ where: { id: employeeId, role: "employee" } });
  if (!user) {
    throw new AdminError("Employee not found", 404);
  }

  await user.update({ status: "active" });
  return { message: "Employee activated successfully" };
};

export const listProjects = async (page = 1, limit = 10, search = "") => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const offset = (safePage - 1) * safeLimit;

  const where: any = {};
  if (search.trim()) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Project.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: safeLimit,
    offset,
  });

  return {
    items: rows.map(sanitizeProject),
    page: safePage,
    limit: safeLimit,
    total: count,
    totalPages: Math.ceil(count / safeLimit),
  };
};

export const createProject = async (payload: { name: string; description: string }) => {
  const { name, description } = payload;

  if (!name?.trim() || !description?.trim()) {
    throw new AdminError("Project name and description are required", 400);
  }

  const project = await Project.create({
    name: name.trim(),
    description: description.trim(),
    status: "active",
  });

  return sanitizeProject(project);
};

export const updateProject = async (
  projectId: string,
  payload: { name?: string; description?: string }
) => {
  const { name, description } = payload;

  if (!name?.trim() || !description?.trim()) {
    throw new AdminError("Project name and description are required", 400);
  }

  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new AdminError("Project not found", 404);
  }

  await project.update({
    name: name.trim(),
    description: description.trim(),
  });

  return sanitizeProject(project);
};

export const inactivateProject = async (projectId: string) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new AdminError("Project not found", 404);
  }

  await project.update({ status: "inactive" });
  return { message: "Project inactivated successfully" };
};

export const activateProject = async (projectId: string) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new AdminError("Project not found", 404);
  }

  await project.update({ status: "active" });
  return { message: "Project activated successfully" };
};

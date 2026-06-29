import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ProjectAttributes {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

type ProjectCreationAttributes = Optional<ProjectAttributes, "id" | "createdAt" | "updatedAt">;

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare status: "active" | "inactive";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "projects",
    timestamps: true,
  }
);

export default Project;

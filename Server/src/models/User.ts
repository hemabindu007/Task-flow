import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type UserRole = "admin" | "employee";

export interface UserAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  status: "active" | "inactive";
  emailVerified: boolean;
  forcePasswordChange: boolean;
  emailVerificationOtp: string | null;
  emailVerificationOtpExpiry: Date | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  | "id"
  | "role"
  | "status"
  | "emailVerified"
  | "forcePasswordChange"
  | "emailVerificationOtp"
  | "emailVerificationOtpExpiry"
  | "resetToken"
  | "resetTokenExpiry"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare role: UserRole;
  declare status: "active" | "inactive";
  declare emailVerified: boolean;
  declare forcePasswordChange: boolean;
  declare emailVerificationOtp: string | null;
  declare emailVerificationOtpExpiry: Date | null;
  declare resetToken: string | null;
  declare resetTokenExpiry: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin","employee"),
      allowNull: false,
      defaultValue: "admin",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    forcePasswordChange: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerificationOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerificationOtpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;

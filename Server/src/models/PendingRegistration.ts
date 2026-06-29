import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface PendingRegistrationAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  otp: string;
  otpExpiry: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type PendingRegistrationCreationAttributes = Optional<
  PendingRegistrationAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class PendingRegistration
  extends Model<PendingRegistrationAttributes, PendingRegistrationCreationAttributes>
  implements PendingRegistrationAttributes
{
  declare id: string;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare otp: string;
  declare otpExpiry: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PendingRegistration.init(
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
      validate: {
        isEmail: true,
      },
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
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "pending_registrations",
    timestamps: true,
  }
);

export default PendingRegistration;

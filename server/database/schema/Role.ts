const { DataTypes } = require('sequelize');
import { sequelize } from "../../config";

export const Role = sequelize.define(
  "Role",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true, // Description is optional
    },
    role_permissions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    paranoid: true, // Optional: Enables soft deletes
  }
);

const { DataTypes } = require('sequelize');
import { sequelize } from "../../config";

export const Permission = sequelize.define(
  "Permission",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'permissions', // Specify the table name to match the collection
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    paranoid: true, // Optional: Enables soft deletes
  }
);

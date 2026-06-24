const { DataTypes } = require('sequelize');
import { sequelize } from "../../config";

export const Announcement = sequelize.define(
  "Announcement",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures that title cannot be empty
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null, // Default to null if not provided
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Published'),
      defaultValue: 'Draft',
      allowNull: false, // Ensure status is always set
    },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    paranoid: true, // Optional: Enables soft deletes
  }
);

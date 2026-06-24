const { DataTypes } = require('sequelize');
import { sequelize } from "../../config";

export const Blog = sequelize.define(
  "Blog",
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
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures that description cannot be empty
      },
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft',
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    paranoid: true, // Optional: Enables soft deletes
  }
);

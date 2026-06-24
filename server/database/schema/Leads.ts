const { DataTypes } = require('sequelize');
import { sequelize } from "../../config";

export const Lead = sequelize.define(
  "Lead",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: false, // phoneNumber is optional, but can be validated if required
      },
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM('Website', 'Referral', 'Social Media', 'Other'),
      defaultValue: 'Other',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('New', 'In Progress', 'Contacted', 'Converted', 'Rejected'),
      defaultValue: 'New',
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    paranoid: true, // Optional: Enables soft deletes
  }
);

const { DataTypes } = require('sequelize');
import { sequelize } from "../../config";
import { User } from './User'; // Import the User model to create relationships

export const Todo = sequelize.define(
  "Todo",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER, // Assuming `userId` is an integer (or adjust the type if you're using UUID)
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    paranoid: true, // Optional: Enables soft deletes
  }
);

// Defining the relationship between Todo and User
Todo.belongsTo(User, { foreignKey: 'userId' }); // Defines that each Todo is associated with one User


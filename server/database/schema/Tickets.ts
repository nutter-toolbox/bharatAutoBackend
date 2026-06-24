const { DataTypes } = require('sequelize');
import { sequelize } from "../../config";
import { User } from './User'; // Import the User model

export const Ticket = sequelize.define(
  "Ticket",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'In Progress', 'hold'),
      defaultValue: 'pending',
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'partially paid', 'paid', 'under warranty' ,"unpaid","none"),
      defaultValue: 'pending',
    },
    type: {
      type: DataTypes.ENUM('site-survey', 'sale', 'service','enquiry'),
      defaultValue: 'site-survey',
    },
    startdate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enddate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estimate_price_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimate_price_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_price_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_price_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_text_two: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_photo_two:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_two_comment:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_text_three:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_photo_three: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actual_price_three_comment:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    outstanding_price_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    outstanding_price_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appriciation_one_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appriciation_two_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appriciation_three_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    social_media_feedback_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Reference to the User table
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Reference to the User table
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

// Define the association
User.hasMany(Ticket, {
  foreignKey: "user_id",
});
Ticket.belongsTo(User, {
  foreignKey: "user_id",
});
Ticket.belongsTo(User, {
  foreignKey: 'customer_id',
  as: 'customer', // Use an alias to distinguish from the other User association
});
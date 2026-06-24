// const Sequelize = require("sequelize");
import { Sequelize } from "sequelize";
import { CONFIG } from "./environment";

export const sequelize = new Sequelize(
  CONFIG.DB_NAME,
  CONFIG.DB_USERNAME,
  CONFIG.DB_PASSWORD,
  {
    host: CONFIG.DB_HOST,
    dialect: "mysql",
    logging: false
  }
);

export const connectToDatabase = () => {
  sequelize
    .authenticate()
    .then(() => {
      sequelize.sync({ alter: true }); // This will create table in db if not exists
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
};

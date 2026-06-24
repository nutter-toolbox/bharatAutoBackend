import express from "express";
import cors from "cors";
import router from "./routes";
import sgMail from "@sendgrid/mail";
const mongoose = require('mongoose');
import { connectToDatabase } from "./config";
import path from "path"; // Import path to handle file paths


declare global {
    interface BigInt {
        toJSON: () => string;
    }
}
BigInt.prototype.toJSON = function () {
    return this.toString();
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Database connection
connectToDatabase();

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
};

const server = express();
server.use(
    express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
server.use(express.json({ limit: "50mb" }));
server.use(cors(corsOptions));
server.set("view engine", "ejs");
server.use("/api", router);
server.use('/uploads', express.static(path.join(__dirname, '../uploads')));


export default server;

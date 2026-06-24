import * as express from "express";
import ticketsRouter from "./ticket";
import userRouter from "./user";
import authRouter from "./auth";


// import { auth } from "admin/middlewares";

const router = express.Router();
router.use("/", authRouter);
router.use("/tickets", ticketsRouter);
router.use("/account", userRouter);

export default router;


import * as express from "express";
import authRouter from "./auth";
import permissionsRouter from "./permission";
import ticketsRouter from "./tickets";
import announcementsRouter from "./announcements";
import leadsRouter from "./leads";
import rolesRouter from "./roles";
import userRouter from "./users";
import blogRouter from "./blog"
import todoRouter from "./todo"


import miscRouter from "./misc";

import { auth } from "admin/middlewares";

const router = express.Router();

router.use("/", authRouter);
router.use("/users", auth, userRouter);
router.use("/permissions", auth, permissionsRouter);
router.use("/roles", auth, rolesRouter);
router.use("/misc", auth, miscRouter);
router.use("/tickets", auth, ticketsRouter);
router.use("/announcements", auth, announcementsRouter);
router.use("/blog",auth, blogRouter);
router.use("/leads", auth, leadsRouter);
router.use("/todo",auth, todoRouter);

export default router;


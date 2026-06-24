import { Router } from "express";
import adminRouter from "../admin/routes";
import userRouter from "../user/routes"


const router = Router();

// ====== Admin route ======
router.use("/admin", adminRouter);
router.use("/user",userRouter)

export default router;

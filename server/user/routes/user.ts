import * as express from "express";
import UserController from "user/controllers/users/userController";
import { validatePassword, validateUserBody } from "user/controllers/users/userValidation";
import { auth } from "user/middlewares";


const router = express.Router();

const { getUser, changePassword, editUser } = UserController

router.get("/profile", auth, getUser);
router.post("/profile/change-password",auth,  changePassword);
router.post("/profile/update", auth, editUser);

export default router;

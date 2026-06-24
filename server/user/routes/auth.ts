import * as express from "express";
import AuthController from "user/controllers/auth/auth.controller";
import * as AuthValidation from "../controllers/auth/auth.validation";
import { auth } from "admin/middlewares";

const router = express.Router();

const {  validateUpdateProfileBody, validateChangePasswordBody,  validateForgotPasswordBody, validateResetPasswordBody, validateSignupAdminBody } = AuthValidation;
const {  stafflogin,editProfile, changePassword,  resendEmailOtp, forgotPassword, resetPassword } = AuthController;

router.post("/staff/login", stafflogin);
// router.post("/signup", validateSignupAdminBody, signup);
// router.post("/resend-code/:user_id", resendEmailOtp);
// router.post("/edit-profile", auth, validateUpdateProfileBody, editProfile);
// router.post("/change-password", auth, validateChangePasswordBody, changePassword);
router.post("/forgot-password", validateForgotPasswordBody, forgotPassword);
router.post("/reset-password", validateResetPasswordBody, resetPassword);

export default router;

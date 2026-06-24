import axios from "axios";
import { CONFIG } from "config";
import { sendEmail, TemplateId } from '../helpers';

export const sendOtpCodeEmail = async (email: string, code: string) => {
    const res = await sendEmail(email, TemplateId.OtpCode, {
        code,
        username: email,
    });

};

export const sendForgotPasswordEmail = async (email: string, token: string) => {
    const resetLink = `${CONFIG.APP_BASE_URL}/auth/reset-password?token=${token}`;
    await sendEmail(email, TemplateId.ForgotPassword, {
        resetLink,
        username: email,
    });
};

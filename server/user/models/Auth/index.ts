import {
    TAdmin,
    TUpdateAdminToken,
    TUpdateAdminProfile,
    TUpdateAdminPassword,
    TSendVerificationCode,
    TForgotPassword,
    TResetPassword
} from "user/controllers/auth/auth.types";
import { TUser } from "common/types/user/user.type";
import { User as EndUser } from "database/schema";
import { Op } from "sequelize";

export class Auth {
    constructor() { }

    public async getUserByEmail(email: string): Promise<TUser | any> {
        const data = await EndUser.findOne({ where: { email } });
        return data ? data : null;
    }

    public async updateRefreshToken(data: TUpdateAdminToken): Promise<boolean> {
        await EndUser.update({
            refresh_token: data.refresh_token,
            last_login_at: data.last_login_at,
            last_login_ip: data.last_login_ip,
        }, {
            where: {
                id: data.user_id
            }
        });
        return true;
    }

    public async editProfile(data: TUpdateAdminProfile): Promise<TAdmin | null> {
        const [updated] = await EndUser.update({
            full_name: data.full_name,
            contact_number: data.contact_number,
            phone_code: data.phone_code,
            address: data.address,
        }, {
            where: { id: data.user_id },
            returning: true,
        });
        return updated ? updated[0] : null;
    }

    public async changePassword(data: TUpdateAdminPassword): Promise<boolean> {
        await EndUser.update({
            password: data.password,
        }, {
            where: { id: data.user_id }
        });
        return true;
    }

    public async getUserPassword(id: number): Promise<{ password: string } | any> {
        const data = await EndUser.findOne({
            attributes: ['password'],
            where: { id }
        });
        return data ? data : null;
    }

    public async sendEmailVerificationCode(data: TSendVerificationCode): Promise<boolean> {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15);

        await EndUser.update({
            email_code: data.code,
            email_code_expiry: expiryDate,
        }, {
            where: { id: data.user_id }
        });
        return true;
    }

    public async getUserById(user_id: string): Promise<TUser | any> {
        const data = await EndUser.findOne({
            where: { id: user_id },
            include: ['role'],
        });
        return data ? data : null;
    }

    public async getUserByrefreshToken(password_reset_code: string): Promise<TUser | any> {
        const data = await EndUser.findOne({ where: { password_reset_code } });
        return data ? data : null;
    }

    public async resetOtp(user_id: string): Promise<boolean> {
        await EndUser.update({
            email_code: null,
            email_code_expiry: null,
        }, {
            where: { id: user_id }
        });
        return true;
    }

    public async updateForgotPasswordDetails(data: TForgotPassword): Promise<boolean> {
        await EndUser.update({
            password_reset_code: data.password_reset_code,
            password_reset_expiry: data.password_reset_expiry,
        }, {
            where: { id: data.id }
        });
        return true;
    }

    public async resetPassword(data: TResetPassword): Promise<boolean> {
        await EndUser.update({
            password: data.password,
        }, {
            where: { id: data.id }
        });
        return true;
    }
}

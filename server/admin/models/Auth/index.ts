import {
    TAdmin,
    TUpdateAdminToken,
    TUpdateAdminProfile,
    TUpdateAdminPassword,
    TSendVerificationCode,
    TForgotPassword,
    TResetPassword
} from "admin/controllers/auth/auth.types";
import { User as EndUser, Role } from "database/schema";

export class Auth {
    constructor() { }

    public async getUserByEmail(email: string): Promise<any> {
        const data: any = await EndUser.findOne({ where: { email } });
        if (data?.role) {
            const roleData = await Role.findOne({
                where: { id: data?.role },
            });
            if (roleData) {
                return data ? { ...data?.dataValues, role: roleData?.dataValues } : null;
            }
        }
        return data ? { ...data?.dataValues } : null;
    }

    public async updateRefreshToken(data: TUpdateAdminToken): Promise<boolean> {
        await EndUser.update(
            {
                refresh_token: data.refresh_token,
                last_login_at: data.last_login_at,
                last_login_ip: data.last_login_ip,
            },
            { where: { id: data.user_id } }
        );
        return true;
    }

    public async editProfile(data: TUpdateAdminProfile): Promise<TAdmin | any> {
        const [updated] = await EndUser.update(
            {
                full_name: data.full_name,
                contact_number: data.contact_number,
                phone_code: data.phone_code,
                address: data.address,
            },
            { where: { id: data.user_id } }
        );
        return updated ? data : null;
    }

    public async changePassword(data: TUpdateAdminPassword): Promise<boolean> {
        await EndUser.update(
            {
                password: data.password,
            },
            { where: { id: data.user_id } }
        );
        return true;
    }

    public async getUserPassword(id: number): Promise<{ password: string } | any> {
        const data: any = await EndUser.findOne({ attributes: ['password'], where: { id } });
        return data ? { password: data.password } : null;
    }

    public async sendEmailVerificationCode(
        data: TSendVerificationCode
    ): Promise<boolean> {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 15);
        await EndUser.update(
            {
                email_code: data.code,
                email_code_expiry: date,
            },
            { where: { id: data.user_id } }
        );
        return true;
    }

    public async getUserById(user_id: number): Promise<any> {
        const data: any = await EndUser.findOne({
            where: { id: user_id },
            // include: ['role'], 
        });

        const roleData = await Role.findOne({
            where: { id: data?.role },
        });

        return data ? { ...data?.dataValues, role: roleData?.dataValues } : null;
    }

    public async getUserByrefreshToken(password_reset_code: string): Promise<TForgotPassword | null> {
        const data: any = await EndUser.findOne({ where: { password_reset_code } });
        return data ? data : null;
    }

    public async resetOtp(user_id: number): Promise<boolean> {
        await EndUser.update(
            {
                email_code: null,
                email_code_expiry: null,
            },
            { where: { id: user_id } }
        );
        return true;
    }

    public async updateForgotPasswordDetails(
        data: TForgotPassword
    ): Promise<boolean> {
        await EndUser.update(
            {
                password_reset_code: data.password_reset_code,
                password_reset_expiry: data.password_reset_expiry,
            },
            { where: { id: data.id } }
        );
        return true;
    }

    public async resetPassword(data: TResetPassword): Promise<boolean> {
        await EndUser.update(
            {
                password: data.password,
            },
            { where: { id: data.id } }
        );
        return true;
    }
}

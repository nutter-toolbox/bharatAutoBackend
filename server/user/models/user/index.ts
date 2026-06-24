import { User as UserModel } from "database/schema";
import { TUser } from "common/types/user/user.type";

export class User {
    public async getUserById(id: string): Promise<TUser | any> {
        try {
            const data = await UserModel.findByPk(id);
            return data ? data : null;
        } catch (err) {
            console.error('Error in getUserById:', err);
            return null;
        }
    }

    public async changePassword(id: string, password: string): Promise<TUser | any> {
        try {
            const [updatedCount, updatedUser] = await UserModel.update({ password }, {
                where: { id },
                returning: true
            });
            return updatedCount > 0 ? updatedUser[0] : null;
        } catch (err) {
            console.error('Error in changePassword:', err);
            return null;
        }
    }

    public async editUser(id: string, data: TUser): Promise<TUser | any> {
        try {
            const [updatedCount, updatedUser] = await UserModel.update(data, {
                where: { id },
                returning: true
            });
            return updatedCount > 0 ? updatedUser[0] : null;
        } catch (err) {
            console.error('Error in editUser:', err);
            return null;
        }
    }

    public async updateUserImage(id: string, image: string) {
        try {
            const user: any = await UserModel.findByPk(id);
            if (!user) return null;

            user.profile_photo = image;
            await user.save();
            return user;
        } catch (err) {
            console.error('Error in updateUserImage:', err);
            return null;
        }
    }
}

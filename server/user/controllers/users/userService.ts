import { ImageCrud } from "admin/models"
import { TUser } from "common/types/user/user.type"



import { User } from "user/models/user"


export class UserService {
    static async getUser(id: string) {
        const obj = new User()
        const response = await obj.getUserById(id)
        return response
    }
    static async changePassword(id: string, newPassword: string) {
        const obj = new User()
        const response = await obj.changePassword(id, newPassword)
        return response
    }
    static async editUser(id: string, data: TUser, image?: Buffer) {
        const obj = new User();
        await obj.editUser(id, data);

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data.profile_photo) {
                const oldPath = data.profile_photo.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `images/users/${id}-${dateId}`;
                const type = "user"
                imgRes = (await img.updateImage(
                    `images/users/${oldFileName}`,
                    image,
                    newFileName,
                    type
                )) as string;
            } else {
                const type = "user"

                imgRes = await img.uploadImage(image, `images/users/${id}`, type);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateUserImage(id, imageUrl);
        }
        return { ...data };
    }

}
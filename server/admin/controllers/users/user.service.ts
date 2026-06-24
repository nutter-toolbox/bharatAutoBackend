import { User, ImageCrud } from "admin/models";
import { TUser } from "common/types/user/user.type";

export default class UserService {
    static async getUsersExcludingRole(data: any) {
        const obj = new User();
        const response = await obj.getUsersExcludingRole(data);
        return response;
    }
    static async getRoleUsers(data: any) {
        const obj = new User();
        const response = await obj.getRoleUsers(data);
        return response;
    }
    static async getRoleCustomers(data: any) {
        const obj = new User();
        const response = await obj.getRoleCustomers(data);
        return response;
    }
    static async getTypeUsers(data: any) {
        const obj = new User();
        const response = await obj.getTypeUsers(data);
        return response;
    }

    static async addUser(data: TUser, image?: Buffer) {
        const obj = new User();
        let resp = await obj.addUser(data);
        if (image && resp.id) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            // const fileName = `images/users/${resp.id}-${dateId}`;
            const fileName = `${resp.id}-${dateId}`; // Local file name (without path)
            const type = "user"
            const imgRes = await img.uploadImage(image, fileName, type);
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateUserImage(resp.id, imageUrl);
        }
        return resp;
    }
    static async addCustomer(data: TUser, image?: Buffer) {
        const obj = new User();
        let resp = await obj.addCustomer(data);
        if (image && resp.id) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            // const fileName = `images/users/${resp.id}-${dateId}`;
                const fileName = `${resp.id}-${dateId}`; // Local file name (without path)
            const type = "user"
            const imgRes = await img.uploadImage(image, fileName,type);
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateUserImage(resp.id, imageUrl);
        }
        return resp;
    }

    static async editUser(id: number, data: TUser, image?: Buffer) {
        const obj = new User();
        await obj.editUser(id, data);

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data.profile_photo) {
                const oldPath = data.profile_photo.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                // const newFileName = `images/users/${id}-${dateId}`;
                    const newFileName = `${id}-${dateId}`; // Local file name (without path)
            const type = "user"

                imgRes = (await img.updateImage(
                   `${type}/${oldFileName}`,
                    image,
                    newFileName,type
                )) as string;
            } else {
                const type='user'
                imgRes = await img.uploadImage(image,  `${type}/${id}-${new Date().getTime()}`,type);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateUserImage(id, imageUrl);
        }
        return { ...data };
    }
    static async editCustomer(id: number, data: TUser, image?: Buffer) {
        const obj = new User();
        await obj.editCustomer(id, data);

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data.profile_photo) {
                const oldPath = data.profile_photo.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `${id}-${dateId}`; // Local file name (without path)
                const type = "user"

                imgRes = (await img.updateImage(
                    `${type}/${oldFileName}`,
                    image,
                    newFileName,type
                )) as string;
            } else {
                const type = "user"

                imgRes = await img.uploadImage(image,  `${type}/${id}-${new Date().getTime()}`,type);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateUserImage(id, imageUrl);
        }
        return { ...data };
    }

    static async getUserById(id: number) {
        const obj = new User();
        const response = await obj.getUserById(id);
        return response;
    }

    static async getUsersById(id: number[]) {
        const obj = new User();
        const response = await obj.getUsersById(id);
        return response;
    }

    static async deleteUser(ids: number[]) {
        const obj = new User();
        const response = await obj.deleteUser(ids);
        return response;
    }

    static async deleteCustomer(ids: number[], roleId: string) {
        const obj = new User();
        const response = await obj.deleteCustomer(ids, roleId);
        return response;
    }

    static async deleteUserImage(data: TUser) {
        const img = new ImageCrud();
        const oldPath = data?.profile_photo?.split("/");
        const oldFileName = oldPath?.[oldPath?.length - 1];
        const type ='user'
        oldPath &&
            oldFileName &&
            (await img.deleteImage(`/uploads/${type}/${oldFileName}`,type));
        return true;
    }

    static async signup(data: TUser) {
        const obj = new User();
        let resp = await obj.addUser(data);
        return resp;
    }
}

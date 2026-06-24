import { Announcements, ImageCrud } from "admin/models";
import { TAnnouncements } from "common/types/announcements";

export default class AnnouncementsService {
    static async addAnnouncements(data: TAnnouncements, image?: Buffer) {
        const obj = new Announcements();
        const response = await obj.addAnnouncements(data);
        if (image && response.id) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            const fileName = `${response.id}-${dateId}`; // Local file name (without path)

const type ="announcements"
            const imgRes = await img.uploadImage(image, fileName,type);
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateAnnouncmentseModelImage(response.id, imageUrl);
        }
        return response;

    }

    static async getAllAnnouncementss(data: any) {
        const obj = new Announcements();
        const response = await obj.getAllAnnouncementss(data);
        return response;
    }

    static async getAnnouncementsById(id: string) {
        const obj = new Announcements();
        const response = await obj.getAnnouncementsById(id);
        return response;
    }

    static async updateAnnouncements(id: string, data: TAnnouncements, image?: Buffer) {
        const obj = new Announcements();
        await obj.updateAnnouncements(id, data);

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data.profile_photo) {
                const oldPath = data.profile_photo.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `${id}-${dateId}`; 


                const type ="announcements"
                imgRes = (await img.updateImage(
                    `${type}/${oldFileName}`,
                    image,
                    newFileName,type
                )) as string;
            } else {
                const type ="announcements"

                imgRes = await img.uploadImage(image,  `${type}/${id}-${new Date().getTime()}`,type);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateAnnouncmentseModelImage(id, imageUrl);
        }
        return { ...data };
    }

    static async deleteAnnouncementss(ids: string[]) {
        const obj = new Announcements();
        const response = await obj.deleteAnnouncementss(ids);
        return response;
    }


}

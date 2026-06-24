import { Announcement as AnnouncementsModel } from "database/schema";
import { TAnnouncements } from "common/types/announcements";

export class Announcements {
    public async addAnnouncements(data: TAnnouncements): Promise<TAnnouncements | any> {
        const newAnnouncements = await AnnouncementsModel.create(data);
        return newAnnouncements;
    }

    public async getAllAnnouncementss(filters: any): Promise<{ total: number, data: any[] }> {
        const { offset, limit } = filters;

        const { count, rows } = await AnnouncementsModel.findAndCountAll({
            offset,
            limit,
        });

        return { total: count, data: rows };
    }

    public async getAnnouncementsById(id: string): Promise<any | null> {
        const announcement = await AnnouncementsModel.findByPk(id);
        return announcement ?? null;
    }

    public async updateAnnouncements(id: string, data: TAnnouncements): Promise<TAnnouncements | any> {
        const [updatedRowsCount, updatedAnnouncements] = await AnnouncementsModel.update(data, {
            where: { id },
            returning: true,
        });

        return updatedRowsCount > 0 ? updatedAnnouncements[0] : null;
    }

    public async deleteAnnouncementss(ids: string[]): Promise<number> {
        const result = await AnnouncementsModel.destroy({
            where: {
                id: ids,
            },
        });
        return result;
    }

    public async updateAnnouncmentseModelImage(id: string, image: string): Promise<any | null> {
        const announcement = await AnnouncementsModel.findByPk(id);
        if (!announcement) return null;

        await announcement.update({ profile_photo: image });
        return announcement;
    }
}

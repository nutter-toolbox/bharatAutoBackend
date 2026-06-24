import { TTickets } from "common/types/tickets";
import { Tickets } from "../../models/Tickets/index"
import { ImageCrud } from "admin/models";
import { Misc } from "user/models/Misc";
export class TicketsService {
    static async getTickets(id: string) {
        const obj = new Tickets();
        const response = await obj.getTickets(id);
        return response;
    }
    static async getTicketById(id: string) {
        const obj = new Tickets();
        const response = await obj.getTicketById(id);
        return response;
    }
    static async recentFive(id: string) {
        const obj = new Tickets();
        const response = await obj.recentFive(id);
        return response;
    }

    static async updateTickets(id: string, data: TTickets) {
        const obj = new Tickets();
        const response = await obj.updateTickets(id, data);
        return response;
    }
    // static async updateTicketStatus(id: string,status: string) {
    //     const obj = new Tickets();
    //     const response = await obj.updateTicketStatus(id, status);
    //     return response;
    // }

    static async updateTicketStatus(id: string, updateFields: { status: string; startdate?: string; enddate?: string }) {
        const obj = new Tickets();
        const response = await obj.updateTicketStatus(id, updateFields);
        return response;
    }
    static async editTickets(
        id: string,
        data: TTickets,
        images?: {
            estimatePricePhoto?: Buffer,
            billingPricePhoto?: Buffer,
            actualPricePhoto?: Buffer,
            actualPricePhotoTwo?: Buffer,
            actualPricePhotoThree?: Buffer,
            outstandingPricePhoto?: Buffer,
            appriciationOnePhoto?: Buffer,
            socialMediaFeedbackPhoto?: Buffer
        }
    ) {
        const obj = new Tickets();
        await obj.updateTickets(id, data);

        if (images) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();

            // Process each image
            const processImageAndUpload = async (image?: Buffer, field?: string) => {
                if (image) {
                      const fileName = `${id}-${field}-${dateId}`; // Local file name (without path)
                    const type = 'tickets'
                    const imgRes = await img.uploadImage(image, fileName,type);
                    const imageUrl = (imgRes as string).split("?")[0];
                    await obj.updateTicketsImage(id, imageUrl, field);
                }
            };

            await processImageAndUpload(images?.estimatePricePhoto, 'estimate_price_photo');
            await processImageAndUpload(images?.billingPricePhoto, 'billing_price_photo');
            await processImageAndUpload(images?.actualPricePhoto, 'actual_price_photo');
            await processImageAndUpload(images.actualPricePhotoTwo, "actual_price_photo_two");
            await processImageAndUpload(images.actualPricePhotoThree, "actual_price_photo_three");
            await processImageAndUpload(images?.outstandingPricePhoto, 'outstanding_price_photo');
            await processImageAndUpload(images.appriciationOnePhoto, "appriciation_one_photo");
            await processImageAndUpload(images?.socialMediaFeedbackPhoto, 'social_media_feedback_photo');
          
        }

        return { ...data };
    }

}
import { ImageCrud, Tickets } from "admin/models";
import { TTickets } from "common/types/tickets";

export default class TicketsService {
    static async addTickets(data: TTickets, images?: {
        estimatePricePhotoBuffer?: Buffer;
        billingPricePhotoBuffer?: Buffer;
        actualPricePhotoBuffer?: Buffer;
        actualPricePhototwoBuffer?: Buffer;
        actualPricePhotothreeBuffer?: Buffer;
        outstandingPricePhotoBuffer?: Buffer;
        appriciationOnePhotoBuffer?: Buffer;
        appriciationTwoPhotoBuffer?: Buffer;
        appriciationThreePhotoBuffer?: Buffer;
        socialMediaFeedbackPhotoBuffer?: Buffer;
    }) {
        const obj = new Tickets();
        let resp = await obj.addTickets(data);

        if (resp.id) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();

            // Process each image
            const processImageAndUpload = async (image?: Buffer, field?: string) => {
                if (image && resp.id) {
                    const fileName = `${resp.id}-${field}-${dateId}`; // Local file name (without path)
                    const type = 'tickets'

                    // const fileName = `images/tickets/${resp.id}-${dateId}-${field}`;
                    const imgRes = await img.uploadImage(image, fileName, type);
                    const imageUrl = (imgRes as string).split("?")[0];
                    await obj.updateTicketsImage(resp.id, imageUrl, field);
                }
            };

            // Upload images
            await processImageAndUpload(images?.estimatePricePhotoBuffer, 'estimate_price_photo');
            await processImageAndUpload(images?.billingPricePhotoBuffer, 'billing_price_photo');
            await processImageAndUpload(images?.actualPricePhotoBuffer, 'actual_price_photo');
            await processImageAndUpload(images?.actualPricePhototwoBuffer, 'actual_price_photo_two');
            await processImageAndUpload(images?.actualPricePhotothreeBuffer, 'actual_price_photo_three');
            await processImageAndUpload(images?.appriciationOnePhotoBuffer, 'outstanding_price_photo');
            await processImageAndUpload(images?.appriciationOnePhotoBuffer, 'appriciation_one_photo');
            await processImageAndUpload(images?.appriciationTwoPhotoBuffer, 'appriciation_two_photo');
            await processImageAndUpload(images?.appriciationThreePhotoBuffer, 'appriciation_three_photo');
            await processImageAndUpload(images?.socialMediaFeedbackPhotoBuffer, 'social_media_feedback_photo');
        }

        return resp;
    }

    static async getAllTicketss(data: any) {
        const obj = new Tickets();
        const response = await obj.getAllTicketss(data);
        return response;
    }

    static async getTicketsById(id: string) {
        const obj = new Tickets();
        const response = await obj.getTicketsById(id);
        return response;
    }
    static async getTicketsByUser(data: any) {
        const obj = new Tickets();
        const response = await obj.getTicketsByUser(data);
        return response;
    }


    static async updateTickets(id: string, data: TTickets) {
        const obj = new Tickets();
        const response = await obj.updateTickets(id, data);
        return response;
    }

    static async deleteTicketss(ids: string[]) {
        const obj = new Tickets();
        const response = await obj.deleteTicketss(ids);
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
            appriciationTwoPhoto?: Buffer,
            appriciationThreePhoto?: Buffer
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
                    // const fileName = `images/tickets/${id}-${dateId}-${field}`;
                    const fileName = `${id}-${field}-${dateId}`; // Local file name (without path)
                    const type = 'tickets'
                    const imgRes = await img.uploadImage(image, fileName, type);
                    const imageUrl = (imgRes as string).split("?")[0];
                    await obj.updateTicketsImage(id, imageUrl, field);
                }
            };

            await processImageAndUpload(images.estimatePricePhoto, "estimate_price_photo");
            await processImageAndUpload(images.billingPricePhoto, "billing_price_photo");
            await processImageAndUpload(images.actualPricePhoto, "actual_price_photo");
            await processImageAndUpload(images.actualPricePhotoTwo, "actual_price_photo_two");
            await processImageAndUpload(images.actualPricePhotoThree, "actual_price_photo_three");
            await processImageAndUpload(images.outstandingPricePhoto, "outstanding_price_photo");
            await processImageAndUpload(images.appriciationOnePhoto, "appriciation_one_photo");
            await processImageAndUpload(images.appriciationTwoPhoto, "appriciation_two_photo");
            await processImageAndUpload(images.appriciationThreePhoto, "appriciation_three_photo");
            await processImageAndUpload(images?.socialMediaFeedbackPhoto, 'social_media_feedback_photo');

        }

        return { ...data };
    }

}

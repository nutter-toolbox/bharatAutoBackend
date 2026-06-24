import dayjs from "dayjs";
import { TDateFitlers } from "./miscTypes";
import { Misc } from "../../models/Misc";

export default class MiscService {

    static async getTicketsStatus(
        user_id: string,
    ) {
        try {
            const obj = new Misc();
            const response = await obj.getTicketsStatus(user_id);
            return response
        } catch (error) {
            console.error("Error in getTicketsSeriesByUser:", error);
            return null;
        }
    }
}

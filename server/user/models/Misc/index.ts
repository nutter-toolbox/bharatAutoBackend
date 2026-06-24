import { TDateFitlers } from "../../controllers/misc/miscTypes";
import { Ticket as Tickets } from "database/schema";

export class Misc {
    constructor() { }

    public async getTicketsStatus(user_id: string): Promise<any> {
        try {
            const pending = await Tickets.count({
                where: { user_id, status: 'pending' }
            });
            const inProgress = await Tickets.count({
                where: { user_id, status: 'In Progress' }
            });
            const hold = await Tickets.count({
                where: { user_id, status: 'hold' }
            });
            const completed = await Tickets.count({
                where: { user_id, status: 'completed' }
            });

            return {
                pending,
                inProgress,
                hold,
                completed
            };
        } catch (err) {
            console.error('Error in getTicketsStatus:', err);
            return null;
        }
    }
}

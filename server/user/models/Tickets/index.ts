import { Ticket as TicketsModel } from "database/schema";
import { TTickets } from "common/types/tickets";

export class Tickets {

    public async getTickets(id: string): Promise<TTickets | any> {
        try {
            const total = await TicketsModel.count({
                where: { user_id: id }
            });
            const data = await TicketsModel.findAll({
                where: { user_id: id }
            });
            return { total, data };
        } catch (err) {
            console.error('Error in getTickets:', err);
            return null;
        }
    }

    public async recentFive(id: string): Promise<TTickets | any> {
        try {
            const count = await TicketsModel.count({
                where: { user_id: id }
            });
            const data = await TicketsModel.findAll({
                where: { user_id: id },
                order: [['createdAt', 'DESC']],
                limit: 5
            });
            return { count, data };
        } catch (err) {
            console.error('Error in recentFive:', err);
            return null;
        }
    }

    public async getTicketById(id: string): Promise<any | null> {
        try {
            const result = await TicketsModel.findByPk(id);
            return result ?? null;
        } catch (err) {
            console.error('Error in getTicketById:', err);
            return null;
        }
    }

    public async updateTickets(id: string, data: TTickets): Promise<TTickets | any> {
        try {
            const updatedTicket = await TicketsModel.update(data, {
                where: { id },
                returning: true
            });
            return updatedTicket[1][0] ?? null;
        } catch (err) {
            console.error('Error in updateTickets:', err);
            return null;
        }
    }

    // public async updateTicketStatus(id: string, status: string): Promise<TTickets | any> {
    //     try {
    //         const updatedTicket = await TicketsModel.update({ status }, {
    //             where: { id },
    //             returning: true
    //         });
    //         return updatedTicket[1][0] ?? null;
    //     } catch (err) {
    //         console.error('Error in updateTicketStatus:', err);
    //         return null;
    //     }
    // }

    public async updateTicketStatus(id: string, updateFields: { status: string; startdate?: string; enddate?: string }): Promise<TTickets | any> {
        try {
            const updatedTicket = await TicketsModel.update(updateFields, {
                where: { id },
                returning: true
            });
            return updatedTicket[1][0] ?? null;
        } catch (err) {
            console.error('Error in updateTicketStatus:', err);
            return null;
        }
    }
    public async editTicket(id: string, data: TTickets): Promise<TTickets | any> {
        try {
            const res = await TicketsModel.update(data, {
                where: { id }
            });
            return res[0] > 0 ? { id, data } : null;
        } catch (err) {
            console.error('Error in editTicket:', err);
            return null;
        }
    }

    public async updateTicketsImage(id: string, image: string, field: string) {
        try {
            const ticket = await TicketsModel.findByPk(id);
            if (!ticket) return null;

            // Use dynamic field update
            ticket[field] = image;
            await ticket.save();

            return ticket;
        } catch (err) {
            console.error('Error in updateTicketsImage:', err);
            return null;
        }
    }
}

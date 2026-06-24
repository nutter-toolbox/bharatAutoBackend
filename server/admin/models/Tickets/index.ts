import { Ticket as TicketsModel, User } from "database/schema";
import { TTickets } from "common/types/tickets";
import { Op } from 'sequelize';

export class Tickets {
    public async addTickets(data: TTickets): Promise<TTickets | any> {
        const newTickets = await TicketsModel.create(data);
        return newTickets;
    }

    public async getAllTicketss(filters: any): Promise<TTickets | any> {
        let whereDates: any = {};
        if (filters?.dates?.start_date && filters?.dates?.end_date) {
            const { start_date, end_date } = filters?.dates;
            whereDates = {
                createdAt: {
                    [Op.gte]: new Date(start_date),
                    [Op.lte]: new Date(end_date)
                }
            }
        }
        if (filters?.status) {
            whereDates.status = filters?.status;
        }
        if (filters?.customer_id) {
            whereDates.customer_id = filters?.customer_id;
        }

        // const where = {
        //     description: {
        //         [Op.like]: `%${filters.search}%`
        //     },
        //     ...whereDates
        // };
        const where: any = {
            ...whereDates,
        };

        //  SEARCH LOGIC
        if (filters.search) {
            where[Op.or] = [
                {
                    description: {
                        [Op.like]: `%${filters.search}%`,
                    },
                },
                {
                    '$customer.contact_number$': {
                        [Op.like]: `%${filters.search}%`,
                    },
                },
                {
                    '$customer.full_name$': {
                        [Op.like]: `%${filters.search}%`,
                    },
                },
            ];
        }
        const { count, rows: data } = await TicketsModel.findAndCountAll({
            where,
            order: [['startDate', 'DESC']],
            offset: filters.offset,
            limit: filters.limit,
            include: [
                {
                    model: User,
                    as: 'customer', // Use the alias defined in the association
                }
            ]
        });

        return { total: count, data };
    }

    public async getTicketsByUser(filters: any): Promise<TTickets | any> {
        const where: any = {
            title: {
                [Op.like]: `%${filters.search}%`
            },
            user_id: filters.user_id,
        };

        if (filters.status) {
            where.status = filters.status;
        }

        const { count, rows: data } = await TicketsModel.findAndCountAll({
            where,
            order: [[filters.sorting[0], filters.sorting[1]]],
            offset: filters.offset,
            limit: filters.limit,
        });

        return { total: count, data };
    }

    public async getTicketsById(id: string): Promise<any | null> {
        const ticket = await TicketsModel.findByPk(id);
        return ticket ?? null;
    }

    public async updateTickets(id: string, data: TTickets): Promise<TTickets | any> {
        const ticket = await TicketsModel.findByPk(id);
        if (!ticket) return null;

        const updatedTicket = await ticket.update(data);
        return updatedTicket;
    }

    public async editTicket(id: string, data: TTickets): Promise<any> {
        const result = await TicketsModel.update(data, {
            where: {
                id
            }
        });
        return result;
    }

    public async deleteTicketss(ids: string[]): Promise<number> {
        const result = await TicketsModel.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return result;
    }

    public async updateTicketsImage(id: string, image: string, field: string) {
        const ticket = await TicketsModel.findByPk(id);
        if (!ticket) return null;

        await ticket.update({ [field]: image });
        return ticket;
    }
}

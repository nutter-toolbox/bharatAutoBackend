import { TDateFitlers } from "../../controllers/misc/misc.types";
import { Announcement as Announcements, User as EndUser, Lead as Leads, Ticket as Tickets, User } from "database/schema";
import { Op } from 'sequelize';

export class Misc {
    constructor() { }

    public async getUserCount(
        dates: TDateFitlers
    ): Promise<number> {
        try {
            const { start_date, end_date } = dates;
            const { count } = await EndUser.findAndCountAll({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    },
                    type: 'user'
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getAllAnnouncements(
        dates: TDateFitlers
    ): Promise<number> {
        try {
            const { count } = await Announcements.findAndCountAll({
                where: {
                    // No filtering by dates
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getPublishedAnnouncements(
        dates: TDateFitlers
    ): Promise<number> {
        try {
            const { count } = await Announcements.findAndCountAll({
                where: {
                    status: 'Published',
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getDraftAnnouncements(
        dates: TDateFitlers
    ): Promise<number> {
        try {
            const { count } = await Announcements.findAndCountAll({
                where: {
                    status: 'Draft',
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getActiveStaff(roleId: string): Promise<number> {
        try {
            const { count } = await EndUser.findAndCountAll({
                where: {
                    role: roleId,
                    status: 'ACTIVE',
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getInActiveStaff(roleId: string): Promise<number> {
        try {
            const { count } = await EndUser.findAndCountAll({
                where: {
                    role: roleId,
                    status: 'INACTIVE',
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }
    public async getTicketsSeries(dates: TDateFitlers): Promise<any> {
        try {
            const { start_date, end_date } = dates;
            const tickets = await Tickets.findAll({
                where: {
                    startdate: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    },
                },
                order: [['startdate', 'ASC']]

            });


            if (tickets.length) {

                const ticketsWithUserDetails = await Promise.all(tickets.map(async (ticket) => {

                    const user = await User.findOne({
                        // @ts-ignore
                        where: { id: ticket.user_id }
                    });
                    const customer = await User.findOne({
                        // @ts-ignore

                        where: { id: ticket.customer_id }
                    });

                    return {
                        ...ticket?.dataValues,
                        userDetails: user,
                        customerDetails: customer
                    };
                }));

                return ticketsWithUserDetails;
            }

            return tickets ?? [];
        } catch (err) {
            console.error("Error fetching tickets or user details:", err);
            return [];
        }
    }
    public async getLeadsSeries(dates: TDateFitlers): Promise<any> {
        try {
            const { start_date, end_date } = dates;
            const leads = await Leads.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    }
                }
            });
            return leads ?? [];
        } catch (err) {
            return [];
        }
    }

    public async getSubscriptionSeries(dates: TDateFitlers, roleId: string): Promise<any> {
        try {
            const { start_date, end_date } = dates;
            const subscriptions = await User.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    },
                    role: roleId,
                }
            });
            return subscriptions ?? [];
        } catch (err) {
            console.error("Error in getSubscriptionSeries:", err);
            return [];
        }
    }

    public async getCustomerSeries(dates: TDateFitlers): Promise<any> {
        try {
            const { start_date, end_date } = dates;
            const customers = await User.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    }
                }
            });
            return customers ?? [];
        } catch (err) {
            return [];
        }
    }

    public async getTicketsSeriesForUser(
        user_id: string,
        dates: TDateFitlers
    ) {
        try {
            const { start_date, end_date } = dates;
            return await Tickets.findAll({
                where: {
                    user_id,
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    }
                }
            });
        } catch (error) {
            console.error("Error in getTicketsSeriesForUser:", error);
            throw error;
        }
    }

    public async getCustomerUser(
        role: string,
        dates: TDateFitlers
    ) {
        try {
            const { start_date, end_date } = dates;
            return await User.findAll({
                where: {
                    role,
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    }
                }
            });
        } catch (error) {
            console.error("Error in getCustomerUser:", error);
            throw error;
        }
    }

    public async getActiveStaffByRole(
        dates: TDateFitlers
    ): Promise<number> {
        try {
            const { count } = await EndUser.findAndCountAll({
                where: {
                    role: 'ACTIVE',
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getInActiveStaffByRole(
        dates: TDateFitlers
    ): Promise<number> {
        try {
            const { count } = await EndUser.findAndCountAll({
                where: {
                    role: 'INACTIVE',
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getUserSeries(
        dates: TDateFitlers
    ): Promise<any> {
        try {
            const { start_date, end_date } = dates;
            const users = await EndUser.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    },
                    type: 'user'
                }
            });
            return users ?? [];
        } catch (err) {
            return [];
        }
    }

    public async getAnnouncementsCount(dates: TDateFitlers): Promise<number> {
        try {
            const { start_date, end_date } = dates;
            const { count } = await Announcements.findAndCountAll({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    },
                    type: 'announcement'
                }
            });
            return count ?? 0;
        } catch (err) {
            return 0;
        }
    }

    public async getAnnouncements(dates: TDateFitlers): Promise<any> {
        try {
            const { start_date, end_date } = dates;
            const announcements = await Announcements.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(start_date),
                        [Op.lte]: new Date(end_date)
                    },
                    type: 'announcement'
                }
            });
            return announcements ?? [];
        } catch (err) {
            return [];
        }
    }
}

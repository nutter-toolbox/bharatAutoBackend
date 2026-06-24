import dayjs from "dayjs";
import { TDateFitlers } from "./misc.types";
import { Misc } from "admin/models";

export default class MiscService {


    static async getUserCount(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getUserCount(dates);
            return response;
        } catch {
            return null;
        }
    }
    static async getAllAnnouncements(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getAllAnnouncements(dates);
            return response;
        } catch {
            return null;
        }
    }
    static async getPublishedAnnouncements(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getPublishedAnnouncements(dates);
            return response;
        } catch {
            return null;
        }
    }
    static async getDraftAnnouncements(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getDraftAnnouncements(dates);
            return response;
        } catch {
            return null;
        }
    }
    static async getActiveStaff(roleId: string) {
        try {
            const obj = new Misc();
            const response = await obj.getActiveStaff(roleId);
            return response;
        } catch {
            return null;
        }
    }

    static async getInActiveStaff(roleId: string) {
        try {
            const obj = new Misc();
            const response = await obj.getInActiveStaff(roleId);
            return response;
        } catch {
            return null;
        }
    }
    static async getTicketsSeries(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getTicketsSeries(dates);

            // Define categories and initialize data with zeros
            const categories = ['pending', 'In Progress', 'completed', 'hold'];
            const data = categories.map(() => 0);

            if (response && response.length) {
                response.forEach((item) => {
                    const statusIndex = categories.indexOf(item.status);
                    if (statusIndex > -1) {
                        data[statusIndex] += 1;
                    }
                });
            }

            // Capitalize categories
            const capitalizedCategories = categories.map((category) =>
                category.charAt(0).toUpperCase() + category.slice(1)
            );

            return { categories: capitalizedCategories, data };
        } catch (error) {
            console.error("Error in getTicketsSeries:", error);
            return null;
        }
    }
    static async getTicketsRecords(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getTicketsSeries(dates);
            return response;
        } catch (error) {
            console.error("Error in getTicketsSeries:", error);
            return null;
        }
    }
    static async getLeadsSeries(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getLeadsSeries(dates);
            // Define categories and initialize data with zeros
            const categories = ['New', 'In Progress', 'Contacted', 'Converted', 'Rejected'];
            const data = categories.map(() => 0);

            if (response && response.length) {
                response.forEach((item) => {
                    const statusIndex = categories.indexOf(item.status);
                    if (statusIndex > -1) {
                        data[statusIndex] += 1;
                    }
                });
            }

            // Capitalize categories
            const capitalizedCategories = categories.map((category) =>
                category.charAt(0).toUpperCase() + category.slice(1)
            );

            return { categories: capitalizedCategories, data };
        } catch (error) {
            console.error("Error in getLeadsSeries:", error);
            return null;
        }
    }
    static async getLeadsRecords(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getLeadsSeries(dates);
            return response;
        } catch (error) {
            console.error("Error in getLeadsSeries:", error);
            return null;
        }
    }

    static async getTicketsSeriesByUser(
        user_id: string,
        dates: TDateFitlers,
    ) {
        try {
            const obj = new Misc();


            const response = await obj.getTicketsSeriesForUser(user_id, dates);


            const categories = ['pending', 'completed', 'failed', 'hold'];
            const data = categories.map(() => 0);

            if (response && response.length) {
                response.forEach((item: any) => {
                    const statusIndex = categories.indexOf(item.status);
                    if (statusIndex > -1) {
                        data[statusIndex] += 1;
                    }
                });
            }

            // Capitalize categories
            const capitalizedCategories = categories.map((category) =>
                category.charAt(0).toUpperCase() + category.slice(1)
            );
            return { categories: capitalizedCategories, data };
        } catch (error) {
            console.error("Error in getTicketsSeriesByUser:", error);
            return null;
        }
    }
    static async getCustomerUser(
        role: string,
        dates: TDateFitlers,
    ) {
        try {
            const obj = new Misc();


            const response = await obj.getCustomerUser(role, dates);


            const categories = [];
            const data = categories.map(() => 0);

            if (response && response.length) {
                response.forEach((item: any) => {
                    const statusIndex = categories.indexOf(item.status);
                    if (statusIndex > -1) {
                        data[statusIndex] += 1;
                    }
                });
            }

            // Capitalize categories
            const capitalizedCategories = categories.map((category) =>
                category.charAt(0).toUpperCase() + category.slice(1)
            );

            return { categories: capitalizedCategories, data };
        } catch (error) {
            console.error("Error in Customers:", error);
            return null;
        }
    }
    static async getCustomerSeries(dates: TDateFitlers, roleId: string) {
        try {
            const obj = new Misc();
            const response = await obj.getSubscriptionSeries(dates, roleId);

            let series: any = {};
            if (dates && dates?.timeline?.length) {
                dates?.timeline.forEach((item) => {
                    if (typeof series[item] === "undefined") {
                        series[item] = 0;
                    }
                });
            }

            if (response && response?.length) {
                response.forEach((item) => {
                    const indexDate = dayjs(new Date(item.createdAt)).format("DD MMM YY");
                    series[indexDate] = (series[indexDate] || 0) + 1;
                });
            }

            const categories: string[] = [];
            const data: number[] = [];
            for (const [key, value] of Object.entries(series)) {
                categories.push(key);
                data.push(value as number);
            }

            return { categories, data };
        } catch (error) {
            console.error("Error in getCustomerSeries:", error);
            return null;
        }
    }

    static async getUserSeries(dates: TDateFitlers) {
        try {
            const obj = new Misc();
            const response = await obj.getUserSeries(dates);
            let series: any = {};
            if (dates && dates?.timeline?.length) {
                dates?.timeline.map((item) => {
                    if (typeof series[item] !== undefined) {
                        series[item] = 0;
                    }
                });
            }

            if (response && response?.length) {
                response.map((item) => {
                    const indexDate = dayjs(new Date(item.createdAt)).format(
                        "DD MMM YY"
                    );
                    // @ts-ignore
                    series[indexDate] += 1;
                });
            }
            let categories = [];
            let data = [];
            if (series) {
                for (const [key, value] of Object.entries(series)) {
                    categories.push(key);
                    data.push(value);
                }
            }
            return { categories, data };
        } catch {
            return null;
        }
    }




}

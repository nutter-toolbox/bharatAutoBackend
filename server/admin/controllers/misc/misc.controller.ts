import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import MiscService from "./misc.service";
import { sendResponse, getDateRange } from "admin/helpers";
import {
    RESPONSE_TYPE,
    SUCCESS_MESSAGE,
    ERROR_MESSAGE,
    METRIC_TYPES
} from "admin/constants";
import RoleService from "../roles/service";
import AuthService from "../auth/auth.service";

export default class MiscController {
    static async getDashboardMetrics(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const range = get(req?.query, "range", "");
            const rangeType = get(req?.query, "rangeType", "");
            const type = get(req?.query, "type", "");
            const dates = getDateRange(range, rangeType);
            const user_id = get(req, "user_id", 0);


            let response: any;

            if (type === METRIC_TYPES.users) {
                response = {
                    count: await MiscService.getUserCount(dates),
                };

            } else if (type === METRIC_TYPES.allannouncements) {
                response = {
                    count: await MiscService.getAllAnnouncements(dates),
                };

            } else if (type === METRIC_TYPES.publishedannouncements) {
                response = {
                    count: await MiscService.getPublishedAnnouncements(dates),
                };

            } else if (type === METRIC_TYPES.draftannouncements) {
                response = {
                    count: await MiscService.getDraftAnnouncements(dates),
                };
            }
            else if (type === METRIC_TYPES.activestaff) {
                // Fetch role "Staff"
                const roleName = "Staff";
                const role = await RoleService.getByName(roleName);

                if (!role) {
                    return res.status(404).send({
                        message: `Role with name "${roleName}" not found`,
                    });
                }

                const activeStaffCount = await MiscService.getActiveStaff(role.id);

                response = {
                    count: activeStaffCount,
                };
            }
            else if (type === METRIC_TYPES.inactivestaff) {
                // Fetch role "Staff"
                const roleName = "Staff";
                const role = await RoleService.getByName(roleName);

                if (!role) {
                    return res.status(404).send({
                        message: `Role with name "${roleName}" not found`,
                    });
                }

                const inactiveStaffCount = await MiscService.getInActiveStaff(role.id);

                response = {
                    count: inactiveStaffCount,
                };
            }
            else if (type === METRIC_TYPES.ticket_series) {
                const series = await MiscService.getTicketsSeries(dates);
                const records = await MiscService.getTicketsRecords(dates);
                response = {
                    categories: series.categories,
                    data: series.data,
                    records
                };
            }
            else if (type === METRIC_TYPES.staff_user_ticket_series) {



                const user = await AuthService.getUserById(user_id);
                if (!user) {
                    return res.status(404).send({
                        message: `User with ID "${user_id}" not found`,
                    });
                }

                const series = await MiscService.getTicketsSeriesByUser(user_id, dates);

                response = {
                    categories: series.categories,
                    data: series.data,
                };
            }
            else if (type === METRIC_TYPES.lead_series) {
                const series = await MiscService.getLeadsSeries(dates);
                const records = await MiscService.getLeadsRecords(dates);
                response = {
                    categories: series.categories,
                    data: series.data,
                    records
                };
            }
            else if (type === METRIC_TYPES.customer_series) {
                const roleName = "Customer";
                const role = await RoleService.getByName(roleName);
            
                if (!role) {
                    return res.status(404).send({
                        message: `Role with name "${roleName}" not found`,
                    });
                }
            
                const series = await MiscService.getCustomerSeries(dates, role.id);
                
                if (!series) {
                    return res.status(500).send({ message: "Error fetching customer series" });
                }
            
                response = {
                    categories: series.categories,
                    data: series.data,
                };
            }
            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.METRICS_FETCHED,
                        response
                    )
                );
        } catch (err) {
 
            return res.status(400).send({
                message: ERROR_MESSAGE.INVALID_REQUEST,
            });
        }
    }
}

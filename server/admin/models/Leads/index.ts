import { Lead as LeadsModel } from "database/schema";
import { ConvertLead, TLeads } from "common/types/leads";
import { Op } from 'sequelize';

export class Leads {
    public async addLeads(data: TLeads): Promise<TLeads | any> {
        const newLeads = await LeadsModel.create(data);
        return newLeads;
    }

    public async getAllLeadss(filters: any): Promise<{ total: number, data: any[] }> {
        const { search, offset, limit } = filters;
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
            whereDates.status = filters.status;
        }

        const { count, rows } = await LeadsModel.findAndCountAll({
            where: {
                [Op.or]: [
                    { firstName: { [Op.like]: `%${search}%` } },
                    { company: { [Op.like]: `%${search}%` } },
                    { phoneNumber: { [Op.like]: `%${search}%` } }
                ],
                ...whereDates
            },
            order: [['createdAt', 'DESC']],
            offset,
            limit,
        });

        return { total: count, data: rows };
    }

    public async getLeadsById(id: string): Promise<TLeads | any> {
        const lead = await LeadsModel.findByPk(id);
        return lead ?? null;
    }

    public async updateLeads(id: string, data: TLeads): Promise<TLeads | any> {
        const [updatedRowsCount, updatedLeads] = await LeadsModel.update(data, {
            where: { id },
            returning: true,
        });

        return updatedRowsCount > 0 ? updatedLeads[0] : null;
    }

    public async convertLead(id: string, data: ConvertLead): Promise<ConvertLead | any> {
        const [updatedRowsCount, updatedLead] = await LeadsModel.update(data, {
            where: { id },
            returning: true,
        });

        return updatedRowsCount > 0 ? updatedLead[0] : null;
    }

    public async deleteLeadss(ids: string[]): Promise<number> {
        const result = await LeadsModel.destroy({
            where: {
                id: ids,
            },
        });
        return result;
    }
}

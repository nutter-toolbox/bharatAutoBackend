import { Leads } from "admin/models";
import { ConvertLead, TLeads } from "common/types/leads";

export default class LeadsService {
    static async addLeads(data: TLeads) {
        const obj = new Leads();
        const response = await obj.addLeads(data);
        return response;
    }

    static async getAllLeadss(data:any) {
        const obj = new Leads();
        const response = await obj.getAllLeadss(data);
        return response;
    }

    static async getLeadsById(id: string) {
        const obj = new Leads();
        const response = await obj.getLeadsById(id);
        return response;
    }

    static async updateLeads(id: string, data: TLeads) {
        const obj = new Leads();
        const response = await obj.updateLeads(id, data);
        return response;
    }
    static async convertLead(id: string, data: ConvertLead) {
        const obj = new Leads();
        const response = await obj.convertLead(id, data);
        return response;
    }

    static async deleteLeadss(ids: string[]) {
        const obj = new Leads();
        const response = await obj.deleteLeadss(ids);
        return response;
    }

   
}

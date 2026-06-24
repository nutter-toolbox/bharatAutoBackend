import { Permission } from "admin/models";
import { TPermission } from "common/types/permission";

export default class PermissionService {
    static async addPermission(data: TPermission) {
        const obj = new Permission();
        const response = await obj.addPermission(data);
        return response;
    }

    static async getAllPermissions() {
        const obj = new Permission();
        const response = await obj.getAllPermissions();
        return response;
    }

    static async getPermissionById(id: string) {
        const obj = new Permission();
        const response = await obj.getPermissionById(id);
        return response;
    }

    static async updatePermission(id: string, data: TPermission) {
        const obj = new Permission();
        const response = await obj.updatePermission(id, data);
        return response;
    }

    static async deletePermissions(ids: string[]) {
        const obj = new Permission();
        const response = await obj.deletePermissions(ids);
        return response;
    }

    static async getByName(name: string) {
        const obj = new Permission();
        const response = await obj.getByName(name);
        return response;
    }
}

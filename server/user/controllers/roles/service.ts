import { Role } from "admin/models";
import { TRole } from "common/types/role";

export default class RoleService {
    static async addRole(data: TRole) {
        const role = new Role();
        const response = await role.addRole(data);
        return response;
    }

    static async getAllRoles() {
        const role = new Role();
        const response = await role.getAllRoles();
        return response;
    }

    static async getRoleById(id: string) {
        const role = new Role();
        const response = await role.getRoleById(id);
        return response;
    }

    static async updateRole(id: string, data: TRole) {
        const role = new Role();
        const response = await role.updateRole(id, data);
        return response;
    }

    static async deleteRoles(ids: string[]) {
        const role = new Role();
        const response = await role.deleteRoles(ids);
        return response;
    }

    static async getByName(name: string) {
        const role = new Role();
        const response = await role.getByName(name);
        return response;
    }
}

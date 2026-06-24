import { Role as RoleModel } from "database/schema";
import { TRole } from "common/types/role";

export class Role {
    public async addRole(data: any): Promise<TRole | any> {
        // Sequelize create
        const newRole = await RoleModel.create(data);
        return newRole;
    }

    public async getAllRoles(): Promise<any> {
        // Sequelize count and findAll
        const total = await RoleModel.count();
        const data = await RoleModel.findAll();
        return { total, data };
    }

    public async getRoleById(id: string | number): Promise<TRole | any> {

        const role = await RoleModel.findByPk(id);
        return role ?? null;
    }

    public async updateRole(id: string | number, data: TRole): Promise<TRole | any> {
        // Sequelize findByPk and update
        const updatedRowCount = await RoleModel.update(data, {
            where: { id },
            returning: true,
        });
        return updatedRowCount ? updatedRowCount : null;
    }

    public async deleteRoles(ids: (string | number)[]): Promise<number> {
        // Sequelize destroy (delete)
        const result = await RoleModel.destroy({
            where: {
                id: ids
            }
        });
        return result;
    }

    public async getByName(name: string): Promise<TRole | any> {
        // Sequelize findOne (find by a field)
        const role = await RoleModel.findOne({
            where: { name }
        });
        return role ?? null;
    }

       public async getUserRoleById(id: string): Promise<TRole | any> {
    
        const role = await RoleModel.findOne({
            where: { id }
        });
        return role ?? null;
    }


}

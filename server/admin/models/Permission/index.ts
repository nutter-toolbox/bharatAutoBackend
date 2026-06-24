import { Permission as PermissionModel } from "database/schema";
import { TPermission } from "common/types/permission";
import { Op } from 'sequelize';

export class Permission {
    public async addPermission(data: TPermission): Promise<TPermission | any> {
        const newPermission = await PermissionModel.create(data);
        return newPermission;
    }

    public async getAllPermissions(): Promise<any> {
        const { count, rows: data } = await PermissionModel.findAndCountAll();
        return { total: count, data };
    }

    public async getPermissionById(id: string): Promise<TPermission | any> {
        const permission = await PermissionModel.findByPk(id);
        return permission ?? null;
    }

    public async updatePermission(id: string, data: TPermission): Promise<TPermission | any> {
        const permission = await PermissionModel.findByPk(id);
        if (!permission) return null;

        const updatedPermission = await permission.update(data);
        return updatedPermission;
    }

    public async deletePermissions(ids: string[]): Promise<number> {
        const result = await PermissionModel.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        return result;
    }

    public async getByName(name: string): Promise<TPermission | any> {
        const permission = await PermissionModel.findOne({
            where: {
                name
            }
        });
        return permission ?? null;
    }
}

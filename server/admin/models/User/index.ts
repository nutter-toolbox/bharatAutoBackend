import { TUser, TUsersList } from "common/types/user/user.type";
import { User as EndUser, Role } from "database/schema";
import { Sequelize, Op } from "sequelize";

export class User {
    constructor() { }

    // public async getUsersExcludingRole(filters: any): Promise<TUsersList | any> {
    //     const where = {
    //         full_name: {
    //             [Op.like]: `%${filters.search}%`  // Use `iLike` for case-insensitive matching in Sequelize
    //         },
    //         role: {
    //             [Op.ne]: filters.excludedRoleId,  // Sequelize `Op.ne` for 'not equal'
    //         },
    //     };

    //     const total = await EndUser.count({ where });
    //     const data = await EndUser.findAll({
    //         where,
    //         order: [['createdAt', 'DESC']],
    //         offset: filters.offset,
    //         limit: filters.limit,
    //     });

    //     return { total, data };
    // }
    public async getUsersExcludingRole(filters: any): Promise<TUsersList | any> {

        const where: any = {
            role: {
                [Op.ne]: filters.excludedRoleId,
            },
        };

        if (filters.search) {
            where[Op.or] = [
                {
                    full_name: {
                        [Op.like]: `%${filters.search}%`,
                    },
                },
                {
                    contact_number: {
                        [Op.like]: `%${filters.search}%`,
                    },
                },
            ];
        }

        const total = await EndUser.count({ where });

        const data = await EndUser.findAll({
            where,
            order: [['createdAt', 'DESC']],
            offset: filters.offset,
            limit: filters.limit,
        });

        return { total, data };
    }



    public async getRoleUsers(filters: any): Promise<TUsersList | any> {
        const where = {
            role: filters.role,  // Adjust according to the foreign key for role
        };

        const total = await EndUser.count({ where });
        const data = await EndUser.findAll({
            where,
            offset: filters.offset,
            limit: filters.limit
        });

        return { total, data };
    }

    // public async getRoleCustomers(filters: any): Promise<TUsersList | any> {
    //      const where: any = {
    //     [Op.and]: [
    //         { role: filters.role },
    //         filters.search ? { full_name: { [Op.like]: `%${filters.search}%` } } : {},
    //     ],
    // };

    //     const total = await EndUser.count({ where });
    //     const data = await EndUser.findAll({
    //         where,
    //         order: [['createdAt', 'DESC']], 
    //         offset: filters.offset,
    //         limit: filters.limit
    //     });

    //     return { total, data };
    // }

    public async getRoleCustomers(filters: any): Promise<TUsersList | any> {

        const where: any = {
            [Op.and]: [
                { role: filters.role },

                filters.search
                    ? {
                        [Op.or]: [
                            {
                                full_name: {
                                    [Op.like]: `%${filters.search}%`,
                                },
                            },
                            {
                                contact_number: {
                                    [Op.like]: `%${filters.search}%`,
                                },
                            },
                        ],
                    }
                    : {},
            ],
        };

        const total = await EndUser.count({ where });

        const data = await EndUser.findAll({
            where,
            order: [['createdAt', 'DESC']],
            offset: filters.offset,
            limit: filters.limit,
        });

        return { total, data };
    }

    public async getTypeUsers(filters: any): Promise<TUsersList | any> {
        const where = {
            type: 'user',
        };

        const total = await EndUser.count({ where });
        const data = await EndUser.findAll({
            where,
            offset: filters.offset,
            limit: filters.limit
        });

        return { total, data };
    }

    public async addUser(data: TUser): Promise<TUser | any> {
        const res = await EndUser.create({ ...data, registration_date: new Date() });
        return res;
    }

    public async addCustomer(data: TUser): Promise<TUser | any> {
        const res = await EndUser.create({
            ...data,
            role: data.role,  // Assuming roleId is the foreign key
            registration_date: new Date(),
        });
        return res;
    }

    public async updateUser(id: number, data: TUser): Promise<TUser | any> {
        const updatedUser = await EndUser.update(data, {
            where: { id },
            returning: true,  // Use returning to get the updated row
        });
        return updatedUser ? updatedUser : null;
    }

    public async editUser(id: number, data: TUser): Promise<TUser | any> {
        const updatedUser = await EndUser.update(data, {
            where: { id },
            returning: true,
        });
        return updatedUser ? updatedUser : null;
    }

    public async editCustomer(id: number, data: TUser): Promise<TUser | any> {
        const updatedUser = await EndUser.update(
            { ...data, role: data.role }, // Assuming roleId is the foreign key
            { where: { id }, returning: true }
        );
        return updatedUser ? updatedUser : null;
    }

    public async getUserById(id: number): Promise<TUser | any> {
        const data = await EndUser.findByPk(id);  // Use findByPk for primary key
        return data ?? null;
    }

    public async getUsersById(ids: number[]): Promise<TUser[] | any> {
        const data = await EndUser.findAll({
            where: {
                id: ids,
            }
        });
        return data ?? null;
    }

    public async deleteUser(ids: number[]): Promise<number> {
        const deletedCount = await EndUser.destroy({
            where: {
                id: ids,
            }
        });
        return deletedCount;
    }

    public async deleteCustomer(ids: number[], role: string): Promise<number> {
        await EndUser.update(
            { role },  // Updating roleId for customers
            { where: { id: ids } }
        );
        return 1;
    }

    public async editProfile(id: number | string, data: TUser): Promise<boolean> {
        await EndUser.update(data, {
            where: { id },
            returning: true,
        });
        return true;
    }

    public async updateUserImage(id: number, image: string) {
        const user = await EndUser.findByPk(id);
        if (!user) return null;

        await EndUser.update(
            { profile_photo: image }, // Updating the image URL
            { where: { id } }
        );
        return user;
    }
}

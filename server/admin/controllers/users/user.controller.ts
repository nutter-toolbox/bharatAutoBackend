import { NextFunction, Request, Response } from "express";
import { get, isEmpty } from "lodash";
import { sendResponse, createPassword } from "admin/helpers";
import AuthService from "../auth/auth.service";
import UserService from "./user.service";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";
import RoleService from "../roles/service";
import { formatPretty } from "admin/helpers/dateFormatter";

export default class UserController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            let sorting = get(req?.query, "sorting", "id DESC");
            sorting = sorting.split(" ");

            // Fetch role ID for 'Customer'
            const customerRoleName = 'Customer';
            const customerRole = await RoleService.getByName(customerRoleName);

            if (!customerRole) {
                return res.status(404).send({
                    message: `Role with name "${customerRoleName}" not found`,
                });
            }

            // Fetch users excluding those with 'Customer' role
            const users = await UserService.getUsersExcludingRole({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting,
                trashOnly,
                excludedRoleId: customerRole.id,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USERS_FETCHED,
                        users
                    )
                );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getStaffRole(req: Request, res: Response, next: NextFunction) {
        try {
            const size = parseInt(get(req?.query, "size", "10"));
            const skip = parseInt(get(req?.query, "skip", "0"));
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            let sorting = get(req?.query, "sorting", "id DESC").split(" ");


            const roleName = 'Staff';
            const role = await RoleService.getByName(roleName);

            if (!role) {
                return res.status(404).send({
                    message: `Role with name "${roleName}" not found`,
                });
            }


            const users = await UserService.getRoleUsers({
                offset: skip,
                limit: size,
                search,
                sorting,
                trashOnly,
                role: role.id,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.STAFF_FETCHED,
                        users
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getUserstype(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            let sorting = get(req?.query, "sorting", "id DESC");
            sorting = sorting.split(" ");


            const type = 'user';

            const users = await UserService.getTypeUsers({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting,
                trashOnly,
                type,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USERS_FETCHED,
                        users
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async addUser(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const image: string = value?.profile_photo_data;
            delete value?.profile_photo_data;

            const existingUser = await AuthService.getUserByEmail(value.email);

            if (!isEmpty(existingUser)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.USER_EXISTS
                        )
                    );
            }

            const hashedPassword = await createPassword(value.password);

            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }

            // use imageBuffer
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }
            await UserService.addUser(
                {
                    ...value,
                    password: hashedPassword,
                },
                imageBuffer
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_CREATED
                    )
                );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    static async editUser(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const { id }: any = req.params;
            const image = value.profile_photo_data;
            delete value.profile_photo_data;

            // const hashedPassword = await createPassword(value.password);
            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }
            await UserService.editUser(
                id,
                { ...value },
                imageBuffer
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_UPDATED
                    )
                );
        } catch (err) {

            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async addCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const image: string = value?.profile_photo_data;
            delete value?.profile_photo_data;
            delete value?.id;

            const existingUser = await AuthService.getUserByEmail(value.email);

            if (!isEmpty(existingUser) && value.email) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.CUSTOMER_EXISTS
                        )
                    );
            }

            // Hash the password
            const hashedPassword = value?.password ? await createPassword(value?.password) : '';

            // Check and process the image
            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }

            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }


            const roleName = "Customer";
            const role = await RoleService.getByName(roleName);
            if (!role) {
                return res.status(404).send({
                    message: `Role with name "${roleName}" not found`,
                });
            }

            // Add user with the Staff role
            await UserService.addCustomer(
                {
                    ...value,
                    password: hashedPassword,
                    role: role.id, // Assign the role ID here
                },
                imageBuffer
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.CUSTOMERS_CREATED
                    )
                );
        } catch (err) {
            console.log(err)
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    static async editCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const { id }: any = req.params;
            const image = value.profile_photo_data;
            delete value.profile_photo_data;

            // Check and process the image
            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            const roleName = "Customer";
            const role = await RoleService.getByName(roleName);
            if (!role) {
                return res.status(404).send({
                    message: `Role with name "${roleName}" not found`,
                });
            }

            // Add 'role' to the update payload
            value.role = role.id;

            await UserService.editCustomer(id, value, imageBuffer);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.CUSTOMERS_UPDATED
                    )
                );
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    static async getCustomersRole(req: Request, res: Response, next: NextFunction) {
        try {
            const size = parseInt(get(req?.query, "size", "10"));
            const skip = parseInt(get(req?.query, "skip", "0"));
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            let sorting = get(req?.query, "sorting", "id DESC").split(" ");


            const roleName = 'Customer';
            const role = await RoleService.getByName(roleName);

            if (!role) {
                return res.status(404).send({
                    message: `Role with name "${roleName}" not found`,
                });
            }


            const users = await UserService.getRoleCustomers({
                offset: skip,
                limit: size,
                search,
                sorting,
                trashOnly,
                role: role.id,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.CUSTOMERS_FETCHED,
                        users
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async exportCustomersCSV(req: Request, res: Response, next: NextFunction) {
        try {
            const search = req.query.search || "";
            const sorting = (req.query.sorting as string || "id DESC").split(" ");
            const trashOnly = req.query.trashOnly || "";

            const roleName = 'Customer';
            const role = await RoleService.getByName(roleName);

            if (!role) {
                return res.status(404).send({ message: `Role "${roleName}" not found` });
            }

            // Get customers
            const users = await UserService.getRoleCustomers({
                search,
                sorting,
                trashOnly,
                role: role.id,
            });

            const list = users?.data || [];

            // Convert to CSV
            let csv = "Full Name,Email,Phone,Address,Created At\n";

            list.forEach((u: any) => {
                csv += `"${u.full_name || ""}",`;
                csv += `"${u.email || ""}",`;
                csv += `"${u.contact_number || ""}",`;
                csv += `"${u.address || ""}",`;
                csv += `"${formatPretty(u.createdAt)}"\n`;
            });

            // Set headers for download
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=customers.csv");

            return res.send(csv);

        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal server error" });
        }
    }
    static async deleteCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const ids = get(req?.body, "ids", "");

            // Fetch existing users by IDs
            const existingUser = await UserService.getUsersById(ids);

            if (isEmpty(existingUser)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.CUSTOMER_NOT_EXISTS
                        )
                    );
            }

            // Set role to 'Staff' before deletion
            const roleName = 'Staff';
            const role = await RoleService.getByName(roleName);

            if (!role) {
                return res.status(404).send({
                    message: `Role with name "${roleName}" not found`,
                });
            }

            await UserService.deleteCustomer(ids, role.id);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.CUSTOMERS_DELETED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const ids = get(req?.body, "ids", "");
            const existingUser = await UserService.getUsersById(ids);

            if (isEmpty(existingUser)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.USER_NOT_EXISTS
                        )
                    );
            }

            await UserService.deleteUser(ids);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_DELETED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");
            const existingUser = await UserService.getUserById(id as number);

            if (isEmpty(existingUser)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.USER_NOT_EXISTS
                        )
                    );
            }

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_FETCHED,
                        existingUser
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}

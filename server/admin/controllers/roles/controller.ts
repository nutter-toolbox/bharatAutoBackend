import { Request, Response, NextFunction } from "express";
import RoleService from "./service";
import { sendResponse } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class RoleController {
    static async addRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, role_permissions, active } = req.body;

            // Check if the role already exists
            const existingRole = await RoleService.getByName(name);
            if (existingRole) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.ROLE_EXISTS)
                );
            }

            // Add the new role
            const newRole = await RoleService.addRole({
                name,
                description,
                role_permissions: JSON.stringify(role_permissions),
                active,
            });

            return res.status(201).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ROLE_ADDED, newRole)
            );
        } catch (err) {
            next(err);
        }
    }

    static async getRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await RoleService.getAllRoles();
            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ROLES_FETCHED, roles)
            );
        } catch (err) {
            next(err);
        }
    }

    static async getRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const role = await RoleService.getRoleById(id);

            if (!role) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.ROLE_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ROLE_FETCHED, role)
            );
        } catch (err) {
            next(err);
        }
    }

    static async editRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, role_permissions, active } = req.body;

            // Check if the role exists
            const existingRole = await RoleService.getRoleById(id);
            if (!existingRole) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.ROLE_NOT_FOUND)
                );
            }

   

            // Update the role
            const updatedRole = await RoleService.updateRole(id, {
                name,
                description,
                role_permissions: JSON.stringify(role_permissions),
                active,
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ROLE_UPDATED, updatedRole)
            );
        } catch (err) {
            next(err);
        }
    }

    static async deleteRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body;

            if (!ids || !ids.length) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.INVALID_IDS)
                );
            }

            // Delete the roles
            await RoleService.deleteRoles(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.ROLE_DELETED)
            );
        } catch (err) {
            next(err);
        }
    }
}

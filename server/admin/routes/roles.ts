import * as express from "express";
import RoleController from "admin/controllers/roles/controller";
import { validateRoleBody } from "admin/controllers/roles/validation";

const router = express.Router();

const { addRole, getRoles, getRole, editRole, deleteRole } = RoleController;

router.post("/add", validateRoleBody, addRole);
router.get("/list", getRoles);
router.get("/get/:id", getRole);
router.post("/edit/:id", validateRoleBody, editRole);
router.delete("/delete", deleteRole);

export default router;

import * as express from "express";
import UserController from "admin/controllers/users/user.controller";
import {
    validateListUserQuery,
    validateUserBody,
} from "admin/controllers/users/user.validation";

const router = express.Router();

const {
    addUser,
    getUsers,
    getUser,
    getStaffRole,
    getCustomersRole,
    editUser,
    deleteUser,
    getUserstype,
    deleteCustomer,
    addCustomer,
    editCustomer,
    exportCustomersCSV
} = UserController;

router.get("/list", validateListUserQuery, getUsers);
router.get("/list-user", getStaffRole);
router.get("/list-customers", getCustomersRole);
router.get("/list-type-user", getUserstype);
router.get("/get/:id", getUser);
router.post("/add", validateUserBody, addUser);
router.post("/customer/add", addCustomer);
router.put("/edit/:id", validateUserBody, editUser);
router.put("/customer/edit/:id", editCustomer);
router.delete("/delete", deleteUser);
router.delete("/customer/delete", deleteCustomer);
router.get("/customers/export", exportCustomersCSV);

export default router;

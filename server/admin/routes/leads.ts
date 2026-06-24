import * as express from "express";
import LeadsController from "admin/controllers/leads/leads.controller";
import { validateLeadsBody } from "admin/controllers/leads/leads.validation";

const router = express.Router();

const {
    addLeads,
    getLeadss,
    getLeads,
    editLeads,
    convertLead,
    deleteLeads,
} = LeadsController;

router.post("/add", validateLeadsBody, addLeads);
router.get("/list", getLeadss);
router.get("/get/:id", getLeads);
router.post("/edit/:id", validateLeadsBody, editLeads);
router.patch("/convert/:id", convertLead);
router.delete("/delete", deleteLeads);

export default router;

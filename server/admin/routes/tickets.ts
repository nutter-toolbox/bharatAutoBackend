import * as express from "express";
import TicketsController from "admin/controllers/tickets/tickets.controller";
import { validateTicketsBody } from "admin/controllers/tickets/tickets.validation";

const router = express.Router();

const {
    addTickets,
    getTicketss,
    getTickets,
    editTickets,
    deleteTickets,
    getTicketsByUser
} = TicketsController;

router.post("/add", validateTicketsBody, addTickets);
router.get("/list", getTicketss);
router.get("/user-list", getTicketsByUser);
router.get("/get/:id", getTickets);
router.post("/edit/:id", validateTicketsBody, editTickets);
router.delete("/delete", deleteTickets);

export default router;

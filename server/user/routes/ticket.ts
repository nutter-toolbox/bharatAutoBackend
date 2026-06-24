import * as express from "express";
// import { validateTicketsBody } from "admin/controllers/tickets/tickets.validation";
import TicketController from "../controllers/tickets/ticketController";
import MiscController from "user/controllers/misc/miscController";
import { validateTicketsBody } from "user/controllers/tickets/ticketsValidation";
import { auth } from "user/middlewares";

const router = express.Router();

const {
    getTicket,
    getTickets,
    recentFive,
    editTickets,
    updateTicketStatus,
} = TicketController;
const { getStatus } = MiscController

router.get("/list-tickets", auth, getTickets);
router.get("/get/:id", getTicket);
router.get("/list-tickets/recent", auth, recentFive);
router.get("/status/count", auth, getStatus);
router.post("/update/:id", validateTicketsBody, editTickets); 
router.post("/update-status/:id",  updateTicketStatus); 
export default router;

import express from "express";
import { addComment, createTicket, getTickets, removeTicket, getTicketById, getTicketId, updateTicketStatus, createSuggestion, createReport } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", createTicket);
router.post("/suggestions/create", protectRoute, createSuggestion);
router.post("/reports/create", protectRoute, createReport);
router.post ("/tickets/:ticketId/comments", addComment);
router.get("/user", getTickets);
router.post("/create", protectRoute, createTicket);
router.get("/tickets/:id", getTicketId);
router.get("/assigned", getTicketById);



//updating routes

router.patch("/:ticketId/status", updateTicketStatus);


//deletion routes

router.delete("/remove-ticket/:ticketId", removeTicket);


export default router;
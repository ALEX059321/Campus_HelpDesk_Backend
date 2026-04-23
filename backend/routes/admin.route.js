import express from 'express';
import { getAllTickets, getAllUsers, updateTicketPriority, updateTicketStatus, deleteTicket, deleteUser, deleteReport, getAllSuggestions, getAllReports } from '../controllers/admin.controller.js';
const router = express.Router();

router.get("/all-tickets", getAllTickets);
router.get("/all-users", getAllUsers);
router.get("/all-suggestions", getAllSuggestions);
router.get("/all-reports", getAllReports);

router.patch("/:ticketId/priority", updateTicketPriority);
router.patch("/:ticketId/status", updateTicketStatus);

router.delete("/delete/:ticketId", deleteTicket);
router.delete("/delete-user/:userId", deleteUser);
router.delete("/delete-report/:reportId", deleteReport);


export default router;
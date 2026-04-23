import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import Suggestion from "../models/suggestion.model.js";
import Report from "../models/report.model.js";




export const getAllTickets = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden: Admins only." });
        }
        const tickets = await Ticket.find().populate("assignedTo", "name email").populate("createdBy", "name email");
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ success: false, message: "No tickets found.", })
        }
        res.status(200).json({ success: true, tickets, message: "All tickets fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error while fetching tickets.", error: error.message, })
    }

};




export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" });

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found.",
            });
        }

        return res.status(200).json({
            success: true,
            users,
            message: "All users fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching users",
            error: error.message,
        });
    }
};

export const updateTicketPriority = async (req, res) => {
    try {
        const { ticketId } = req.params;
        let { priority } = req.body;

        if (!ticketId || !priority) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID and priority are required.",
            });
        }

        priority = String(priority).trim();
        if (!priority) {
            return res.status(400).json({
                success: false,
                message: "Priority is required.",
            });
        }

        priority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        const allowedPriorities = ["Low", "Medium", "High", "Critical"];

        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: `Invalid priority value. Allowed values are: ${allowedPriorities.join(", ")}`,
            });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found.",
            });
        }

        ticket.priority = priority;
        await ticket.save();

        const updatedTicket = await Ticket.findById(ticketId)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        return res.status(200).json({
            success: true,
            message: "Ticket priority updated successfully.",
            ticket: updatedTicket,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating ticket priority.",
            error: error.message,
        });
    }
};

export const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        let { status } = req.body;

        if (!ticketId || !status) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID and status are required.",
            });
        }

        status = String(status).trim().toLowerCase();
        const allowedStatuses = ["new", "in progress", "resolved", "assigned", "not_resolved"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status value. Allowed values are: ${allowedStatuses.join(", ")}`,
            });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status: status },
            { new: true }
        ).populate("createdBy", "name email");

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket status updated successfully.",
            ticket: ticket,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating ticket status.",
            error: error.message,
        });
    }
};

export const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        if (!ticketId) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID is required.",
            });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found.",
            });
        }

        await Ticket.findByIdAndDelete(ticketId);
        return res.status(200).json({
            success: true,
            message: "Ticket deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting ticket.",
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting user.",
            error: error.message,
        });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        if (!reportId) {
            return res.status(400).json({
                success: false,
                message: "Report ID is required.",
            });
        }

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }

        await Report.findByIdAndDelete(reportId);
        return res.status(200).json({
            success: true,
            message: "Report deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting report.",
            error: error.message,
        });
    }
};

export const getAllSuggestions = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden: Admins only." });
        }

        const suggestions = await Suggestion.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            suggestions,
            message: "All suggestions fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching suggestions",
            error: error.message,
        });
    }
};

export const getAllReports = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden: Admins only." });
        }

        const reports = await Report.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reports,
            message: "All reports fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching reports",
            error: error.message,
        });
    }
};
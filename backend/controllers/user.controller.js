import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import Suggestion from "../models/suggestion.model.js";
import Report from "../models/report.model.js";
import mongoose from "mongoose";


// creating a new ticket
export const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({ message: "Please fill all the fields to create a ticket" });
        }

      
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated. Please log in again." });
        }

        const ticketPriority = priority || "low";

        const newTicket = new Ticket({
            title,
            description,
            category,
            priority: ticketPriority,
            createdBy: req.user._id,
         
            user: req.user._id, 
        });

        await newTicket.save();

        return res.status(201).json({ 
            success: true, 
            message: "Ticket created successfully", 
            ticket: newTicket 
        });

    } catch (error) {
        console.error("Error in createTicket:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// my tickets 

export const getTickets = async (req,res) => { 
    try {
        const userId = req.user._id;


        const tickets = await Ticket.find({ createdBy: userId})
      
        res.status(200).json({ success: true, tickets,});
    } catch (error) { console.error("error while fetching tickets:", error);
        res.status(500).json({ success: false, message: "internal server error"});
        
    }
}

export const getTicketById = async (req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found"});

        } 
        if(user.role !== "admin"){
            return res.status(403).json({ message: "forbidden access"});}
            
        // const tickets = await Ticket.find({ assignedTo: userId,});
        const assignedTicktetIds = await Ticket.find({ _id: { $in: user.assignedtickets},
        
        }).populate("createdBy", "name email");
        if (!assignedTicktetIds || assignedTicktetIds.length === 0){
            return res .status(404).json({ message: "No assigned tickets found"});
        }
        res.status(200).json({ success: true, tickets: assignedTicktetIds,});
    } catch (error) { console.error("error while fetching tickets:", error);
        res.status(500).json({ success: false, message: "internal server error"}); 
        
    }
}
 

export const updateTicketStatus = async (req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const { ticketId } = req.params;
        const { status } = req.body;
        if(user.role !== "admin"){
            return res.status(403).json({ message: "only admins can update ticket status"});
        }
        const allowedStatuses = [
            "new",
            "in-progress",
            "resolved",
            "assigned",
            "not_resolved",
        ];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Inavlid status value"});
        }



        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            return res.status(404).json({ message: "ticket not found" });
        }


       ticket.status = status;
       await ticket.save();
       res.status(200).json({ success: true, message: "ticket status updated successfully", ticket});

    } catch (error) {
        console.error("error while updating ticket status:", error);
        res.status(500).json({ success: false, message: "internal server error"});
    }
};


export const addComment = async (req,res) => {
    try {
        const userId = req.user._id;
        const { ticketId } = req.params;
        const { text } = req.body;
        const name = req.user.name;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "ticket not found"});
        }


        ticket.comments.push({
            text,
            CommentedBy: name,
            commenetedAt: new Date(),
        });
        await ticket.save();
         res.status(200).json({ success: true, message: "comment added successfully", comment: {text, CommentedBy: name, commenetedAt: new Date()},
         });


    } catch (error) {
        console.error("Error while adding comment:", error);
        res.status(500).json({ success: false, message: "internal server error"});
    }
};


export const getTicketId = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await Ticket.findById(ticketId).populate("caretedBy", "name email");
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found"});       }
    

     res.status(200).json({ success: true, ticket,});
        }
    catch (error) { console.error ({ message: "Error while fetching ticket by ID:", error});
    res.status(500).json({ message: "internal server error"});
        
    }
}

export const removeTicket = async (req, res) => { 
    try {
        const { ticketId } = req.params;
        const userId = req.user._id;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "ticket not found"});

        } 

        await User.findOneAndUpdate(
            { _id: userId,},
            { $pull: { assignedtickets: ticketId}}        
        
        
        );
      
        res.status(200).json({
            success: true,
            message: "ticket removed successfully",
        });
    } catch (error) { console.error("Error while removing ticket:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
} 

export const createSuggestion = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Please provide a title and description for the suggestion." });
        }

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const newSuggestion = new Suggestion({
            title,
            description,
            category: category || "general",
            createdBy: req.user._id,
        });

        await newSuggestion.save();

        return res.status(201).json({
            success: true,
            message: "Suggestion created successfully",
            suggestion: newSuggestion
        });

    } catch (error) {
        console.error("Error in createSuggestion:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const createReport = async (req, res) => {
    try {
        const { name, age, email, gender, incidentType, details } = req.body;

        if (!name || !age || !email || !gender || !incidentType || !details) {
            return res.status(400).json({ message: "Please provide all required fields for the incident report." });
        }

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }

        const newReport = new Report({
            name,
            age,
            email,
            gender,
            incidentType,
            details,
            createdBy: req.user._id,
        });

        await newReport.save();

        return res.status(201).json({
            success: true,
            message: "Report submitted successfully",
            report: newReport
        });

    } catch (error) {
        console.error("Error in createReport:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
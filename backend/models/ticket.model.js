import mongoose from "mongoose";
import User from "./user.model.js";


const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    CommentedBy: {
        type: String,
        required: true,
    },
    commentedAt: { 
        type: Date,
        default: Date.now,
    }
}

);

const ticketSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,

    },
    category: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["new", "in progress", "resolved", "assigned", "not_resolved"],
        default: "new",
    },
    priority: {
        type: String,
        required: true,
        default: "low",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    createdBy: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    comments: [commentSchema],
    },

    { timestamps: true }
)
const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "general" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   
}, { timestamps: true });

const Suggestion = mongoose.model("Suggestion", suggestionSchema);
export default Suggestion;

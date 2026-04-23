import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    incidentType: { type: String, required: true, enum: ['Abuse', 'Harassment', 'Insult', 'Physical Violence', 'Cyberbullying', 'Other'] },
    details: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'investigating', 'resolved'] }
}, { timestamps: true });

const Report = mongoose.model("Report", reportSchema);
export default Report;

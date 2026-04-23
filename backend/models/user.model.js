import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
},
assignedtickets:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
    }
],
resetPasswordOtp: {
    type: String,
    required: false,
},
resetPasswordExpires: {
    type: Date,
    required: false,
},},
{ Timestamp: true }
);
const User = mongoose.model("User", userSchema);
export default User;
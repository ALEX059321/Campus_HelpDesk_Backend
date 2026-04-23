import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";

import { generateToken } from "../../utils/generatetoken.js";

export const usersignup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

       
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields to register." });
        }

        const nameRegex = /^[a-zA-Z\s'-]{3,20}$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: "Name should be 3-20 characters (letters, spaces, hyphens only)." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Enter a valid email address." });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 6 characters with at least one letter and one number." 
            });
        }

      
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered. Please login instead." });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || "user", 
        });

        await newUser.save();

      
        generateToken(newUser._id, newUser.role, res);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error("ERROR DURING SIGNUP:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields." });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

      
        const token = generateToken(user._id, user.role, res);

        return res.status(200).json({ 
            success: true,
            message: "Login successful",
            token, 
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        if (!res.headersSent) return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const userlogout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("ERROR DURING LOGOUT:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

import { envVars } from "../config/envVar.js";

// Nodemailer for the email 
const sendEmail = async (email, otp) => {
    if (!envVars.SMTP_EMAIL || !envVars.SMTP_PASSWORD) {
        throw new Error("SMTP credentials are not configured. Please add SMTP_EMAIL and SMTP_PASSWORD to your .env file.");
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: envVars.SMTP_EMAIL,
            pass: envVars.SMTP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Campus Helpdesk" <noreply@campushelpdesk.com>',
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
        html: `<b>Your OTP for password reset is: ${otp}</b><br>It will expire in 10 minutes.`,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await sendEmail(user.email, otp);

        res.status(200).json({ 
            success: true, 
            message: "OTP sent to email. Please check your inbox.",
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending email", error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        const user = await User.findOne({ 
            email: email.toLowerCase(),
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ 
            email: email.toLowerCase(),
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "Password must be at least 6 characters with at least one letter and one number." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password" });
    }
};
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import { generateToken } from "../../utils/generatetoken.js";

export const adminsignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        
        const token = generateToken(newAdmin._id, newAdmin.role, res);

        return res.status(201).json({ 
            message: "Admin created successfully",
            token 
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const adminLogin = async (req, res) => { 
    try {
        const { email, password } = req.body;               

        if (!email || !password) {
            return res.status(400).json({ message: "fill all the fields to login" });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid credentials" });
        }

      
        const token = generateToken( admin._id, admin.role, res);
        
        return res.status(200).json({ 
            message: "login successful",token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
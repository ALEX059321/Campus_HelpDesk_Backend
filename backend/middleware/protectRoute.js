import jwt from "jsonwebtoken";
import { envVars } from "../config/envVar.js";
import User from "../models/user.model.js"; 
import Admin from "../models/admin.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, envVars.JWT_SECRET);
        
         let user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            user = await Admin.findById(decoded.userId).select("-password");
        }
        
        if (!user) {
            return res.status(404).json({ message: "User or Admin not found" });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
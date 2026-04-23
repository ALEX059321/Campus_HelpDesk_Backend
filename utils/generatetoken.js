import jwt from "jsonwebtoken";
import { envVars } from "../backend/config/envVar.js";

export const generateToken = (userId, role, res) => {
    const token = jwt.sign(
        { role, userId },
        envVars.JWT_SECRET, 
        { expiresIn: '7d' }
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        secure: envVars.NODE_ENV === "production",
        sameSite: "strict",
    });

    return token; 
};
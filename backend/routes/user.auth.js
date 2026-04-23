import express from 'express';
import { usersignup , userlogin , userlogout, forgotPassword, verifyOtp, resetPassword } from '../controllers/signup.js';
const router = express.Router();

router.post("/register", usersignup);
router.post("/logout", userlogout);
router.post("/login", userlogin);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
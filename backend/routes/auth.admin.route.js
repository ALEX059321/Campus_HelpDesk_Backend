import express from 'express';
import { adminLogin, adminsignup } from '../controllers/auth.admin.controller.js';
import Admin from '../models/admin.model.js';
import { generateToken } from '../../utils/generatetoken.js';
const router = express.Router();

router.post("/register", adminsignup);

router.post("/login", adminLogin);

export default router;
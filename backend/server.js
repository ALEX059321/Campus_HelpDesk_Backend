import express from "express";
import { envVars } from "./config/envVar.js";
import router from "./routes/user.auth.js";
import connectDB from "./config/db.js";
import AdminRouter from "./routes/auth.admin.route.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.route.js";
import { protectRoute } from "./middleware/protectRoute.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import Ticket from "./models/ticket.model.js";
import User from "./models/user.model.js";

const PORT = envVars.PORT || 3000;
const app = express();

// CORS Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use("/api/v1/dashboard", protectRoute, userRoutes);
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());


app.use("/api/v1/auth", router);
app.use("/api/v1/auth/admin", AdminRouter);


app.use("/api/v1/dashboard", userRoutes);
app.use("/api/v1/admin/dashboard", protectRoute, adminRoutes);


app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/api/v1/public/statistics", async (req, res) => {
    try {
        const tickets = await Ticket.find();
        const users = await User.find({ role: "user" });
        res.status(200).json({ success: true, tickets, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


app.post("/register", (req, res) => {
    // console.log("Register Body:", req.body);
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err.message }));
});


app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
    connectDB();
});
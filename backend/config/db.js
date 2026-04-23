import mongoose from "mongoose"; 
import { envVars } from "./envVar.js";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }
    try {
        const db = await mongoose.connect(envVars.MONGO_URI, {
           
        });
        isConnected = db.connections[0].readyState === 1;
        console.log( "Database connected" );
    } catch (error) { 
        console.error(`Error: ${error.message}` );
        // Don't exit process on Vercel, simply throw error
        throw error;
    }
}

export default connectDB;
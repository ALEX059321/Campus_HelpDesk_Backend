import mongoose from "mongoose"; 
import { envVars } from "./envVar.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(envVars.MONGO_URI, {
           
        });
        console.log( "Database connected" );
    } catch (error) { 
        console.error(`Error: ${error.message}` );
     process.exit(1);
        
    }
}

export default connectDB;
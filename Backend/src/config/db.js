import mongoose from "mongoose";
import { MONGODB_URL } from "./env.js";

const connectToDb = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("DATABASE CONNECTED SUCCESSFULLY!")
    } catch (error) {
        console.error("DB connection failed:", error);
    process.exit(1);
    }
}

export default connectToDb;
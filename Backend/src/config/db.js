import mongoose from "mongoose";
import { MONGODB_URL } from "./env.js";

const connectToDb = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("DATABASE CONNECTED SUCCESSFULLY!")
    } catch (error) {
        console.log(error)
    }
}

export default connectToDb;
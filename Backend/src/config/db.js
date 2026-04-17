import mongoose from "mongoose";
import { MOGODB_URL } from "./env.js";

const connectToDb = async () => {
    try {
        await mongoose.connect(MOGODB_URL);
        console.log("DATABASE CONNECTED SUCCESSFULLY!")
    } catch (error) {
        console.log(error)
    }
}

export default connectToDb;
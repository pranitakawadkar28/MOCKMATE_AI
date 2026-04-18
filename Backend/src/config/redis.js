import { createClient } from "redis";
import { REDIS_URL } from "./env.js";

const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("REDIS CONNECTED"));
redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error("Redis connection failed:", error);
    }
};

export default redisClient;
import mongoose from "mongoose";
import { env } from "./env.js";


export function connectDatabase() {
    return mongoose.connect(env.mongoUri);
}
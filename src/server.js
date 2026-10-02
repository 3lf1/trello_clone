import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function start() {
    try {
        await connectDatabase();
        console.log("Database connected");

        app.listen(env.port, () => {
            console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
        });
    }catch(err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();
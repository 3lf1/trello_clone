import express from "express";
import AppError from "./errors/AppError.js";
import ErrorCodes from "./errors/errorCodes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});


export default app;
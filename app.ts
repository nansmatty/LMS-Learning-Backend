import express, { NextFunction, Request, Response } from "express";
require("dotenv").config();
export const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { ErrorMiddleware } from "./middlewares/errorMiddleware";

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

//morgan
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "API is working",
	});
});

//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

app.use(ErrorMiddleware);

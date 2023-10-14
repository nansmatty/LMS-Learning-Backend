class ErrorHandler extends Error {
	statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export default ErrorHandler;

// Chat GPT Part

// import { NextFunction, Request, Response } from "express";

// export class CustomError extends Error {
// 	statusCode: number;
// 	constructor(message: string, statusCode: number) {
// 		super();
// 		this.message = message;
// 		this.statusCode = statusCode || 500;
// 	}
// }

// export class ErrorHandler {
// 	static handle(err: any, req: Request, res: Response, next: NextFunction) {
// 		if (err instanceof CustomError) {
// 			return res.status(err.statusCode).json({ error: err.message });
// 		}
// 		console.error(err); // Log the error for debugging purposes
// 		res.status(500).json({ error: "Internal Server Error" });
// 	}
// }

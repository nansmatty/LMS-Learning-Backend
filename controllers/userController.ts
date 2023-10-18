import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import User from "../models/UserModel";
import CatchAsyncError from "../middlewares/catchAsyncError";
import ErrorHandler from "../config/errorHandler";
import path from "path";

// Register User
interface IRegistrationBody {
	name: string;
	email: string;
	password: string;
	avatar?: string;
}

export const registration = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { name, email, password } = req.body;

			const isEmailExist = await User.findOne({ email });

			if (isEmailExist) {
				return next(new ErrorHandler("Email already exists", 400));
			}

			const user: IRegistrationBody = {
				name,
				email,
				password,
			};

			const activationToken = createActivationToken(user);

			const activationCode = activationToken.activationCode;

			const data = { user: { name: user.name }, activationCode };

			const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

interface IActivationToken {
	token: string;
	activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
	const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

	const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, {
		expiresIn: "5m",
	});

	return { token, activationCode };
};
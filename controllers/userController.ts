import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import User, { IUser } from "../models/UserModel";
import CatchAsyncError from "../middlewares/catchAsyncError";
import ErrorHandler from "../config/errorHandler";
import path from "path";
import sendMail from "../utils/sendMail";

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

			try {
				await sendMail({
					email: user.email,
					subject: "Activate your account",
					template: "activation-mail.ejs",
					data,
				});

				res.status(201).json({
					success: true,
					message: `Please check your email: ${user.email} to activate your account!`,
					activationToken: activationToken.token,
				});
			} catch (error: any) {
				return next(new ErrorHandler(error.message, 400));
			}
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

interface IActivationRequest {
	activation_token: string;
	activation_code: string;
}

export const activateUser = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { activation_code, activation_token } = req.body as IActivationRequest;

			const newUser: { user: IUser; activationCode: string } = jwt.verify(
				activation_token,
				process.env.ACTIVATION_SECRET as string
			) as { user: IUser; activationCode: string };

			if (newUser.activationCode !== activation_code) {
				return next(new ErrorHandler("Invaild activation code!", 400));
			}

			const { name, email, password } = newUser.user;

			const existUser = await User.findOne({ email });

			const user = await User.create({
				name,
				email,
				password,
			});

			res.status(201).json({
				success: true,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

//Login User
interface ILoginRequest {
	email: string;
	password: string;
}

export const loginUser = CatchAsyncError(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body as ILoginRequest;

			if (!email || !password) {
				return next(new ErrorHandler("Please enter email and password", 400));
			}

			const user = await User.findOne({ email }).select("password");

			if (!user) {
				return next(new ErrorHandler("Invalid User", 400));
			}

			const isPasswordMatch = await user.comparePassword(password);

			if (!isPasswordMatch) {
				return next(new ErrorHandler("Invalid Credentials", 400));
			}
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

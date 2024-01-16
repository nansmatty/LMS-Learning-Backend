require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/UserModel";
import { redis } from "../config/redis";

interface ITokenOptions {
	expires: Date;
	maxAge: number;
	httpOnly: boolean;
	sameSite: "lax" | "strict" | "none" | undefined;
	secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
	const accessToken = user.signAccessToken();
	const refreshToken = user.signRefreshToken();

	//TODO: upload the session to redis

	redis.set(user._id, JSON.stringify(user) as any);

	//TODO: Parse env variables to integrate with fallback values

	const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRY || "300", 10);
	const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRY || "1200", 10);

	console.log({ accessTokenExpire, refreshTokenExpire });

	const accessTokenOptions: ITokenOptions = {
		expires: new Date(Date.now() + accessTokenExpire * 1000),
		maxAge: accessTokenExpire * 1000,
		httpOnly: true,
		sameSite: "lax",
	};

	const refreshTokenOptions: ITokenOptions = {
		expires: new Date(Date.now() + refreshTokenExpire * 1000),
		maxAge: refreshTokenExpire * 1000,
		httpOnly: true,
		sameSite: "lax",
	};

	if (process.env.NODE_ENV === "production") {
		accessTokenOptions.secure = true;
	}

	res
		.status(statusCode)
		.cookie("access_token", accessToken, accessTokenOptions)
		.cookie("refresh_token", refreshToken, refreshTokenOptions)
		.json({
			success: true,
			user,
			accessToken,
		});
};

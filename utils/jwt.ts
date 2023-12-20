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

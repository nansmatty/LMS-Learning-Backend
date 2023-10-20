import express from "express";
import { registration } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", registration);

export default userRouter;

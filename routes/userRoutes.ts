import express from "express";
import { activateUser, registration } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", registration);
userRouter.post("/activate-user", activateUser);

export default userRouter;

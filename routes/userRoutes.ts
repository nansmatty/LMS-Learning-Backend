import express from "express";
import { activateUser, loginUser, registration } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", registration);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);

export default userRouter;

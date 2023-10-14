import { app } from "./app";
require("dotenv").config();
import connectDB from "./config/db";

connectDB();

//create server
app.listen(process.env.PORT, () =>
	console.log(`Server is connected with port ${process.env.PORT}`)
);

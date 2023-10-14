import mongoose from "mongoose";

const dbUrl: string = process.env.MONGO_URI || "";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(dbUrl);
		console.log(`MongoDB Connected ${conn.connection.host}`);
	} catch (err: any) {
		console.error(`Error: ${err.message}`);
		process.exit(1);
	}
};

export default connectDB;

import mongoose from "mongoose";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected SuccesFully");
        });
        await mongoose.connect(`${process.env.MONGO_URI}/AiSaaS`);
    }
    catch (error) {
        console.log("DB Connection Error:", error);
        process.exit(1);
    }
};
export default connectDB;

import mongoose from "mongoose";

const baseUrl = process.env.MONGODB || "0.0.0.0:27017";

export const connectToDataBase = async () => {
  try {
    mongoose.connect(`mongodb://${baseUrl}/ChaterApp`);
    console.log("MongoDB connected using mongoose");
  } catch (error) {
    console.log();
  }
};

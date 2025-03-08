import mongoose, { mongo } from "mongoose";

export default async function connectToDB () {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongodbUri = process.env.MONGODB_URI!;
  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not set");
  }
  try {
    await mongoose.connect(mongodbUri, { dbName: "truthtag" });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

"use server";

import dbConnect from "@/lib/db";
import { Report } from "@/models/report";
import { auth } from "@clerk/nextjs/server";

export const getAllUserReport = async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await dbConnect();
        
        const reports = await Report.find({ userId }).lean();

        return { success: true, data: reports };
    } catch (error) {
        console.error("Error fetching reports:", error);
        return { success: false, message: "An error occurred while fetching reports." };
    }
};



export async function getProductById(id:string | string[] | undefined) {
  try {
     await dbConnect();
    const product = await Report.findById(id as any).lean();
    
    if (!product) {
      return { error: "Product not found", data: null };
    }
    
    return { data: product };
  } catch (error) {
    console.error("Database error:", error);
    return { error: "Failed to fetch product data", data: null };
  }
}
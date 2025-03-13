'use server'

import dbConnect from "@/lib/db"
import { Report } from "@/models/report";
import { auth } from "@clerk/nextjs/server"

export const getAllUserReport = async() => {
    try {
        const {userId}  = await auth();
        if(!userId) {
            return {message:"Unauthorized"}
        }
        await dbConnect()
        const report = await Report.find({userId});


        return report;
    } catch (error) {
        console.log(error)
    }
}
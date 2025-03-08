'use server'

import dbConnect from "@/lib/db"
import { HealthReport } from "."

export const addReport = async(report:HealthReport) => {
    try {
        const db = await dbConnect()
        
    } catch (error) {
        
    }
}
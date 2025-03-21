"use server";

import connectToDB from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Report } from "@/models/report";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface HealthReport {
  productName?: string;
  netWeight?: string;
  scanDate?: string;
  country?: string;
  extractedText?: string;
  healthScore?: number;
  healthRisks?: string[];
  consumptionFrequency?: string;
  alternatives?: string[];
  ageSuitability?: string;
  warningLabels?: string[];
  error?: string;
}

export async function analyzeImage(formData: FormData): Promise<HealthReport> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "User not authenticated" };
    const productName =
      (formData.get("productName") as string) || "Unnamed Product";
    const netWeight = (formData.get("netWeight") as string) || "Not specified";
    const country = (formData.get("country") as string) || "India";
    const file = formData.get("file") as Blob | null;

    if (!file) return { error: "No file provided" };

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");
    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
      {
        text: `Analyze this product image from ${country} considering its food standards.
        
        Product Details:
        - Name: ${productName}
        - Net Weight: ${netWeight}
        
        Extract all readable text and generate a structured health analysis JSON:
        {  
        "productName":"Name of the product",
        "netWeight":"Net weight of the product",
        "country":"Country entered by user",
          "extractedText": "All text on packaging",
          "healthScore": Number (0-100, higher is healthier),
          "healthRisks": ["Risk 1", "Risk 2"],
          "consumptionFrequency": "Daily/Weekly/Occasionally/Rarely/Avoid",
          "alternatives": ["Better alternative 1", "Better alternative 2"],
          "ageSuitability": "Recommended age group",
          "warningLabels": ["Warning 1", "Warning 2"]
        }
        
        Return ONLY raw JSON, no markdown or explanations.`,
      },
    ]);

    const textResponse = await result.response.text();

    const jsonMatch = textResponse.match(/```(?:json)?([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : textResponse;
    const parsedReport = JSON.parse(jsonString);

    await connectToDB();

    const newReport = new Report({
      userId,
      productName,
      netWeight,
      country,
      ...parsedReport,
    });
    await newReport.save();
    return parsedReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to analyze image" };
  }
}

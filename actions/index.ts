"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface HealthReport {
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
    // Extract form values
    const productName = formData.get("productName") as string || "Unnamed Product";
    const netWeight = formData.get("netWeight") as string || "Not specified";
    const country = formData.get("country") as string || "India";
    const file = formData.get("file") as Blob | null;
    
    if (!file) return { error: "No file provided" };

    // Convert image to Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    // Generate AI content request
    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
      {
        text: `Analyze this product image from ${country} considering its food standards.
        
        Product Details:
        - Name: ${productName}
        - Net Weight: ${netWeight}
        
        Extract all readable text and generate a structured health analysis JSON:
        {
          "extractedText": "All text on packaging",
          "healthScore": Number (0-100, higher is healthier),
          "healthRisks": ["Risk 1", "Risk 2"],
          "consumptionFrequency": "Daily/Weekly/Occasionally/Rarely/Avoid",
          "alternatives": ["Better alternative 1", "Better alternative 2"],
          "ageSuitability": "Recommended age group",
          "warningLabels": ["Warning 1", "Warning 2"]
        }
        
        Return ONLY raw JSON, no markdown or explanations.`
      }
    ]);

    // Extract and parse JSON response
    const textResponse = await result.response.text();
    const jsonMatch = textResponse.match(/```(?:json)?([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : textResponse;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to analyze image" };
  }
}

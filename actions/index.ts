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
  const file = formData.get("file");
  const productName = formData.get("productName") as string || "Unnamed Product";
  const netWeight = formData.get("netWeight") as string || "Not specified";
  const country = formData.get("country") as string || "India";
  
  if (!file || !(file instanceof File)) return { error: "No file provided" };

  // Convert image to Base64
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Image = buffer.toString("base64");

  try {
    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
      {
        text: `Analyze this product image from ${country} (specifically considering ${country}'s food standards and regulations).
        
        Product details provided:
        - Product Name: ${productName}
        - Net Weight: ${netWeight}
        
        Extract all readable text from the nutrition label/ingredients list and generate a detailed structured health analysis in JSON format with these exact fields:
        
        {
          "extractedText": "All text visible on the packaging",
          "healthScore": A number from 0-100 representing overall healthiness (higher is healthier),
          "healthRisks": ["Risk 1", "Risk 2", ...],
          "consumptionFrequency": "One of: Daily, Weekly, Occasionally, Rarely, Avoid",
          "alternatives": ["Better alternative 1", "Better alternative 2", ...],
          "ageSuitability": "Detailed age recommendations",
          "warningLabels": ["Warning 1", "Warning 2", ...]
        }
        
        For ${country}-specific analysis:
        - Reference ${country}'s food safety standards (FSSAI if India)
        - Consider regional dietary preferences and health concerns
        - Evaluate against ${country}'s recommended daily values
        - Flag any ingredients that might be concerning specifically for ${country}'s population
        
        IMPORTANT: Return ONLY the raw JSON with no markdown formatting, no code blocks, and no additional explanatory text.`
      }
    ]);

    const textResponse = await result.response.text();
    console.log("Raw response:", textResponse); // For debugging
    
    try {
      // Extract JSON from potential markdown code blocks
      let jsonString = textResponse;
      
      // If the response contains markdown JSON code block, extract just the JSON part
      const jsonMatch = textResponse.match(/```(?:json)?([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1].trim();
      }
      
      // If the response starts with backticks but doesn't have a proper code block
      if (jsonString.startsWith('`') && jsonString.endsWith('`')) {
        jsonString = jsonString.slice(1, -1).trim();
      }
      
      // Parse the extracted JSON
      const parsedResponse = JSON.parse(jsonString);
      return parsedResponse;
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      
      // Manual parsing as fallback
      try {
        // Create a basic structure from the text response
        const extractedText = textResponse.includes("extractedText") 
          ? textResponse.split("extractedText")[1].split('"')[2] || ""
          : "";
        
        const healthScore = textResponse.includes("healthScore") 
          ? parseInt(textResponse.split("healthScore")[1].split(":")[1]) || 0 
          : 0;
          
        return { 
          extractedText,
          healthScore,
          error: "Partial data extracted. Some information may be missing."
        };
      } catch (e) {
        return { 
          extractedText: textResponse,
          error: "Could not parse structured data from response" 
        };
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to analyze image" };
  }
}
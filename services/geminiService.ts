
import { GoogleGenAI } from "@google/genai";
import type { WasteAnalysisResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `
You are an expert image-understanding assistant for a project called Waste Segregation. Given a single image (or multiple objects within the image), detect every waste item and for each item produce: id (integer), name (short human label), categories (array of any of: "Organic", "Non-Organic", "Degradable", "Non-Degradable", "Plastic", "Non-Plastic", "Recyclable", "Non-Recyclable", "Hazardous", "Wet Waste", "Electronic Waste", "Dry Waste"), category_confidences (object mapping each returned category → confidence 0..1), confidence (overall confidence for the object 0..1), and bbox (if available, normalized [x,y,width,height] 0..1). Also return recommended_disposal (one short sentence) for each item. Return a top-level summary with counts per category and an overall image_confidence. Important: return only JSON and follow this schema exactly (no surrounding explanation or extra text). If uncertain about an item, include "uncertain": true for that item and put lower confidence. If bounding boxes are not available, return them as null. Example schema:
{ "image_id":"<string>", "objects":[{"id":1,"name":"plastic bottle","categories":["Plastic","Non-Organic","Recyclable","Dry Waste"], "category_confidences":{"Plastic":0.98,"Recyclable":0.85},"confidence":0.95,"bbox":[0.12,0.32,0.06,0.18],"recommended_disposal":"Rinse and put in dry recyclable bin","uncertain":false}], "summary":{"counts":{"Plastic":2,"Organic":1,...},"image_confidence":0.92} }. Detect multiple items per image and allow multiple categories per item. Prioritize precision for recyclable/hazardous decisions and include short disposal instructions.
`;

export async function analyzeWasteImage(base64ImageData: string, mimeType: string): Promise<WasteAnalysisResponse> {
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };
  
  const textPart = {
    text: PROMPT
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as WasteAnalysisResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze image with Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}

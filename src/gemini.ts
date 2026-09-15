import { GoogleGenAI } from "@google/genai";

export interface GeminiReview {
  severity: "critical" | "high" | "medium" | "low";
  file: string;
  line: number;
  title: string;
  description: string;
  suggestion: string;
}

export async function reviewCode(
  apiKey: string,
  model: string,
  prompt: string
): Promise<GeminiReview[]> {
  const ai = new GoogleGenAI({
    apiKey
  });

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(text) as GeminiReview[];
}

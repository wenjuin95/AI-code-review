import { GoogleGenAI } from "@google/genai";

export interface ReviewIssue {
  severity: "critical" | "high" | "medium" | "low";
  file: string;
  line: number;
  title: string;
  description: string;
  suggestion: string;
}

export async function reviewWithGemini(
  apiKey: string,
  model: string,
  prompt: string
): Promise<ReviewIssue[]> {

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

  const result = JSON.parse(text);

  if (!Array.isArray(result)) {
    throw new Error("Gemini returned invalid review format");
  }

  return result;
}

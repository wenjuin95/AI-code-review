"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewWithGemini = reviewWithGemini;
const genai_1 = require("@google/genai");
async function reviewWithGemini(apiKey, model, prompt) {
    const ai = new genai_1.GoogleGenAI({
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

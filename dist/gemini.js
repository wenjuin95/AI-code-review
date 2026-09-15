"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewCode = reviewCode;
const genai_1 = require("@google/genai");
async function reviewCode(apiKey, model, prompt) {
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
    return JSON.parse(text);
}

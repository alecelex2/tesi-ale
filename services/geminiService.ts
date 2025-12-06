import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { Message, GeminiConfig } from '../types';
import { THESIS_CONTEXT } from '../constants';

// Ensure API Key is present
if (!process.env.API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  image: string | null,
  config: GeminiConfig
): Promise<string> => {
  try {
    const parts: Part[] = [];

    // Add Image if present
    if (image) {
      // Extract base64 data from data URI
      const base64Data = image.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming JPEG/PNG usually
          data: base64Data
        }
      });
    }

    // Add Text Prompt
    parts.push({ text: newMessage });

    // CONFIGURATION LOGIC:
    // Use 'gemini-2.5-flash' for standard, fast chat (User request).
    // Use 'gemini-3-pro-preview' ONLY if "Thinking Mode" is enabled.
    
    const modelName = config.useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

    const generateConfig: any = {
      systemInstruction: THESIS_CONTEXT,
    };

    if (config.useThinking) {
      // Requirement: Thinking budget 32768 for gemini-3-pro-preview
      generateConfig.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: {
        role: 'user',
        parts: parts
      },
      config: generateConfig
    });

    return response.text || "ERROR: NO_DATA_GENERATED.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "SYSTEM_ERROR: CONNECTION_LOST.";
  }
};
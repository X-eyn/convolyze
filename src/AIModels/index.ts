// src/AIModels/index.ts
import { GPT_MODELS, GEMINI_MODELS } from "@/constants";
import { getChatResponse as openAIGetChatResponse } from "@/utils/chatGPT";
import { getGeminiChatResponse } from "@/utils/gemini";
import { logger } from "@/utils/logger";

export const resolveModel = async (model: string) => {
    logger.info(`Resolving model: ${model}`);
    
    if (GPT_MODELS.includes(model)) {
        return openAIGetChatResponse;
    }
    if (GEMINI_MODELS.includes(model)) {
        return getGeminiChatResponse;
    }
    return openAIGetChatResponse;
}
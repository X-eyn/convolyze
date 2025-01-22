// src/utils/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";
import { logger } from "@/utils/logger";

interface ExtendedChatParams extends ChatCompletionCreateParamsNonStreaming {
   query?: string;
}

// Initialize the Gemini client
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = geminiClient.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// Helper function to format responses
const formatGeminiResponse = (text: string, format: string = 'text') => {
   if (format === 'json_object') {
       try {
           // Try to extract JSON if it's wrapped in text
           const jsonMatch = text.match(/\{[\s\S]*\}/);
           if (jsonMatch) {
               const jsonStr = jsonMatch[0];
               return JSON.parse(jsonStr);
           }
           return JSON.parse(text);
       } catch (error) {
           logger.error('JSON formatting error:', error);
           return null;
       }
   }
   
   // For text responses, ensure proper markdown formatting
   return text.trim()
       .replace(/^```(markdown)?/, '')
       .replace(/```$/, '')
       .trim();
};

export async function getGeminiChatResponse(bodyData: ExtendedChatParams) {
   try {
       logger.info('Calling Gemini API with body:', JSON.stringify(bodyData));

       // Add system message for consistent formatting
       const systemMessage = {
           role: 'system',
           content: `You are a meeting analysis AI that provides well-structured, detailed responses.
                    For text responses, use proper markdown formatting.
                    For JSON responses, ensure strict adherence to the requested format.
                    Keep responses focused and relevant to the specific query.`
       };

       // Add explicit formatting instructions based on query type
       let structuredPrompt = '';
       const query = bodyData.query || '';

       if (query.includes('summarize')) {
           structuredPrompt = `
               Analyze the meeting transcript and provide a comprehensive summary using this structure:
               1. Key Points (in clear paragraphs)
               2. Main Topics Discussed (as bullet points)
               3. Participant Contributions
               4. Action Items/Decisions
               
               Format using proper markdown for readability.
               Keep the summary concise but informative.
               
           `;
       } else if (query.includes('percentage') || query.includes('statistics')) {
           structuredPrompt = `
               Analyze the meeting transcript and provide detailed statistics.
               Return the response in this exact JSON format:
               {
                   "topics": [
                       {
                           "topic": "Topic Name",
                           "participants": {
                               "participant1": percentage,
                               "participant2": percentage
                           }
                       }
                   ]
               }
               Ensure percentages reflect actual participation and topic relevance.
           `;
       } else if (query.includes('effectiveness')) {
           structuredPrompt = `
               Calculate meeting effectiveness score (0-100) considering:
               - Agenda adherence and topic coverage (40%)
               - Participant engagement and balanced participation (30%)
               - Meeting efficiency and time management (30%)
               
               Return only a JSON object: {"effectiveness": number}
           `;
       }

       // Combine messages with system message and structured prompt
       const messages = [systemMessage, ...bodyData.messages];
       const finalPrompt = `${structuredPrompt}\n\n${messages.map(msg => msg.content).join('\n')}`;

       const result = await model.generateContent(finalPrompt);
       const response = await result.response;
       const text = response.text();

       if (bodyData.response_format?.type === 'json_object') {
           try {
               const formattedResponse = formatGeminiResponse(text, 'json_object');
               if (formattedResponse) {
                   return JSON.stringify(formattedResponse);
               }
               
               // Fallback responses based on query type
               if (query.includes('effectiveness')) {
                   return JSON.stringify({ effectiveness: 0 });
               }
               if (query.includes('percentage') || query.includes('statistics')) {
                   return JSON.stringify({ topics: [] });
               }
               return JSON.stringify({});
               
           } catch (error) {
               logger.error('JSON parse error in Gemini response:', error);
               return JSON.stringify(query.includes('effectiveness') ? 
                   { effectiveness: 0 } : { topics: [] });
           }
       }

       // Format text responses
       const formattedText = formatGeminiResponse(text, 'text');
       return formattedText;

   } catch (error) {
       logger.error('Error in getGeminiChatResponse:', error);
       
       if (bodyData.response_format?.type === 'json_object') {
           const query = bodyData.query || '';
           if (query.includes('effectiveness')) {
               return JSON.stringify({ effectiveness: 0 });
           }
           return JSON.stringify({ topics: [] });
       }
       
       throw new Error('Gemini API Error');
   }
}
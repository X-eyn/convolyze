import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { GPT_MODELS } from "@/constants";
import { resolveModel } from "@/AIModels";
import { logger } from "@/utils/logger";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const selectedModel = request.headers.get('ai-model') || GPT_MODELS[0];
        const data = await request.json();
        
        logger.info(`Askmodel requested model ${selectedModel}`);

        const meeting = await prisma.meeting.findUnique({
            where: { id: Number(data.id) }
        });

        if (!(meeting && meeting.transcribe)) {
            return NextResponse.json({ error: "Meeting or transcribe not found" }, { status: 404 });
        }

        const meetingResponse = await prisma.meeting_response.findUnique({
            where: { meetingId: Number(data.id) }
        });

        const resolvedChatResponse = await resolveModel(selectedModel);

        if (!resolvedChatResponse) {
            return NextResponse.json({ error: `Unsupported Model provided ${selectedModel}` }, { status: 400 });
        }

        try {
            const parsedTranscribe = JSON.parse(meeting.transcribe);
            const result = await resolvedChatResponse({
                model: selectedModel,
                response_format: { type: data?.format || "text" },
                messages: [...parsedTranscribe, { role: 'user', content: data.query }],
                temperature: 0.2,
                stream: false
            });

            if (meetingResponse?.id) {
                await prisma.meeting_response.update({
                    where: { id: Number(meetingResponse?.id) },
                    data: { [data.responseKey]: result, meetingId: Number(data.id) }
                });
                logger.info(`Meeting response cached for meeting Id: ${meetingResponse.meetingId} for reponseKey: ${data.responseKey}`);
            }

            return NextResponse.json(result);
        } catch (error) {
            logger.error('Error:', error);
            return NextResponse.json({ 
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }, { status: 500 });
        }
    } catch (error) {
        logger.error('Unhandled error:', error);
        return NextResponse.json({ 
            error: 'Internal server error'
        }, { status: 500 });
    }
}
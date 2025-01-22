import { NextRequest, NextResponse } from "next/server";
import { startAnalysisPrompt } from "@/utils/prompt";
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const transcribeFile = formData.get('transcribeFile') as Blob;
    const agenda = formData.get('agenda') as string;
    
    if (!transcribeFile || !agenda) {
      return NextResponse.json(
        { status: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await transcribeFile.arrayBuffer());
    const transcriptText = buffer.toString();
    
    // Generate message list
    const msgList = startAnalysisPrompt(agenda, transcriptText);
    
    // Create the meeting record
    const result = await prisma.meeting.create({
      data: {
        title: agenda,
        duration: Math.floor(Math.random() * 60) + 1,
        transcribe: JSON.stringify(msgList),
      },
    });

    await prisma.meeting_response.create({
      data: {
        meetingId: result.id,
      },
    });

    return NextResponse.json({
      status: true,
      id: result?.id,
      message: "Meeting created successfully."
    });

  } catch (e) {
    console.error("Error while saving meeting:", e);
    return NextResponse.json(
      { 
        status: false, 
        error: e instanceof Error ? e.message : "Something went wrong." 
      },
      { status: 500 }
    );
  }
}
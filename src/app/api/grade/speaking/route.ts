import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import { SYSTEM_JSON, GRADE_SPEAKING } from "@/lib/prompts";
import type { GradingResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Body {
  topic: string;
  followUpQuestions: string[];
  transcript: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.transcript || body.transcript.trim().length < 10) {
      return NextResponse.json(
        { error: "録音の文字起こしが空または短すぎます。もう一度録音してください。" },
        { status: 400 }
      );
    }
    const data = await chatJSON<GradingResult>({
      system: SYSTEM_JSON,
      user: GRADE_SPEAKING(body.topic, body.followUpQuestions, body.transcript),
      temperature: 0.3,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

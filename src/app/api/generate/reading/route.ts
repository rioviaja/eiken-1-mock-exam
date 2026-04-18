import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import { SYSTEM_JSON, READING_USER } from "@/lib/prompts";
import { shuffleMCQ } from "@/lib/shuffle";
import type { ReadingPassage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    const data = await chatJSON<ReadingPassage>({
      system: SYSTEM_JSON,
      user: READING_USER,
      temperature: 0.8,
    });
    if (!data.passage || !Array.isArray(data.questions)) {
      return NextResponse.json(
        { error: "Unexpected response shape" },
        { status: 502 }
      );
    }
    const questions = data.questions.map(shuffleMCQ);
    return NextResponse.json({ ...data, questions });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

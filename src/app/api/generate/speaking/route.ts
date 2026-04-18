import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import { SYSTEM_JSON, SPEAKING_USER } from "@/lib/prompts";
import type { SpeakingCard } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  try {
    const data = await chatJSON<SpeakingCard>({
      system: SYSTEM_JSON,
      user: SPEAKING_USER,
      temperature: 0.85,
    });
    if (!data.topic || !Array.isArray(data.followUpQuestions)) {
      return NextResponse.json(
        { error: "Unexpected response shape" },
        { status: 502 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

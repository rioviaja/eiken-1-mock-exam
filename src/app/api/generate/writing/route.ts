import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import { SYSTEM_JSON, WRITING_USER } from "@/lib/prompts";
import type { WritingPrompt } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const data = await chatJSON<WritingPrompt>({
      system: SYSTEM_JSON,
      user: WRITING_USER,
      temperature: 0.8,
    });
    if (!data.summary || !data.essay) {
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

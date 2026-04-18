import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import { SYSTEM_JSON, VOCABULARY_USER } from "@/lib/prompts";
import type { MCQQuestion } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Response {
  items: MCQQuestion[];
}

export async function POST() {
  try {
    const data = await chatJSON<Response>({
      system: SYSTEM_JSON,
      user: VOCABULARY_USER(25),
      temperature: 0.8,
    });
    if (!data.items || !Array.isArray(data.items)) {
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

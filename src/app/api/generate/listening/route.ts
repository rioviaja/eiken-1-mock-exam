import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import { SYSTEM_JSON, LISTENING_USER } from "@/lib/prompts";
import type { ListeningItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Response {
  items: ListeningItem[];
}

export async function POST() {
  try {
    const data = await chatJSON<Response>({
      system: SYSTEM_JSON,
      user: LISTENING_USER(3),
      temperature: 0.8,
    });
    if (!Array.isArray(data.items)) {
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

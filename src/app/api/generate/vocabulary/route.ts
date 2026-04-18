import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import { SYSTEM_JSON, VOCABULARY_USER } from "@/lib/prompts";
import { shuffleMCQ } from "@/lib/shuffle";
import type { MCQQuestion } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Response {
  items: MCQQuestion[];
}

const BATCH_SIZES = [5, 5, 5, 5, 5];

export async function POST() {
  try {
    const batches = await Promise.all(
      BATCH_SIZES.map((n) =>
        chatJSON<Response>({
          system: SYSTEM_JSON,
          user: VOCABULARY_USER(n),
          temperature: 0.8,
        })
      )
    );
    const merged: MCQQuestion[] = [];
    for (const data of batches) {
      if (!data.items || !Array.isArray(data.items)) {
        return NextResponse.json(
          { error: "Unexpected response shape" },
          { status: 502 }
        );
      }
      merged.push(...data.items);
    }
    const items = merged
      .slice(0, 25)
      .map((q, i) => ({ ...q, id: `v${i + 1}` }))
      .map(shuffleMCQ);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

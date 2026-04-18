import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/json";
import {
  SYSTEM_JSON,
  GRADE_WRITING_SUMMARY,
  GRADE_WRITING_ESSAY,
} from "@/lib/prompts";
import type { GradingResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Body {
  kind: "summary" | "essay";
  passage?: string;
  topic?: string;
  points?: string[];
  answer: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.answer || body.answer.trim().length < 20) {
      return NextResponse.json(
        { error: "回答が短すぎます。もう少し書いてから提出してください。" },
        { status: 400 }
      );
    }

    let user: string;
    if (body.kind === "summary") {
      if (!body.passage) {
        return NextResponse.json({ error: "passage required" }, { status: 400 });
      }
      user = GRADE_WRITING_SUMMARY(body.passage, body.answer);
    } else if (body.kind === "essay") {
      if (!body.topic || !body.points) {
        return NextResponse.json(
          { error: "topic and points required" },
          { status: 400 }
        );
      }
      user = GRADE_WRITING_ESSAY(body.topic, body.points, body.answer);
    } else {
      return NextResponse.json({ error: "invalid kind" }, { status: 400 });
    }

    const data = await chatJSON<GradingResult>({
      system: SYSTEM_JSON,
      user,
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

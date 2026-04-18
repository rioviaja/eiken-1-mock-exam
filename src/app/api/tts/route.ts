import { NextResponse } from "next/server";
import { getOpenAI, MODELS } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  text: string;
  voice?: string;
}

// Returns an audio/mpeg stream synthesized from the provided text.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.text || body.text.trim().length === 0) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }
    const openai = getOpenAI();
    const speech = await openai.audio.speech.create({
      model: MODELS.tts,
      voice: body.voice ?? "alloy",
      input: body.text.slice(0, 4000),
      response_format: "mp3",
    });
    const buf = Buffer.from(await speech.arrayBuffer());
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

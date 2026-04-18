import { NextResponse } from "next/server";
import { getOpenAI, MODELS } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Accepts multipart/form-data with a 'file' field (audio blob).
// Returns { text: string } - the transcription.
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    const openai = getOpenAI();
    const transcript = await openai.audio.transcriptions.create({
      model: MODELS.stt,
      file,
      language: "en",
    });
    return NextResponse.json({ text: transcript.text });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

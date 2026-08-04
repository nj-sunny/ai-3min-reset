import { NextRequest, NextResponse } from "next/server";
import { generateMeditationScript } from "@/lib/gemini";
import { getMood } from "@/lib/moods";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const mood = getMood(body?.moodId);

  try {
    const paragraphs = await generateMeditationScript(mood);
    return NextResponse.json({ paragraphs, source: "gemini" });
  } catch (err) {
    console.error("Gemini generation failed, using fallback:", err);
    return NextResponse.json({ paragraphs: mood.fallback, source: "fallback" });
  }
}

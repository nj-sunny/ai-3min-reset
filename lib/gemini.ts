import { Mood } from "./moods";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function generateMeditationScript(mood: Mood): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const prompt = `너는 초보자를 위한 3분 명상 가이드 작가야. ${mood.promptHint} 한국어로 짧은 명상 스크립트를 작성해줘.

규칙:
- 정확히 8~9개의 문단으로 구성
- 각 문단은 1~2문장, 소리 내어 읽었을 때 15~20초 분량
- 호흡(들이마시고, 내쉬고) 안내를 최소 3번 이상 자연스럽게 포함
- 전문 용어나 어려운 표현 없이, 부드럽고 다정한 존댓말 사용
- 첫 문단은 지금 하던 일을 잠시 멈추도록 안내
- 마지막 문단은 천천히 눈을 뜨고 일상으로 돌아오도록 안내
- 반드시 아래 JSON 형식으로만 응답: {"paragraphs": ["...", "..."]}`;

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.9,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini response has no text");
  }

  const parsed = JSON.parse(text);
  const paragraphs: unknown = parsed?.paragraphs;
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
    throw new Error("Gemini response missing paragraphs");
  }

  return paragraphs.filter((p): p is string => typeof p === "string" && p.trim().length > 0);
}

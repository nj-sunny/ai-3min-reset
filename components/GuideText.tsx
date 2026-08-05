interface GuideTextProps {
  paragraphs: string[];
  elapsedSeconds: number;
}

const FADE_IN_SECONDS = 3.5;
const HOLD_SECONDS = 6;
const CYCLE_SECONDS = FADE_IN_SECONDS + HOLD_SECONDS;

export default function GuideText({ paragraphs, elapsedSeconds }: GuideTextProps) {
  if (paragraphs.length === 0) return null;

  const rawIndex = Math.floor(elapsedSeconds / CYCLE_SECONDS);
  const currentIndex = Math.min(paragraphs.length - 1, rawIndex);
  const current = paragraphs[currentIndex];

  // once the last paragraph's own cycle has passed, just hold it fully visible
  const localElapsed = rawIndex > currentIndex ? CYCLE_SECONDS : elapsedSeconds - currentIndex * CYCLE_SECONDS;
  const opacity = Math.min(1, localElapsed / FADE_IN_SECONDS);

  return (
    <p
      key={currentIndex}
      className="min-h-[4.5rem] max-w-sm text-center text-lg leading-relaxed text-[#6b4a52] transition-opacity duration-100"
      style={{ opacity }}
    >
      {current}
    </p>
  );
}

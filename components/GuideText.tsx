interface GuideTextProps {
  paragraphs: string[];
  elapsedSeconds: number;
  totalSeconds: number;
}

export default function GuideText({ paragraphs, elapsedSeconds, totalSeconds }: GuideTextProps) {
  if (paragraphs.length === 0) return null;

  const slice = totalSeconds / paragraphs.length;
  const currentIndex = Math.min(paragraphs.length - 1, Math.floor(elapsedSeconds / slice));
  const current = paragraphs[currentIndex];

  const sliceStart = currentIndex * slice;
  const fraction = Math.min(1, Math.max(0, (elapsedSeconds - sliceStart) / slice));
  // reveal the full paragraph a bit before the slice ends so it's readable, not just barely finished
  const revealFraction = Math.min(1, fraction / 0.7);
  const charCount = Math.round(current.length * revealFraction);
  const visibleText = current.slice(0, charCount);

  return (
    <p
      key={currentIndex}
      className="min-h-[4.5rem] max-w-sm text-center text-lg leading-relaxed text-[#6b4a52]"
    >
      {visibleText}
    </p>
  );
}

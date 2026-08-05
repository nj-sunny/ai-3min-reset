interface GuideTextProps {
  paragraphs: string[];
  elapsedSeconds: number;
}

const WORD_FADE_SECONDS = 1.5;
const WORD_GAP_SECONDS = 2.5;
const HOLD_SECONDS = 6;

function splitWords(paragraph: string): string[] {
  return paragraph.split(/\s+/).filter(Boolean);
}

// time to reveal every word in a paragraph, one every WORD_GAP_SECONDS
function getRevealDuration(words: string[]): number {
  return words.length > 0 ? (words.length - 1) * WORD_GAP_SECONDS + WORD_FADE_SECONDS : 0;
}

export default function GuideText({ paragraphs, elapsedSeconds }: GuideTextProps) {
  if (paragraphs.length === 0) return null;

  let remaining = elapsedSeconds;
  let index = 0;
  let localElapsed = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    const words = splitWords(paragraphs[i]);
    const cycle = getRevealDuration(words) + HOLD_SECONDS;
    const isLast = i === paragraphs.length - 1;
    if (remaining < cycle || isLast) {
      index = i;
      // clamp so the last paragraph just stays fully revealed once its own cycle passes
      localElapsed = Math.min(remaining, cycle);
      break;
    }
    remaining -= cycle;
  }

  const words = splitWords(paragraphs[index]);

  return (
    <p
      key={index}
      className="min-h-[4.5rem] max-w-sm text-center text-lg leading-relaxed text-[#6b4a52]"
    >
      {words.map((word, i) => {
        const wordStart = i * WORD_GAP_SECONDS;
        const opacity = Math.min(1, Math.max(0, (localElapsed - wordStart) / WORD_FADE_SECONDS));
        return (
          <span key={i} className="transition-opacity duration-100" style={{ opacity }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

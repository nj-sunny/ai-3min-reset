interface GuideTextProps {
  paragraphs: string[];
  elapsedSeconds: number;
}

const WORD_FADE_SECONDS = 1.5;
const WORD_GAP_SECONDS = 2;
const HOLD_SECONDS = 6;

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

// break a paragraph into its sentences so each one starts on its own line
function splitSentences(paragraph: string): string[] {
  const matches = paragraph.match(/[^.!?]+[.!?]*/g);
  return matches ? matches.map((s) => s.trim()).filter(Boolean) : [paragraph];
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

  const sentences = splitSentences(paragraphs[index]);
  const sentenceGroups: { words: string[]; startIndex: number }[] = [];
  let cursor = 0;
  for (const sentence of sentences) {
    const sentenceWords = splitWords(sentence);
    sentenceGroups.push({ words: sentenceWords, startIndex: cursor });
    cursor += sentenceWords.length;
  }

  return (
    <div
      key={index}
      className="flex min-h-[4.5rem] max-w-sm flex-col items-center gap-1 text-center text-lg leading-relaxed text-[#6b4a52]"
    >
      {sentenceGroups.map(({ words, startIndex }, sIndex) => (
        <p key={sIndex} className="m-0">
          {words.map((word, wIndex) => {
            const wordStart = (startIndex + wIndex) * WORD_GAP_SECONDS;
            const opacity = Math.min(1, Math.max(0, (localElapsed - wordStart) / WORD_FADE_SECONDS));
            return (
              <span key={wIndex} className="transition-opacity duration-100" style={{ opacity }}>
                {word}
                {wIndex < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

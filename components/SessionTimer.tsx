interface SessionTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SessionTimer({ remainingSeconds, totalSeconds }: SessionTimerProps) {
  const progress = Math.min(1, Math.max(0, 1 - remainingSeconds / totalSeconds));

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2">
      <span className="font-mono text-2xl tabular-nums text-[#6b4a52]">
        {formatTime(remainingSeconds)}
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-blossom-100">
        <div
          className="h-full rounded-full bg-blossom-400 transition-[width] duration-200 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

interface SessionControlsProps {
  paused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  onGoHome: () => void;
}

export default function SessionControls({
  paused,
  onTogglePause,
  onRestart,
  onGoHome,
}: SessionControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onRestart}
        aria-label="처음부터 다시"
        title="처음부터 다시"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-lg text-[#8a5a63] transition-colors hover:bg-white"
      >
        🔁
      </button>
      <button
        type="button"
        onClick={onTogglePause}
        aria-label={paused ? "재생" : "일시정지"}
        title={paused ? "재생" : "일시정지"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blossom-500 text-xl text-white shadow-md transition-transform hover:scale-105"
      >
        {paused ? "▶" : "⏸"}
      </button>
      <button
        type="button"
        onClick={onGoHome}
        aria-label="메인으로 돌아가기"
        title="메인으로 돌아가기"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-lg text-[#8a5a63] transition-colors hover:bg-white"
      >
        🏠
      </button>
    </div>
  );
}

interface BreathingFlowProps {
  active: boolean;
}

// One hill = one breath cycle in a 0..300 local unit tile (rise 0-40%, hold 40-60%, fall 60-100%).
// Straight segments (not curves) so the dot's linear keyframes land exactly on the line.
// Repeated 3x (900 wide) so the strip can scroll by exactly one tile and loop seamlessly.
const LINE_POINTS =
  "0,130 120,10 180,10 300,130 420,10 480,10 600,130 720,10 780,10 900,130";
const FILL_PATH =
  "M0,140 L0,130 L120,10 L180,10 L300,130 L420,10 L480,10 L600,130 L720,10 L780,10 L900,130 L900,140 Z";

const LINE_COLOR = "#d6336c";
const DOT_COLOR = "#ffb703";

export default function BreathingFlow({ active }: BreathingFlowProps) {
  const anim = active ? "" : "animate-paused";

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative flex h-6 items-center justify-center">
        <span
          className={`absolute text-sm font-medium tracking-wide text-[#8a5a63] animate-breathe-in-label ${anim}`}
        >
          들이마시고
        </span>
        <span
          className={`absolute text-sm font-medium tracking-wide text-[#8a5a63] animate-breathe-hold-label ${anim}`}
        >
          멈추고
        </span>
        <span
          className={`absolute text-sm font-medium tracking-wide text-[#8a5a63] animate-breathe-out-label ${anim}`}
        >
          내쉬고
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-3xl bg-cream-100 shadow-lg"
        style={{ height: "clamp(140px, 34vw, 200px)" }}
      >
        <svg
          className={`absolute inset-0 h-full w-[300%] animate-flow-scroll ${anim}`}
          viewBox="0 0 900 140"
          preserveAspectRatio="none"
        >
          <path d={FILL_PATH} fill={LINE_COLOR} opacity={0.12} />
          <polyline
            points={LINE_POINTS}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white animate-flow-dot-bounce ${anim}`}
          style={{ left: "40%", backgroundColor: DOT_COLOR, boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }}
        />
      </div>
    </div>
  );
}

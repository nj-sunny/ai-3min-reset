interface BreathingFlowProps {
  active: boolean;
}

// One hill = one breath cycle in a 0..300 local unit tile (rise 0-40%, hold 40-60%, fall 60-100%).
// Repeated 3x (900 wide) so the strip can scroll by exactly one tile and loop seamlessly.
const HILLS_PATH =
  "M0,140 L0,130 C45,130 75,10 120,10 L180,10 C225,10 255,130 300,130 " +
  "C345,130 375,10 420,10 L480,10 C525,10 555,130 600,130 " +
  "C645,130 675,10 720,10 L780,10 C825,10 855,130 900,130 L900,140 Z";

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
          className={`absolute text-sm font-medium tracking-wide text-[#8a5a63] animate-breathe-out-label ${anim}`}
        >
          내쉬고
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-3xl shadow-lg"
        style={{ height: "clamp(140px, 34vw, 200px)" }}
      >
        <svg
          className={`absolute inset-0 h-full w-[300%] animate-flow-scroll ${anim}`}
          viewBox="0 0 900 140"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="flowGradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="300"
              y2="0"
              spreadMethod="repeat"
            >
              <stop offset="0%" stopColor="#ff9eb5" />
              <stop offset="20%" stopColor="#ffd6e0" />
              <stop offset="40%" stopColor="#e6fff8" />
              <stop offset="50%" stopColor="#e0d6ff" />
              <stop offset="60%" stopColor="#e6fff8" />
              <stop offset="80%" stopColor="#ffd6e0" />
              <stop offset="100%" stopColor="#ff9eb5" />
            </linearGradient>
          </defs>
          <path d={HILLS_PATH} fill="url(#flowGradient)" />
        </svg>

        <div
          className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md animate-flow-dot-bounce ${anim}`}
          style={{ left: "28%" }}
        />
      </div>
    </div>
  );
}

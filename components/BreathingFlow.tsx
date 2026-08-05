import { CSSProperties } from "react";

interface BreathingFlowProps {
  active: boolean;
  color: string;
}

// One hill = one breath cycle in a 0..300 local unit tile: smooth rise
// (x 0-120), flat top/hold (120-180), smooth fall (180-300). The rise/fall
// segments are cubic beziers with control points at x +- w/3 (a "smoothstep"
// curve), which keeps x(t) exactly linear in t - so the dot's keyframes can
// use the matching cubic-bezier(1/3,0,2/3,1) easing and land exactly on the
// line. Repeated 3x (900 wide) so the strip can scroll by exactly one tile
// and loop seamlessly.
//
// The dot sits at a fixed 40% of the (one-tile-wide) container, which at
// animation-time 0 lines up with local x=120 - the start of the hold. So in
// TIME (not path-x) terms the cycle order is hold[0-20%] -> exhale[20-60%]
// -> inhale[60-100%]; see flow-dot-bounce and the breathe-*-label keyframes
// in globals.css, which must stay in sync with these percentages.
const LINE_D =
  "M0,130 C40,130 80,10 120,10 L180,10 C220,10 260,130 300,130 " +
  "C340,130 380,10 420,10 L480,10 C520,10 560,130 600,130 " +
  "C640,130 680,10 720,10 L780,10 C820,10 860,130 900,130";

export default function BreathingFlow({ active, color }: BreathingFlowProps) {
  const anim = active ? "" : "animate-paused";
  const wrapStyle = { "--breath-color": color } as CSSProperties;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl shadow-lg"
      style={{
        ...wrapStyle,
        height: "clamp(140px, 34vw, 200px)",
        background:
          "radial-gradient(120% 100% at 30% 0%, rgba(120,130,255,0.12), transparent 60%), #0a0e17",
      }}
    >
      {/* base track: always visible, muted */}
      <svg
        className={`absolute inset-0 h-full w-[300%] animate-flow-scroll ${anim}`}
        viewBox="0 0 900 140"
        preserveAspectRatio="none"
      >
        <path
          d={LINE_D}
          fill="none"
          stroke="#4b5563"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* glowing mood-colored track, clipped to the already-breathed portion left of the dot */}
      <div className="absolute inset-0" style={{ clipPath: "inset(0 60% 0 0)" }}>
        <svg
          className={`absolute inset-0 h-full w-[300%] animate-flow-scroll ${anim}`}
          viewBox="0 0 900 140"
          preserveAspectRatio="none"
          style={{
            filter:
              "drop-shadow(0 0 4px var(--breath-color)) drop-shadow(0 0 14px var(--breath-color))",
          }}
        >
          <path
            d={LINE_D}
            fill="none"
            stroke="var(--breath-color)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div
        className={`absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full animate-flow-dot-bounce ${anim}`}
        style={{
          left: "40%",
          backgroundColor: "var(--breath-color)",
          boxShadow: "0 0 10px var(--breath-color), 0 0 28px var(--breath-color)",
        }}
      />

      <div className="absolute left-4 top-4 flex h-8 items-center">
        <span className={`label-pill absolute animate-breathe-in-label ${anim}`}>들이마시고</span>
        <span className={`label-pill absolute animate-breathe-hold-label ${anim}`}>멈추고</span>
        <span className={`label-pill absolute animate-breathe-out-label ${anim}`}>내쉬고</span>
      </div>
    </div>
  );
}

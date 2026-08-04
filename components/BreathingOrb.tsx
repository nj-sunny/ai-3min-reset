interface BreathingOrbProps {
  active: boolean;
}

export default function BreathingOrb({ active }: BreathingOrbProps) {
  const anim = active ? "" : "animate-paused";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: "clamp(260px, 80vw, 400px)", height: "clamp(260px, 80vw, 400px)" }}
    >
      <div className={`absolute inset-0 rounded-full shadow-xl animate-breathe-scale ${anim}`}>
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-mint-200 via-mint-100 to-lavender-200 animate-breathe-in-color ${anim}`}
        />
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-blossom-500 via-blossom-400 to-blossom-200 animate-breathe-out-color ${anim}`}
        />
      </div>
      <div className="relative flex h-6 items-center justify-center">
        <span
          className={`absolute text-sm font-medium tracking-wide text-[#8a5a63] animate-breathe-in-label ${anim}`}
        >
          들이마시고
        </span>
        <span
          className={`absolute text-sm font-medium tracking-wide text-white/90 animate-breathe-out-label ${anim}`}
        >
          내쉬고
        </span>
      </div>
    </div>
  );
}

interface BreathingOrbProps {
  active: boolean;
}

export default function BreathingOrb({ active }: BreathingOrbProps) {
  const anim = active ? "" : "animate-paused";

  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-blossom-200 via-blossom-100 to-lavender-200 shadow-lg animate-breathe-scale ${anim}`}
      />
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
    </div>
  );
}

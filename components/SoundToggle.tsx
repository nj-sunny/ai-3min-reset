"use client";

import { useEffect, useState } from "react";
import { startAmbientSound, stopAmbientSound } from "@/lib/ambientSound";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (enabled) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
    return () => stopAmbientSound();
  }, [enabled]);

  return (
    <button
      type="button"
      onClick={() => setEnabled((v) => !v)}
      className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs text-[#8a5a63] transition-colors hover:bg-white"
    >
      <span>{enabled ? "🔊" : "🔇"}</span>
      <span>{enabled ? "소리 켜짐" : "소리 꺼짐"}</span>
    </button>
  );
}

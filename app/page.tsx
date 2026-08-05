"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import MoodPicker from "@/components/MoodPicker";
import BreathingFlow from "@/components/BreathingFlow";
import SessionTimer from "@/components/SessionTimer";
import GuideText from "@/components/GuideText";
import SoundToggle from "@/components/SoundToggle";
import SessionControls from "@/components/SessionControls";
import { MoodId, getMood } from "@/lib/moods";
import {
  addSession,
  getStreak,
  getTotalCount,
  getSessionsSnapshot,
  getSessionsServerSnapshot,
  subscribeSessions,
} from "@/lib/sessionStore";
import { suspendAmbientSound, resumeAmbientSound } from "@/lib/ambientSound";

const SESSION_SECONDS = 180;

type Stage = "start" | "loading" | "session" | "complete";

export default function Home() {
  const [stage, setStage] = useState<Stage>("start");
  const [moodId, setMoodId] = useState<MoodId | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { todayMinutes } = useSyncExternalStore(
    subscribeSessions,
    getSessionsSnapshot,
    getSessionsServerSnapshot,
  );

  // ticks elapsed forward while the session is active and not paused
  useEffect(() => {
    if (stage !== "session" || paused || !moodId) return;
    const id = setInterval(() => {
      setElapsed((prev) => {
        const next = Math.min(SESSION_SECONDS, prev + 0.1);
        if (next >= SESSION_SECONDS && prev < SESSION_SECONDS) {
          addSession(moodId);
          setStreak(getStreak());
          setTotalCount(getTotalCount());
          setStage("complete");
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [stage, paused, moodId]);

  async function handleStart(id: MoodId) {
    setMoodId(id);
    setStage("loading");
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodId: id }),
      });
      const data = await res.json();
      setParagraphs(data.paragraphs ?? getMood(id).fallback);
    } catch {
      setParagraphs(getMood(id).fallback);
    }
    setPaused(false);
    setElapsed(0);
    setStage("session");
  }

  function handleRestartSession() {
    setElapsed(0);
    setPaused(false);
  }

  function handleTogglePause() {
    setPaused((prev) => {
      const next = !prev;
      if (next) {
        suspendAmbientSound();
      } else {
        resumeAmbientSound();
      }
      return next;
    });
  }

  function handleReturnToStart() {
    setStage("start");
    setMoodId(null);
    setParagraphs([]);
    setElapsed(0);
    setPaused(false);
  }

  const sessionMood = stage === "session" ? getMood(moodId) : null;

  return (
    <main
      className="flex min-h-screen flex-1 flex-col items-center bg-gradient-to-b from-cream-100 via-blossom-50 to-lavender-100 px-6 py-10"
      style={
        sessionMood
          ? { background: `linear-gradient(to bottom, #fff9f5, ${sessionMood.pastel})` }
          : undefined
      }
    >
      {stage === "start" && (
        <div className="mt-6 flex w-full max-w-md flex-col items-center gap-6 text-center">
          <h1 className="flex flex-col items-center gap-1">
            <span className="text-base font-medium tracking-wide text-blossom-500">
              AI와 함께하는
            </span>
            <span className="bg-gradient-to-r from-blossom-500 to-blossom-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              3분 리셋 명상
            </span>
          </h1>
          <p className="text-sm text-[#9a7d84]">
            앱을 깔지 않아도 괜찮아요. 지금 느낌을 골라주시면
            <br />
            AI가 딱 맞는 3분 명상을 준비해 드려요.
          </p>
          <MoodPicker selected={moodId} onSelect={handleStart} />
          <p className="text-sm text-[#8a5a63]">
            오늘 누적 명상 시간 <span className="font-semibold text-blossom-600">{todayMinutes}분</span>
          </p>
          <Link href="/history" className="text-xs text-[#9a7d84] underline underline-offset-2">
            나의 기록 보기
          </Link>
        </div>
      )}

      {stage === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blossom-200 border-t-blossom-500" />
          <p className="text-sm text-[#9a7d84]">지금 딱 맞는 명상을 준비하고 있어요...</p>
        </div>
      )}

      {stage === "session" && (
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <SoundToggle />
          <BreathingFlow active={!paused && elapsed < SESSION_SECONDS} color={getMood(moodId).color} />
          <GuideText paragraphs={paragraphs} elapsedSeconds={elapsed} />
          <SessionTimer remainingSeconds={SESSION_SECONDS - elapsed} totalSeconds={SESSION_SECONDS} />
          <SessionControls
            paused={paused}
            onTogglePause={handleTogglePause}
            onRestart={handleRestartSession}
            onGoHome={handleReturnToStart}
          />
        </div>
      )}

      {stage === "complete" && (
        <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
          <span className="text-4xl">🌸</span>
          <h2 className="text-2xl font-semibold text-[#6b4a52]">오늘의 리셋 완료</h2>
          <p className="text-sm text-[#9a7d84]">
            잠깐의 멈춤이 다음 몇 시간을 더 가볍게 만들어 줄 거예요.
          </p>
          <div className="flex gap-4 rounded-2xl bg-white/70 px-6 py-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold text-blossom-600">{streak}</span>
              <span className="text-xs text-[#9a7d84]">연속 일수</span>
            </div>
            <div className="w-px bg-blossom-100" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold text-blossom-600">{totalCount}</span>
              <span className="text-xs text-[#9a7d84]">누적 리셋</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReturnToStart}
            className="w-full max-w-xs rounded-full bg-blossom-500 py-3 font-medium text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            다시 시작하기
          </button>
          <Link href="/history" className="text-xs text-[#9a7d84] underline underline-offset-2">
            나의 기록 보기
          </Link>
        </div>
      )}
    </main>
  );
}

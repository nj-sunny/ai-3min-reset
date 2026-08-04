"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getMood } from "@/lib/moods";
import {
  getSessionsServerSnapshot,
  getSessionsSnapshot,
  subscribeSessions,
} from "@/lib/sessionStore";

export default function HistoryPage() {
  const { sessions, streak, total } = useSyncExternalStore(
    subscribeSessions,
    getSessionsSnapshot,
    getSessionsServerSnapshot,
  );

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center gap-8 bg-gradient-to-b from-cream-100 via-blossom-50 to-lavender-100 px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold text-[#6b4a52]">나의 리셋 기록</h1>

        <div className="flex gap-4 rounded-2xl bg-white/70 px-6 py-4">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-blossom-600">{streak}</span>
            <span className="text-xs text-[#9a7d84]">연속 일수</span>
          </div>
          <div className="w-px bg-blossom-100" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold text-blossom-600">{total}</span>
            <span className="text-xs text-[#9a7d84]">누적 리셋</span>
          </div>
        </div>

        {sessions.length === 0 ? (
          <p className="text-sm text-[#9a7d84]">아직 기록이 없어요. 첫 3분을 시작해 보세요.</p>
        ) : (
          <ul className="flex w-full flex-col gap-2">
            {sessions.map((s) => {
              const mood = getMood(s.moodId);
              return (
                <li
                  key={s.timestamp}
                  className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3"
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-[#6b4a52]">{mood.label}</span>
                    <span className="text-xs text-[#9a7d84]">{s.date}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          href="/"
          className="w-full max-w-xs rounded-full bg-blossom-500 py-3 text-center font-medium text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          3분 리셋하러 가기
        </Link>
      </div>
    </main>
  );
}

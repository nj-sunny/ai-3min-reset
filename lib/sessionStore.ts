import { MoodId } from "./moods";

const STORAGE_KEY = "reset3_sessions_v1";
const SESSION_MINUTES = 3;

export interface SessionRecord {
  date: string; // YYYY-MM-DD
  moodId: MoodId;
  timestamp: number;
}

function readAll(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: SessionRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addSession(moodId: MoodId): SessionRecord {
  const now = new Date();
  const record: SessionRecord = {
    date: toDateKey(now),
    moodId,
    timestamp: now.getTime(),
  };
  const all = readAll();
  all.push(record);
  writeAll(all);
  notifyListeners();
  return record;
}

export function getSessions(): SessionRecord[] {
  return readAll().sort((a, b) => b.timestamp - a.timestamp);
}

export function getTotalCount(): number {
  return readAll().length;
}

export function getTodayMinutes(): number {
  const todayKey = toDateKey(new Date());
  const count = readAll().filter((r) => r.date === todayKey).length;
  return count * SESSION_MINUTES;
}

export function getStreak(): number {
  const days = new Set(readAll().map((r) => r.date));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = toDateKey(cursor);
    if (!days.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface HistorySnapshot {
  sessions: SessionRecord[];
  streak: number;
  total: number;
  todayMinutes: number;
}

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSnapshot: HistorySnapshot | null = null;
const EMPTY_SNAPSHOT: HistorySnapshot = { sessions: [], streak: 0, total: 0, todayMinutes: 0 };

function notifyListeners() {
  listeners.forEach((l) => l());
}

// useSyncExternalStore-compatible accessors so History page reads localStorage
// without calling setState inside an effect (localStorage is an external store).
export function subscribeSessions(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSessionsSnapshot(): HistorySnapshot {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (cachedSnapshot && raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = {
    sessions: getSessions(),
    streak: getStreak(),
    total: getTotalCount(),
    todayMinutes: getTodayMinutes(),
  };
  return cachedSnapshot;
}

export function getSessionsServerSnapshot(): HistorySnapshot {
  return EMPTY_SNAPSHOT;
}

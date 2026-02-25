export type ActivityTone = "success" | "review" | "risk";

export type AdminProcessId =
  | "dashboard"
  | "content-operations"
  | "talent-acquisition"
  | "rights-management"
  | "communication-preferences"
  | "cookie-consents"
  | "event-attendance";

export interface AdminActivityItem {
  id: string;
  title: string;
  detail: string;
  tone: ActivityTone;
  processId?: AdminProcessId;
  timestamp: number;
}

interface ProcessState {
  id: AdminProcessId;
  title: string;
  totalSteps: number;
  completedSteps: number;
  started: boolean;
}

export interface AdminActivitySnapshot {
  sessionId: string;
  loginAt: number;
  activities: AdminActivityItem[];
  processes: ProcessState[];
  totalCompletedActions: number;
  totalRemainingSteps: number;
}

type TrackPayload = {
  title: string;
  detail: string;
  tone?: ActivityTone;
  processId?: AdminProcessId;
  completedStepDelta?: number;
  started?: boolean;
};

const STORAGE_KEY = "admin-dashboard-activity-v1";
const SESSION_KEY = "admin-dashboard-session-id-v1";
const EVENT_NAME = "admin-dashboard-activity-updated";
const MAX_ACTIVITIES = 40;

const PROCESS_BLUEPRINT: Record<AdminProcessId, { title: string; totalSteps: number }> = {
  dashboard: { title: "Dashboard Review", totalSteps: 2 },
  "content-operations": { title: "Content Operations", totalSteps: 8 },
  "talent-acquisition": { title: "Talent Acquisition", totalSteps: 10 },
  "rights-management": { title: "Rights Management", totalSteps: 4 },
  "communication-preferences": { title: "Communication Preferences", totalSteps: 3 },
  "cookie-consents": { title: "Cookie Consents", totalSteps: 3 },
  "event-attendance": { title: "Event Attendance Hub", totalSteps: 4 },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createEmptySnapshot = (sessionId: string): AdminActivitySnapshot => {
  const processes = (Object.keys(PROCESS_BLUEPRINT) as AdminProcessId[]).map((id) => ({
    id,
    title: PROCESS_BLUEPRINT[id].title,
    totalSteps: PROCESS_BLUEPRINT[id].totalSteps,
    completedSteps: 0,
    started: false,
  }));

  return {
    sessionId,
    loginAt: Date.now(),
    activities: [],
    processes,
    totalCompletedActions: 0,
    totalRemainingSteps: processes.reduce((sum, item) => sum + item.totalSteps, 0),
  };
};

const canUseStorage = () => typeof window !== "undefined" && typeof localStorage !== "undefined";

const readSnapshot = (): AdminActivitySnapshot | null => {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminActivitySnapshot;
  } catch {
    return null;
  }
};

const recalcTotals = (snapshot: AdminActivitySnapshot): AdminActivitySnapshot => {
  const totalRemainingSteps = snapshot.processes.reduce((sum, process) => {
    return sum + Math.max(0, process.totalSteps - process.completedSteps);
  }, 0);

  return {
    ...snapshot,
    totalRemainingSteps,
  };
};

const writeSnapshot = (snapshot: AdminActivitySnapshot) => {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recalcTotals(snapshot)));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

const getSessionId = () => {
  if (!canUseStorage()) return "server";
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem(SESSION_KEY, next);
  return next;
};

export const initializeAdminSession = () => {
  if (!canUseStorage()) return;
  const sessionId = getSessionId();
  const existing = readSnapshot();
  if (existing && existing.sessionId === sessionId) return;

  const next = createEmptySnapshot(sessionId);
  writeSnapshot(next);
};

export const trackAdminActivity = ({
  title,
  detail,
  tone = "review",
  processId,
  completedStepDelta = 0,
  started = false,
}: TrackPayload) => {
  if (!canUseStorage()) return;
  const sessionId = getSessionId();
  const snapshot = readSnapshot() ?? createEmptySnapshot(sessionId);

  if (snapshot.sessionId !== sessionId) {
    const fresh = createEmptySnapshot(sessionId);
    writeSnapshot(fresh);
    return trackAdminActivity({ title, detail, tone, processId, completedStepDelta, started });
  }

  const activities: AdminActivityItem[] = [
    {
      id: `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      detail,
      tone,
      processId,
      timestamp: Date.now(),
    },
    ...snapshot.activities,
  ].slice(0, MAX_ACTIVITIES);

  const processes = snapshot.processes.map((process) => {
    if (!processId || process.id !== processId) return process;
    const nextCompleted = clamp(process.completedSteps + completedStepDelta, 0, process.totalSteps);
    return {
      ...process,
      started: process.started || started || completedStepDelta > 0,
      completedSteps: nextCompleted,
    };
  });

  const next: AdminActivitySnapshot = recalcTotals({
    ...snapshot,
    activities,
    processes,
    totalCompletedActions: snapshot.totalCompletedActions + Math.max(0, completedStepDelta),
  });

  writeSnapshot(next);
};

export const getAdminActivitySnapshot = (): AdminActivitySnapshot => {
  const sessionId = getSessionId();
  return readSnapshot() ?? createEmptySnapshot(sessionId);
};

export const subscribeAdminActivity = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};

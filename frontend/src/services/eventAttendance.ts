import axios from "axios";

export type AttendanceStatus = "registered" | "attended" | "missed";

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  currentRole: string;
  organization: string;
  originCity: string;
  contact?: string;
  consent: boolean;
  registeredAt: string;
  attendanceStatus: AttendanceStatus;
  attendanceUpdatedAt?: string;
}

type Listener = () => void;

const UPDATE_EVENT = "proteccio:event-registrations-updated";
const listeners = new Set<Listener>();

let cache: EventRegistration[] = [];
let initialized = false;
let isRefreshing = false;

const sortByRecent = (value: EventRegistration[]) =>
  [...value].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

const notify = () => {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
};

const writeStore = (value: EventRegistration[]) => {
  cache = sortByRecent(value);
  notify();
};

const readApiRows = (payload: unknown): EventRegistration[] => {
  if (!payload || typeof payload !== "object") return [];
  const maybe = payload as { data?: unknown };
  if (!Array.isArray(maybe.data)) return [];
  return sortByRecent(maybe.data as EventRegistration[]);
};

const hydrate = () => {
  cache = [];
  initialized = true;
};

const refreshFromApi = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const response = await axios.get("/api/event-registrations");
    const rows = readApiRows(response.data);
    if (rows.length > 0 || cache.length === 0) {
      writeStore(rows);
    }
  } catch (error) {
    console.error("Failed to load event registrations from backend.", error);
  } finally {
    isRefreshing = false;
  }
};

const ensureInitialized = () => {
  if (initialized) return;
  hydrate();
};

export const eventAttendanceService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    ensureInitialized();
    void refreshFromApi();
    return () => listeners.delete(listener);
  },

  getRegistrations() {
    ensureInitialized();
    void refreshFromApi();
    return sortByRecent(cache);
  },

  register(input: Omit<EventRegistration, "id" | "registeredAt" | "attendanceStatus" | "attendanceUpdatedAt">) {
    ensureInitialized();
    const all = this.getRegistrations();
    const existing = all.find(
      (item) => item.eventId === input.eventId && item.email.trim().toLowerCase() === input.email.trim().toLowerCase()
    );

    if (existing) {
      const updated = all.map((item) =>
        item.id === existing.id
          ? {
              ...item,
              ...input,
              email: input.email.trim(),
              fullName: input.fullName.trim(),
              currentRole: input.currentRole.trim(),
              organization: input.organization.trim(),
              originCity: input.originCity.trim(),
              contact: input.contact?.trim(),
            }
          : item
      );
      writeStore(updated);
      void axios.post("/api/event-registrations", input).catch((error) => {
        console.error("Failed to upsert event registration on backend.", error);
        void refreshFromApi();
      });
      return existing.id;
    }

    const next: EventRegistration = {
      id: `evtreg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      registeredAt: new Date().toISOString(),
      attendanceStatus: "registered",
      ...input,
      email: input.email.trim(),
      fullName: input.fullName.trim(),
      currentRole: input.currentRole.trim(),
      organization: input.organization.trim(),
      originCity: input.originCity.trim(),
      contact: input.contact?.trim(),
    };
    writeStore([next, ...all]);
    void axios
      .post("/api/event-registrations", input)
      .then((response) => {
        const data = response.data as { id?: string } | undefined;
        const createdId = typeof data?.id === "string" ? data.id : null;
        if (!createdId) {
          void refreshFromApi();
          return;
        }
        const updated = cache.map((item) => (item.id === next.id ? { ...item, id: createdId } : item));
        writeStore(updated);
      })
      .catch((error) => {
        console.error("Failed to create event registration on backend.", error);
      });
    return next.id;
  },

  updateAttendanceStatus(registrationId: string, status: AttendanceStatus) {
    ensureInitialized();
    const all = this.getRegistrations();
    writeStore(
      all.map((item) =>
        item.id === registrationId ? { ...item, attendanceStatus: status, attendanceUpdatedAt: new Date().toISOString() } : item
      )
    );

    void axios.patch(`/api/event-registrations/${registrationId}/status`, { status }).catch((error) => {
      console.error("Failed to update attendance status on backend.", error);
      void refreshFromApi();
    });
  },
};

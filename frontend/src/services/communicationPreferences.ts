import axios from "axios";
import type {
  CommunicationPreferenceInput,
  CommunicationPreferenceRecord,
  CommunicationPreferenceStatus,
  CommunicationPreferences,
} from "../types/communication";

type Listener = () => void;

const UPDATE_EVENT = "proteccio:communication-preferences-updated";
const listeners = new Set<Listener>();

const defaultPreferences: CommunicationPreferences = {
  newsletters: true,
  productUpdates: true,
  promotionalOffers: false,
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const deriveStatus = (preferences: CommunicationPreferences): CommunicationPreferenceStatus => {
  const hasAnyOptIn = Object.values(preferences).some(Boolean);
  return hasAnyOptIn ? "subscribed" : "unsubscribed";
};

const sortByRecent = (records: CommunicationPreferenceRecord[]) =>
  [...records].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

const writeStore = (records: CommunicationPreferenceRecord[]) => {
  cache = sortByRecent(records);
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
};

const getNextId = (records: CommunicationPreferenceRecord[]) => {
  const year = new Date().getFullYear();
  const maxSeq = records.reduce((max, item) => {
    const match = item.id.match(/COMM-\d{4}-(\d+)/);
    if (!match) return max;
    const seq = Number.parseInt(match[1], 10);
    return Number.isFinite(seq) ? Math.max(max, seq) : max;
  }, 0);
  return `COMM-${year}-${String(maxSeq + 1).padStart(3, "0")}`;
};

const coercePreferences = (preferences: Partial<CommunicationPreferences>): CommunicationPreferences => ({
  newsletters: preferences.newsletters ?? false,
  productUpdates: preferences.productUpdates ?? false,
  promotionalOffers: preferences.promotionalOffers ?? false,
});

let cache: CommunicationPreferenceRecord[] = [];
let initialized = false;
let isRefreshing = false;

const readApiRows = (payload: unknown): CommunicationPreferenceRecord[] => {
  if (!payload || typeof payload !== "object") return [];
  const maybe = payload as { data?: unknown };
  if (!Array.isArray(maybe.data)) return [];
  return sortByRecent(maybe.data as CommunicationPreferenceRecord[]);
};

const hydrate = () => {
  cache = [];
  initialized = true;
};

const refreshFromApi = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const response = await axios.get("/api/communication-preferences");
    const rows = readApiRows(response.data);
    if (rows.length > 0 || cache.length === 0) {
      writeStore(rows);
    }
  } catch (error) {
    console.error("Failed to load communication preferences from backend.", error);
  } finally {
    isRefreshing = false;
  }
};

const ensureInitialized = () => {
  if (initialized) return;
  hydrate();
};

export const communicationPreferencesService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    ensureInitialized();
    void refreshFromApi();
    return () => listeners.delete(listener);
  },

  getAll() {
    ensureInitialized();
    void refreshFromApi();
    return sortByRecent(cache);
  },

  getByEmail(email: string) {
    ensureInitialized();
    const normalized = normalizeEmail(email);
    if (!normalized) return null;
    const existing = sortByRecent(cache).find((item) => normalizeEmail(item.email) === normalized) ?? null;
    if (!existing) {
      void axios
        .get(`/api/communication-preferences/email/${encodeURIComponent(normalized)}`)
        .then((response) => {
          const data = (response.data as { data?: CommunicationPreferenceRecord } | undefined)?.data;
          if (!data) return;
          const withoutDuplicate = cache.filter((item) => item.id !== data.id && normalizeEmail(item.email) !== normalized);
          writeStore([data, ...withoutDuplicate]);
        })
        .catch(() => {
          // Ignore lookup failures silently.
        });
    }
    return existing;
  },

  upsertFromPreferenceCenter(input: CommunicationPreferenceInput) {
    ensureInitialized();
    const all = this.getAll();
    const normalizedEmail = normalizeEmail(input.email);
    const normalizedName = input.fullName.trim();
    if (!normalizedEmail) {
      throw new Error("Email is required to save communication preferences.");
    }

    const now = new Date().toISOString();
    const normalizedPreferences = coercePreferences(input.preferences ?? defaultPreferences);
    const status = deriveStatus(normalizedPreferences);

    const existing = all.find((item) => normalizeEmail(item.email) === normalizedEmail);
    if (existing) {
      const updated: CommunicationPreferenceRecord = {
        ...existing,
        fullName: normalizedName || existing.fullName,
        email: normalizedEmail,
        preferences: normalizedPreferences,
        status,
        source: "preference_center",
        lastUpdated: now,
        lastUpdatedBy: "Preference Center",
      };
      writeStore(all.map((item) => (item.id === existing.id ? updated : item)));
      void axios.post("/api/communication-preferences", {
        fullName: updated.fullName,
        email: updated.email,
        preferences: updated.preferences,
      }).catch((error) => {
        console.error("Failed to update communication preferences on backend.", error);
        void refreshFromApi();
      });
      return updated;
    }

    const created: CommunicationPreferenceRecord = {
      id: getNextId(all),
      fullName: normalizedName || "Website User",
      email: normalizedEmail,
      preferences: normalizedPreferences,
      status,
      source: "preference_center",
      consentCapturedAt: now,
      lastUpdated: now,
      lastUpdatedBy: "Preference Center",
    };
    writeStore([created, ...all]);
    void axios.post("/api/communication-preferences", {
      fullName: created.fullName,
      email: created.email,
      preferences: created.preferences,
    }).catch((error) => {
      console.error("Failed to create communication preferences on backend.", error);
      void refreshFromApi();
    });
    return created;
  },

  updateStatus(id: string, status: CommunicationPreferenceStatus, actor = "Admin Console") {
    ensureInitialized();
    const all = this.getAll();
    const now = new Date().toISOString();
    writeStore(
      all.map((item) => {
        if (item.id !== id) return item;
        const nextPreferences =
          status === "unsubscribed"
            ? { newsletters: false, productUpdates: false, promotionalOffers: false }
            : item.preferences;

        return {
          ...item,
          status: deriveStatus(nextPreferences),
          preferences: nextPreferences,
          source: "admin_console",
          lastUpdated: now,
          lastUpdatedBy: actor,
        };
      })
    );
    void axios.patch(`/api/communication-preferences/${id}/status`, { status, actor }).catch((error) => {
      console.error("Failed to update communication status on backend.", error);
      void refreshFromApi();
    });
  },

  updatePreferences(id: string, preferences: CommunicationPreferences, actor = "Admin Console") {
    ensureInitialized();
    const all = this.getAll();
    const now = new Date().toISOString();
    const nextPreferences = coercePreferences(preferences);
    writeStore(
      all.map((item) =>
        item.id === id
          ? {
              ...item,
              preferences: nextPreferences,
              status: deriveStatus(nextPreferences),
              source: "admin_console",
              lastUpdated: now,
              lastUpdatedBy: actor,
            }
          : item
      )
    );
    void axios.patch(`/api/communication-preferences/${id}/preferences`, { preferences: nextPreferences, actor }).catch((error) => {
      console.error("Failed to update communication channels on backend.", error);
      void refreshFromApi();
    });
  },
};

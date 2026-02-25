import axios from "axios";
import Cookies from "js-cookie";

export type ConsentStatus = "accepted_all" | "rejected_all" | "custom";

export interface CookieConsentRecord {
  id: string;
  ipAddress: string;
  state: string;
  country: string;
  status: ConsentStatus;
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  consentDate: string;
  lastUpdated: string;
  source: "banner_accept" | "banner_decline" | "preference_center";
  cookieSnapshot: Record<string, string | undefined>;
}

type Listener = () => void;

const SESSION_IP_KEY = "proteccio-cookie-session-ip";
const SESSION_GEO_HINT_KEY = "proteccio-cookie-geo-hint";
const UPDATE_EVENT = "proteccio:cookie-consents-updated";
const listeners = new Set<Listener>();

const safeJsonParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const getSessionIpAddress = () => {
  const existing = sessionStorage.getItem(SESSION_IP_KEY);
  if (existing) return existing;
  const next = `10.${Math.floor(Math.random() * 220) + 20}.${Math.floor(Math.random() * 240) + 10}.${Math.floor(
    Math.random() * 240
  ) + 10}`;
  sessionStorage.setItem(SESSION_IP_KEY, next);
  return next;
};

const getClientGeoHint = async (): Promise<{ ipAddress?: string; state?: string; country?: string }> => {
  if (typeof window === "undefined") return {};

  const cached = sessionStorage.getItem(SESSION_GEO_HINT_KEY);
  if (cached) {
    const parsed = safeJsonParse<{ ipAddress?: string; state?: string; country?: string }>(cached, {});
    if (parsed.ipAddress || parsed.state || parsed.country) return parsed;
  }

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2200);
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    window.clearTimeout(timeout);
    if (!response.ok) return {};
    const payload = (await response.json()) as {
      ip?: string;
      region?: string;
      country_name?: string;
    };
    const hint = {
      ipAddress: payload.ip?.trim() || undefined,
      state: payload.region?.trim() || undefined,
      country: payload.country_name?.trim() || undefined,
    };
    sessionStorage.setItem(SESSION_GEO_HINT_KEY, JSON.stringify(hint));
    if (hint.ipAddress) {
      sessionStorage.setItem(SESSION_IP_KEY, hint.ipAddress);
    }
    return hint;
  } catch {
    return {};
  }
};

let cache: CookieConsentRecord[] = [];
let initialized = false;
let isRefreshing = false;

const sortByRecent = (records: CookieConsentRecord[]) =>
  [...records].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

const writeStore = (records: CookieConsentRecord[]) => {
  cache = sortByRecent(records);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
  listeners.forEach((listener) => listener());
};

const getNextId = (records: CookieConsentRecord[]) => {
  const year = new Date().getFullYear();
  const maxSeq = records.reduce((max, item) => {
    const match = item.id.match(/CONS-\d{4}-(\d+)/);
    if (!match) return max;
    const seq = Number.parseInt(match[1], 10);
    return Number.isFinite(seq) ? Math.max(max, seq) : max;
  }, 0);
  return `CONS-${year}-${String(maxSeq + 1).padStart(3, "0")}`;
};

const readApiRows = (payload: unknown): CookieConsentRecord[] => {
  if (!payload || typeof payload !== "object") return [];
  const maybe = payload as { data?: unknown };
  if (!Array.isArray(maybe.data)) return [];
  return sortByRecent(maybe.data as CookieConsentRecord[]);
};

const hydrate = () => {
  cache = [];
  initialized = true;
};

const refreshFromApi = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const response = await axios.get("/api/cookie-consents");
    const rows = readApiRows(response.data);
    if (rows.length > 0 || cache.length === 0) {
      writeStore(rows);
    }
  } catch (error) {
    console.error("Failed to load cookie consents from backend.", error);
  } finally {
    isRefreshing = false;
  }
};

const ensureInitialized = () => {
  if (initialized) return;
  hydrate();
};

export const cookieConsentsService = {
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

  logConsentDecision(input: {
    status: ConsentStatus;
    essential: boolean;
    analytics: boolean;
    personalization: boolean;
    marketing: boolean;
    source: CookieConsentRecord["source"];
  }) {
    ensureInitialized();
    const all = this.getAll();
    const ipAddress = getSessionIpAddress();
    const now = new Date().toISOString();
    const cookieSnapshot: CookieConsentRecord["cookieSnapshot"] = {
      "cookie-consent": Cookies.get("cookie-consent"),
      "cookie-consent-necessary": Cookies.get("cookie-consent-necessary"),
      "cookie-consent-analytics": Cookies.get("cookie-consent-analytics"),
      "cookie-consent-marketing": Cookies.get("cookie-consent-marketing"),
      page_views: Cookies.get("page_views"),
      first_visit: Cookies.get("first_visit"),
    };

    const existing = all.find((item) => item.ipAddress === ipAddress);
    if (existing) {
      const optimistic = all.map((item) =>
        item.id === existing.id
          ? {
              ...item,
              ...input,
              state: item.state || "Unknown",
              country: item.country || "Unknown",
              cookieSnapshot,
              lastUpdated: now,
            }
          : item
      );
      writeStore(optimistic);
      void (async () => {
        const geoHint = await getClientGeoHint();
        return axios.post("/api/cookie-consents", {
          ...input,
          ...geoHint,
          cookieSnapshot,
        });
      })()
        .then((response) => {
          const data = (response.data as { data?: CookieConsentRecord } | undefined)?.data;
          if (!data) {
            void refreshFromApi();
            return;
          }
          const merged = cache.filter((item) => item.id !== existing.id && item.id !== data.id);
          writeStore([data, ...merged]);
        })
        .catch((error) => {
          console.error("Failed to persist cookie consent update on backend.", error);
          void refreshFromApi();
        });
      return;
    }

    const next: CookieConsentRecord = {
      id: getNextId(all),
      ipAddress,
      state: "Unknown",
      country: "Unknown",
      ...input,
      consentDate: now,
      lastUpdated: now,
      cookieSnapshot,
    };
    writeStore([next, ...all]);
    void (async () => {
      const geoHint = await getClientGeoHint();
      return axios.post("/api/cookie-consents", {
        ...input,
        ...geoHint,
        cookieSnapshot,
      });
    })()
      .then((response) => {
        const data = (response.data as { data?: CookieConsentRecord } | undefined)?.data;
        if (!data) {
          void refreshFromApi();
          return;
        }
        const merged = cache.filter((item) => item.id !== next.id && item.id !== data.id);
        writeStore([data, ...merged]);
      })
      .catch((error) => {
        console.error("Failed to create cookie consent on backend.", error);
        void refreshFromApi();
      });
  },
};

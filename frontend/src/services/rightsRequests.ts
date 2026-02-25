import axios from "axios";

export type RightsRequestStatus = "pending" | "in_progress" | "completed";

export interface RightsRequestPayload {
  requestType: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  relationship: string;
  complaintReason: string;
  complaintReasonOther: string;
  complaintTarget: string;
  complaintTargetOther: string;
  accessExplanation: string;
  grievanceExplanation: string;
  correctionType: string;
  nomineeRelationship: string;
  nomineeName: string;
  nomineeEstablishment: string;
  consents: {
    accuracy: boolean;
    verification: boolean;
  };
}

export interface RightsRequestRecord extends RightsRequestPayload {
  id: string;
  createdAt: string;
  status: RightsRequestStatus;
}

type Listener = () => void;

const UPDATE_EVENT = "proteccio:rights-requests-updated";
const listeners = new Set<Listener>();

let cache: RightsRequestRecord[] = [];
let initialized = false;
let isRefreshing = false;

const sortByRecent = (value: RightsRequestRecord[]) =>
  [...value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const notify = () => {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
};

const writeStore = (value: RightsRequestRecord[]) => {
  cache = sortByRecent(value);
  notify();
};

const getNextId = (items: RightsRequestRecord[]) => {
  const year = new Date().getFullYear();
  const maxSeq = items.reduce((max, item) => {
    const match = item.id.match(/DSR-\d{4}-(\d+)/);
    if (!match) return max;
    const seq = Number.parseInt(match[1], 10);
    return Number.isFinite(seq) ? Math.max(max, seq) : max;
  }, 0);
  const nextSeq = String(maxSeq + 1).padStart(3, "0");
  return `DSR-${year}-${nextSeq}`;
};

const readApiRows = (payload: unknown): RightsRequestRecord[] => {
  if (!payload || typeof payload !== "object") return [];
  const maybe = payload as { data?: unknown };
  if (!Array.isArray(maybe.data)) return [];
  return sortByRecent(maybe.data as RightsRequestRecord[]);
};

const hydrate = () => {
  cache = [];
  initialized = true;
};

const refreshFromApi = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const response = await axios.get("/api/rights-requests");
    const rows = readApiRows(response.data);
    if (rows.length > 0 || cache.length === 0) {
      writeStore(rows);
    }
  } catch (error) {
    console.error("Failed to load rights requests from backend.", error);
  } finally {
    isRefreshing = false;
  }
};

const ensureInitialized = () => {
  if (initialized) return;
  hydrate();
};

export const rightsRequestsService = {
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

  async create(payload: RightsRequestPayload) {
    ensureInitialized();
    const all = this.getAll();
    const optimisticId = getNextId(all);
    const now = new Date().toISOString();
    const draft: RightsRequestRecord = {
      ...payload,
      id: optimisticId,
      createdAt: now,
      status: "pending",
    };

    writeStore([draft, ...all]);
    try {
      const response = await axios.post("/api/rights-requests", payload);
      const data = (response.data as { data?: RightsRequestRecord } | undefined)?.data;
      if (!data) {
        throw new Error("Invalid rights request response from backend");
      }

      const withoutDraft = cache.filter((item) => item.id !== optimisticId);
      writeStore([data, ...withoutDraft]);
      return data;
    } catch (error) {
      console.error("Failed to create rights request on backend.", error);
      writeStore(cache.filter((item) => item.id !== optimisticId));
      throw error;
    }
  },

  updateStatus(id: string, status: RightsRequestStatus) {
    ensureInitialized();
    const all = this.getAll();
    writeStore(all.map((item) => (item.id === id ? { ...item, status } : item)));

    void axios.patch(`/api/rights-requests/${id}/status`, { status }).catch((error) => {
      console.error("Failed to update rights request status on backend.", error);
      void refreshFromApi();
    });
  },
};

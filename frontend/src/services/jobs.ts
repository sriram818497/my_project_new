import axios from "axios";
import type { RecruitmentJob } from "../types/recruitment";

const STORAGE_KEY = "proteccio-jobs";
const UPDATE_EVENT = "proteccio:jobs-updated";
const JOB_CODE_PATTERN = /^[A-Z]{3}-\d{4}-\d{3}$/;
type Listener = () => void;
const listeners = new Set<Listener>();

const nowIso = () => new Date().toISOString();
const dateOnly = () => new Date().toISOString().slice(0, 10);

const safeReadJobsFromStorage = (): RecruitmentJob[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as RecruitmentJob[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeJobsToStorage = (jobs: RecruitmentJob[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
};

const notifyJobsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
  listeners.forEach((listener) => listener());
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

const buildNextJobCode = (jobs: RecruitmentJob[], year: number) => {
  const maxSeq = jobs.reduce((max, job) => {
    if (!job.jobCode) return max;
    const match = job.jobCode.match(/^[A-Z]{3}-(\d{4})-(\d{3})$/);
    if (!match) return max;
    const codeYear = Number.parseInt(match[1], 10);
    const seq = Number.parseInt(match[2], 10);
    if (codeYear !== year || !Number.isFinite(seq)) return max;
    return Math.max(max, seq);
  }, 0);
  return `JOB-${year}-${String(maxSeq + 1).padStart(3, "0")}`;
};

const safeReadJobsFromResponse = (payload: unknown): RecruitmentJob[] => {
  if (!payload || typeof payload !== "object") return [];
  const maybe = payload as { data?: unknown };
  if (!Array.isArray(maybe.data)) return [];
  return maybe.data as RecruitmentJob[];
};

const safeReadJobFromResponse = (payload: unknown): RecruitmentJob | null => {
  if (!payload || typeof payload !== "object") return null;
  const maybe = payload as { data?: unknown };
  if (!maybe.data || typeof maybe.data !== "object") return null;
  return maybe.data as RecruitmentJob;
};

export const jobsService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  async getAllJobs(): Promise<RecruitmentJob[]> {
    try {
      const response = await axios.get("/api/jobs");
      const jobs = safeReadJobsFromResponse(response.data);
      if (jobs.length > 0) {
        writeJobsToStorage(jobs);
      }
      return jobs;
    } catch (error) {
      console.error("Failed to fetch jobs from API. Falling back to local cache.", error);
      return safeReadJobsFromStorage();
    }
  },

  async getPublishedJobs(): Promise<RecruitmentJob[]> {
    try {
      const response = await axios.get("/api/jobs/published");
      return safeReadJobsFromResponse(response.data);
    } catch (error) {
      console.error("Failed to fetch published jobs from API. Falling back to cached logic.", error);
      const all = await this.getAllJobs();
      return all.filter((job) => job.status === "published");
    }
  },

  async getJobById(id: string): Promise<RecruitmentJob | null> {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      const data = safeReadJobFromResponse(response.data);
      return data ?? null;
    } catch {
      const all = await this.getAllJobs();
      return all.find((job) => job.id === id) ?? null;
    }
  },

  async setAllJobs(_jobs: RecruitmentJob[]): Promise<void> {
    void _jobs;
    notifyJobsChanged();
  },

  async createJob(payload: Omit<RecruitmentJob, "id" | "createdAt" | "updatedAt">): Promise<RecruitmentJob> {
    const jobs = await this.getAllJobs();
    const baseId = slugify(payload.title) || "job";
    const candidate = `${baseId}-${Date.now().toString().slice(-6)}`;
    const postedDate = payload.postedDate || dateOnly();
    const year = Number(postedDate.slice(0, 4)) || new Date().getFullYear();

    const job: RecruitmentJob = {
      ...payload,
      id: candidate,
      jobCode:
        payload.jobCode && JOB_CODE_PATTERN.test(payload.jobCode)
          ? payload.jobCode
          : buildNextJobCode(jobs, year),
      postedDate,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    const response = await axios.post("/api/jobs", job);
    notifyJobsChanged();
    const created = safeReadJobFromResponse(response.data);
    return created ?? job;
  },

  async updateJob(id: string, patch: Partial<RecruitmentJob>): Promise<RecruitmentJob | null> {
    const response = await axios.patch(`/api/jobs/${id}`, patch);
    notifyJobsChanged();
    const updated = safeReadJobFromResponse(response.data);
    return updated;
  },

  async deleteJob(id: string): Promise<void> {
    await axios.delete(`/api/jobs/${id}`);
    notifyJobsChanged();
  },
};

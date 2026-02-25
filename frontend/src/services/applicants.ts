import axios from "axios";
import { APPLICANTS_SEED } from "../data/applicantsSeed";
import type {
  ApplicantGender,
  ApplicantProfile,
  ApplicantRoundEvaluation,
  ApplicantRoundEvaluations,
  ApplicantStage,
  ApplicantStageRatings,
} from "../types/applicant";

const UPDATED_EVENT = "proteccio:applicants-updated";
const nowIso = () => new Date().toISOString();

const seedGenderById = new Map<string, ApplicantGender>(
  APPLICANTS_SEED.filter((item) => Boolean(item.gender)).map((item) => [item.id, item.gender as ApplicantGender])
);
const seedGenderByEmail = new Map<string, ApplicantGender>(
  APPLICANTS_SEED.filter((item) => Boolean(item.gender)).map((item) => [item.email.toLowerCase(), item.gender as ApplicantGender])
);
const seedGenderByName = new Map<string, ApplicantGender>(
  APPLICANTS_SEED.filter((item) => Boolean(item.gender)).map((item) => [item.name.trim().toLowerCase(), item.gender as ApplicantGender])
);

const resolveFallbackGender = (applicant: ApplicantProfile): ApplicantGender | undefined => {
  const byId = seedGenderById.get(applicant.id);
  if (byId) return byId;
  const byEmail = seedGenderByEmail.get((applicant.email || "").toLowerCase());
  if (byEmail) return byEmail;
  const byName = seedGenderByName.get((applicant.name || "").trim().toLowerCase());
  if (byName) return byName;
  return undefined;
};

const cloneSeed = () =>
  APPLICANTS_SEED.map((a) => ({
    ...a,
    notes: [...a.notes],
    skills: [...a.skills],
    stageHistory: [...a.stageHistory],
    stageRatings: { ...(a.stageRatings || {}) },
    roundEvaluations: { ...(a.roundEvaluations || {}) },
  }));

const ratingStages: ApplicantStage[] = [
  "Applied",
  "Screening",
  "Task Assigned",
  "Task Submitted",
  "Interview",
  "Selected",
];

const clampRating = (value: number) => Math.min(5, Math.max(1, Math.round(value)));

const uniqueCompletedStages = (applicant: ApplicantProfile): ApplicantStage[] => {
  const set = new Set<ApplicantStage>();
  applicant.stageHistory.forEach((entry) => {
    if (ratingStages.includes(entry.stage)) set.add(entry.stage);
  });
  if (ratingStages.includes(applicant.stage)) set.add(applicant.stage);
  return ratingStages.filter((stage) => set.has(stage));
};

const sanitizeStageRatings = (ratings?: ApplicantStageRatings) => {
  const sanitized: ApplicantStageRatings = {};
  if (!ratings) return sanitized;
  Object.entries(ratings).forEach(([stage, value]) => {
    if (!ratingStages.includes(stage as ApplicantStage)) return;
    if (typeof value !== "number" || !Number.isFinite(value)) return;
    sanitized[stage as ApplicantStage] = clampRating(value);
  });
  return sanitized;
};

const sanitizeRoundEvaluation = (value: ApplicantRoundEvaluation): ApplicantRoundEvaluation => ({
  interviewerName: (value.interviewerName || "").trim(),
  internalNote: (value.internalNote || "").trim(),
  updatedAt: value.updatedAt || nowIso(),
});

const sanitizeRoundEvaluations = (evaluations?: ApplicantRoundEvaluations) => {
  const sanitized: ApplicantRoundEvaluations = {};
  if (!evaluations) return sanitized;
  Object.entries(evaluations).forEach(([stage, value]) => {
    if (!ratingStages.includes(stage as ApplicantStage)) return;
    if (!value) return;
    sanitized[stage as ApplicantStage] = sanitizeRoundEvaluation(value);
  });
  return sanitized;
};

const deriveOverallRating = (applicant: ApplicantProfile, ratings: ApplicantStageRatings) => {
  const completed = uniqueCompletedStages(applicant);
  const values = completed
    .map((stage) => ratings[stage])
    .filter((value): value is number => typeof value === "number");
  if (!values.length) return clampRating(applicant.rating || 3);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return clampRating(avg);
};

const normalizeApplicant = (applicant: ApplicantProfile): ApplicantProfile => {
  const ratings = sanitizeStageRatings(applicant.stageRatings);
  if (!Object.keys(ratings).length && typeof applicant.rating === "number" && Number.isFinite(applicant.rating)) {
    ratings[applicant.stage] = clampRating(applicant.rating);
  }
  const gender = applicant.gender || resolveFallbackGender(applicant);
  return {
    ...applicant,
    gender,
    rating: deriveOverallRating(applicant, ratings),
    stageRatings: ratings,
    roundEvaluations: sanitizeRoundEvaluations(applicant.roundEvaluations),
  };
};

const notifyApplicantsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATED_EVENT));
  }
};

const safeReadApplicants = (payload: unknown): ApplicantProfile[] => {
  if (!payload || typeof payload !== "object") return [];
  const maybe = payload as { data?: unknown };
  if (!Array.isArray(maybe.data)) return [];
  return (maybe.data as ApplicantProfile[]).map(normalizeApplicant);
};

export const applicantsService = {
  async getAll(): Promise<ApplicantProfile[]> {
    try {
      const response = await axios.get("/api/applicants");
      return safeReadApplicants(response.data);
    } catch (error) {
      console.error("Failed to fetch applicants from API. Falling back to seed data.", error);
      return cloneSeed().map(normalizeApplicant);
    }
  },

  async getByJob(jobId: string): Promise<ApplicantProfile[]> {
    try {
      const response = await axios.get(`/api/applicants/job/${jobId}`);
      return safeReadApplicants(response.data);
    } catch (error) {
      console.error("Failed to fetch applicants by job from API. Falling back to in-memory filter.", error);
      const all = await this.getAll();
      return all.filter((a) => a.jobId === jobId);
    }
  },

  async updateStage(id: string, stage: ApplicantStage): Promise<void> {
    await axios.patch(`/api/applicants/${id}/stage`, { stage });
    notifyApplicantsChanged();
  },

  async updateRating(id: string, rating: number): Promise<void> {
    const safe = clampRating(rating);
    await axios.patch(`/api/applicants/${id}/rating`, { rating: safe });
    notifyApplicantsChanged();
  },

  async updateStageRating(id: string, stage: ApplicantStage, rating: number): Promise<void> {
    const safe = clampRating(rating);
    await axios.patch(`/api/applicants/${id}/stage-rating`, { stage, rating: safe });
    notifyApplicantsChanged();
  },

  async updateRoundEvaluation(
    id: string,
    stage: ApplicantStage,
    payload: { interviewerName?: string; internalNote?: string }
  ): Promise<void> {
    await axios.patch(`/api/applicants/${id}/round-evaluation`, {
      stage,
      interviewerName: payload.interviewerName,
      internalNote: payload.internalNote,
    });
    notifyApplicantsChanged();
  },

  async addNote(id: string, text: string, internal = true): Promise<void> {
    await axios.post(`/api/applicants/${id}/notes`, { text, internal });
    notifyApplicantsChanged();
  },

  async assignTask(id: string, description: string, fileUrl?: string, fileName?: string): Promise<void> {
    await axios.patch(`/api/applicants/${id}/assign-task`, { description, fileUrl, fileName });
    notifyApplicantsChanged();
  },

  async submitTask(id: string, taskSubmissionUrl: string, taskSubmissionName?: string): Promise<void> {
    await axios.patch(`/api/applicants/${id}/submit-task`, { taskSubmissionUrl, taskSubmissionName });
    notifyApplicantsChanged();
  },

  async reject(id: string, reason: string): Promise<void> {
    await axios.patch(`/api/applicants/${id}/reject`, { reason });
    notifyApplicantsChanged();
  },

  subscribe(onChange: () => void): () => void {
    const onEvent = () => onChange();
    window.addEventListener(UPDATED_EVENT, onEvent);
    return () => {
      window.removeEventListener(UPDATED_EVENT, onEvent);
    };
  },
};

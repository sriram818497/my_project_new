import { Prisma, type ApplicantGender as PrismaApplicantGender, type ApplicantStage as PrismaApplicantStage } from "@prisma/client";
import { prisma } from "../../config/prisma";
import type {
  ApplicantDto,
  ApplicantRoundEvaluations,
  ApplicantStage,
  ApplicantStageRatings,
  StageHistoryEntry,
} from "./applicants.types";

const stageToPrisma: Record<ApplicantStage, PrismaApplicantStage> = {
  Applied: "Applied",
  Screening: "Screening",
  "Task Assigned": "TaskAssigned",
  "Task Submitted": "TaskSubmitted",
  Interview: "Interview",
  Selected: "Selected",
  Rejected: "Rejected",
};

const stageFromPrisma: Record<PrismaApplicantStage, ApplicantStage> = {
  Applied: "Applied",
  Screening: "Screening",
  TaskAssigned: "Task Assigned",
  TaskSubmitted: "Task Submitted",
  Interview: "Interview",
  Selected: "Selected",
  Rejected: "Rejected",
};

const genderToPrisma: Record<NonNullable<ApplicantDto["gender"]>, PrismaApplicantGender> = {
  Male: "Male",
  Female: "Female",
  "Non-Binary": "NonBinary",
  "Prefer not to say": "PreferNotToSay",
};

const genderFromPrisma: Record<PrismaApplicantGender, NonNullable<ApplicantDto["gender"]>> = {
  Male: "Male",
  Female: "Female",
  NonBinary: "Non-Binary",
  PreferNotToSay: "Prefer not to say",
};

const parseStringArray = (value: Prisma.JsonValue | null | undefined): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

const parseObject = <T>(value: Prisma.JsonValue | null | undefined, fallback: T): T => {
  if (!value || Array.isArray(value) || typeof value !== "object") return fallback;
  return value as T;
};

const parseArray = <T>(value: Prisma.JsonValue | null | undefined, fallback: T[]): T[] => {
  if (!Array.isArray(value)) return fallback;
  return value as T[];
};

const parseStageHistory = (value: Prisma.JsonValue | null | undefined): StageHistoryEntry[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { stage: "Applied" as ApplicantStage, movedAt: new Date().toISOString() };
    }
    const record = item as Record<string, unknown>;
    return {
      stage: typeof record.stage === "string" ? (record.stage as ApplicantStage) : "Applied",
      movedAt: typeof record.movedAt === "string" ? record.movedAt : new Date().toISOString(),
    };
  });
};

const toJson = (value: unknown) => value as Prisma.InputJsonValue;

const mapApplicant = (applicant: {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  gender: PrismaApplicantGender | null;
  education: string;
  location: string;
  experience: string;
  skills: Prisma.JsonValue;
  resumeUrl: string;
  resumeName: string;
  stage: PrismaApplicantStage;
  rating: number;
  stageRatings: Prisma.JsonValue | null;
  roundEvaluations: Prisma.JsonValue | null;
  notes: Prisma.JsonValue;
  rejectionReason: string | null;
  taskAssignment: Prisma.JsonValue | null;
  taskSubmissionUrl: string | null;
  taskSubmissionName: string | null;
  stageHistory: Prisma.JsonValue;
  appliedAt: Date;
  updatedAt: Date;
}): ApplicantDto => ({
  id: applicant.id,
  jobId: applicant.jobId,
  name: applicant.name,
  email: applicant.email,
  phone: applicant.phone,
  gender: applicant.gender ? genderFromPrisma[applicant.gender] : undefined,
  education: applicant.education,
  location: applicant.location,
  experience: applicant.experience,
  skills: parseStringArray(applicant.skills),
  resumeUrl: applicant.resumeUrl,
  resumeName: applicant.resumeName,
  stage: stageFromPrisma[applicant.stage],
  rating: applicant.rating,
  stageRatings: parseObject<ApplicantStageRatings>(applicant.stageRatings, {}),
  roundEvaluations: parseObject<ApplicantRoundEvaluations>(applicant.roundEvaluations, {}),
  notes: parseArray(applicant.notes, [] as ApplicantDto["notes"]),
  rejectionReason: applicant.rejectionReason ?? undefined,
  taskAssignment: parseObject(applicant.taskAssignment, undefined),
  taskSubmissionUrl: applicant.taskSubmissionUrl ?? undefined,
  taskSubmissionName: applicant.taskSubmissionName ?? undefined,
  stageHistory: parseStageHistory(applicant.stageHistory),
  appliedAt: applicant.appliedAt.toISOString(),
  updatedAt: applicant.updatedAt.toISOString(),
});

export const applicantsService = {
  async getAll() {
    const data = await prisma.applicant.findMany({
      orderBy: { appliedAt: "desc" },
    });
    return data.map(mapApplicant);
  },

  async getByJob(jobId: string) {
    const data = await prisma.applicant.findMany({
      where: { jobId },
      orderBy: { appliedAt: "desc" },
    });
    return data.map(mapApplicant);
  },

  async getById(id: string) {
    const data = await prisma.applicant.findUnique({ where: { id } });
    return data ? mapApplicant(data) : null;
  },

  async create(payload: ApplicantDto) {
    const created = await prisma.applicant.create({
      data: {
        id: payload.id,
        jobId: payload.jobId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        gender: payload.gender ? genderToPrisma[payload.gender] : null,
        education: payload.education,
        location: payload.location,
        experience: payload.experience,
        skills: payload.skills,
        resumeUrl: payload.resumeUrl,
        resumeName: payload.resumeName,
        stage: stageToPrisma[payload.stage],
        rating: payload.rating,
        stageRatings: toJson(payload.stageRatings ?? {}),
        roundEvaluations: toJson(payload.roundEvaluations ?? {}),
        notes: toJson(payload.notes ?? []),
        rejectionReason: payload.rejectionReason ?? null,
        taskAssignment: payload.taskAssignment ? toJson(payload.taskAssignment) : Prisma.JsonNull,
        taskSubmissionUrl: payload.taskSubmissionUrl ?? null,
        taskSubmissionName: payload.taskSubmissionName ?? null,
        stageHistory: toJson(payload.stageHistory ?? []),
        appliedAt: new Date(payload.appliedAt),
        updatedAt: new Date(payload.updatedAt),
      },
    });

    return mapApplicant(created);
  },

  async updateStage(id: string, stage: ApplicantStage) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;
    const nextHistory = [...parseStageHistory(existing.stageHistory), { stage, movedAt: new Date().toISOString() }];
    const updated = await prisma.applicant.update({
      where: { id },
      data: {
        stage: stageToPrisma[stage],
        stageHistory: toJson(nextHistory),
        updatedAt: new Date(),
      },
    });
    return mapApplicant(updated);
  },

  async updateRating(id: string, rating: number) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;
    const updated = await prisma.applicant.update({
      where: { id },
      data: { rating, updatedAt: new Date() },
    });
    return mapApplicant(updated);
  },

  async updateStageRating(id: string, stage: ApplicantStage, rating: number) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;
    const currentRatings = parseObject<ApplicantStageRatings>(existing.stageRatings, {});
    const nextRatings: ApplicantStageRatings = {
      ...currentRatings,
      [stage]: rating,
    };
    const updated = await prisma.applicant.update({
      where: { id },
      data: {
        stageRatings: toJson(nextRatings),
        updatedAt: new Date(),
      },
    });
    return mapApplicant(updated);
  },

  async updateRoundEvaluation(id: string, stage: ApplicantStage, payload: { interviewerName?: string; internalNote?: string }) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;

    const current = parseObject<ApplicantRoundEvaluations>(existing.roundEvaluations, {});
    const next: ApplicantRoundEvaluations = {
      ...current,
      [stage]: {
        interviewerName: payload.interviewerName ?? "",
        internalNote: payload.internalNote ?? "",
        updatedAt: new Date().toISOString(),
      },
    };

    const updated = await prisma.applicant.update({
      where: { id },
        data: { roundEvaluations: toJson(next), updatedAt: new Date() },
    });
    return mapApplicant(updated);
  },

  async addNote(id: string, payload: { text: string; internal?: boolean }) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;
    const notes = parseArray<ApplicantDto["notes"][number]>(existing.notes, []);
    const nextNotes = [
      {
        id: `${Date.now()}`,
        text: payload.text,
        internal: payload.internal ?? true,
        createdAt: new Date().toISOString(),
      },
      ...notes,
    ];
    const updated = await prisma.applicant.update({
      where: { id },
      data: { notes: toJson(nextNotes), updatedAt: new Date() },
    });
    return mapApplicant(updated);
  },

  async assignTask(id: string, payload: { description: string; fileUrl?: string; fileName?: string }) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;
    const nextStage: ApplicantStage = "Task Assigned";
    const nextHistory = [...parseStageHistory(existing.stageHistory), { stage: nextStage, movedAt: new Date().toISOString() }];
    const updated = await prisma.applicant.update({
      where: { id },
      data: {
        taskAssignment: {
          description: payload.description,
          fileUrl: payload.fileUrl,
          fileName: payload.fileName,
          assignedAt: new Date().toISOString(),
        },
        stage: stageToPrisma[nextStage],
        stageHistory: toJson(nextHistory),
        updatedAt: new Date(),
      },
    });
    return mapApplicant(updated);
  },

  async submitTask(id: string, payload: { taskSubmissionUrl: string; taskSubmissionName?: string }) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;
    const nextStage: ApplicantStage = "Task Submitted";
    const nextHistory = [...parseStageHistory(existing.stageHistory), { stage: nextStage, movedAt: new Date().toISOString() }];
    const updated = await prisma.applicant.update({
      where: { id },
      data: {
        taskSubmissionUrl: payload.taskSubmissionUrl,
        taskSubmissionName: payload.taskSubmissionName,
        stage: stageToPrisma[nextStage],
        stageHistory: toJson(nextHistory),
        updatedAt: new Date(),
      },
    });
    return mapApplicant(updated);
  },

  async reject(id: string, reason: string) {
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return null;
    const nextStage: ApplicantStage = "Rejected";
    const nextHistory = [...parseStageHistory(existing.stageHistory), { stage: nextStage, movedAt: new Date().toISOString() }];
    const updated = await prisma.applicant.update({
      where: { id },
      data: {
        stage: stageToPrisma[nextStage],
        rejectionReason: reason,
        stageHistory: toJson(nextHistory),
        updatedAt: new Date(),
      },
    });
    return mapApplicant(updated);
  },
};

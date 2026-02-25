import type { JobStatus as PrismaJobStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import type { RecruitmentJobDto } from "./jobs.types";

const jobStatusToPrisma: Record<RecruitmentJobDto["status"], PrismaJobStatus> = {
  draft: "draft",
  published: "published",
  archived: "archived",
};

const toDateOnly = (value?: string) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

const parseJsonStringArray = (value: Prisma.JsonValue | null | undefined): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

const asIsoDate = (value: Date | null | undefined) => (value ? value.toISOString().slice(0, 10) : undefined);

const mapJob = (job: {
  id: string;
  jobCode: string | null;
  title: string;
  department: string;
  location: string;
  type: string;
  education: string | null;
  experience: string | null;
  skills: Prisma.JsonValue | null;
  salaryMin: number | null;
  salaryMax: number | null;
  postedDate: Date | null;
  applicationDeadline: Date | null;
  walkIn: boolean;
  roleOverview: string;
  aboutRole: string;
  responsibilities: Prisma.JsonValue | null;
  qualifications: Prisma.JsonValue | null;
  desiredSkills: Prisma.JsonValue | null;
  status: PrismaJobStatus;
  isFeatured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): RecruitmentJobDto => ({
  id: job.id,
  jobCode: job.jobCode ?? undefined,
  title: job.title,
  department: job.department,
  location: job.location,
  type: job.type,
  education: job.education ?? undefined,
  experience: job.experience ?? undefined,
  skills: parseJsonStringArray(job.skills),
  salaryMin: job.salaryMin ?? undefined,
  salaryMax: job.salaryMax ?? undefined,
  postedDate: asIsoDate(job.postedDate),
  applicationDeadline: asIsoDate(job.applicationDeadline),
  walkIn: job.walkIn,
  roleOverview: job.roleOverview,
  aboutRole: job.aboutRole,
  responsibilities: parseJsonStringArray(job.responsibilities),
  qualifications: parseJsonStringArray(job.qualifications),
  desiredSkills: parseJsonStringArray(job.desiredSkills),
  status: job.status,
  isFeatured: job.isFeatured,
  publishedAt: job.publishedAt?.toISOString(),
  createdAt: job.createdAt.toISOString(),
  updatedAt: job.updatedAt.toISOString(),
});

export const jobsService = {
  async getAll() {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
    return jobs.map(mapJob);
  },

  async getPublished() {
    const jobs = await prisma.job.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    });
    return jobs.map(mapJob);
  },

  async getById(id: string) {
    const job = await prisma.job.findUnique({ where: { id } });
    return job ? mapJob(job) : null;
  },

  async create(payload: RecruitmentJobDto) {
    const created = await prisma.job.create({
      data: {
        id: payload.id,
        jobCode: payload.jobCode,
        title: payload.title,
        department: payload.department,
        location: payload.location,
        type: payload.type,
        education: payload.education,
        experience: payload.experience,
        skills: payload.skills ?? [],
        salaryMin: payload.salaryMin ?? null,
        salaryMax: payload.salaryMax ?? null,
        postedDate: toDateOnly(payload.postedDate),
        applicationDeadline: toDateOnly(payload.applicationDeadline),
        walkIn: payload.walkIn ?? false,
        roleOverview: payload.roleOverview,
        aboutRole: payload.aboutRole,
        responsibilities: payload.responsibilities ?? [],
        qualifications: payload.qualifications ?? [],
        desiredSkills: payload.desiredSkills ?? [],
        status: jobStatusToPrisma[payload.status],
        isFeatured: payload.isFeatured ?? false,
        publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : null,
        createdAt: new Date(payload.createdAt),
        updatedAt: new Date(payload.updatedAt),
      },
    });

    return mapJob(created);
  },

  async update(id: string, payload: Partial<RecruitmentJobDto>) {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return null;

    const updated = await prisma.job.update({
      where: { id },
      data: {
        jobCode: payload.jobCode,
        title: payload.title,
        department: payload.department,
        location: payload.location,
        type: payload.type,
        education: payload.education,
        experience: payload.experience,
        skills: payload.skills,
        salaryMin: payload.salaryMin,
        salaryMax: payload.salaryMax,
        postedDate: payload.postedDate ? toDateOnly(payload.postedDate) : undefined,
        applicationDeadline: payload.applicationDeadline ? toDateOnly(payload.applicationDeadline) : undefined,
        walkIn: payload.walkIn,
        roleOverview: payload.roleOverview,
        aboutRole: payload.aboutRole,
        responsibilities: payload.responsibilities,
        qualifications: payload.qualifications,
        desiredSkills: payload.desiredSkills,
        status: payload.status ? jobStatusToPrisma[payload.status] : undefined,
        isFeatured: payload.isFeatured,
        publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : undefined,
        updatedAt: new Date(),
      },
    });

    return mapJob(updated);
  },

  async remove(id: string) {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return false;
    await prisma.job.delete({ where: { id } });
    return true;
  },
};


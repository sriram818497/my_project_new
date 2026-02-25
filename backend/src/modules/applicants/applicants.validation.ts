import { z } from "zod";

const applicantStageSchema = z.enum([
  "Applied",
  "Screening",
  "Task Assigned",
  "Task Submitted",
  "Interview",
  "Selected",
  "Rejected",
]);

const stageRatingsSchemaObject = z.object({
  Applied: z.number().int().min(1).max(5).optional(),
  Screening: z.number().int().min(1).max(5).optional(),
  "Task Assigned": z.number().int().min(1).max(5).optional(),
  "Task Submitted": z.number().int().min(1).max(5).optional(),
  Interview: z.number().int().min(1).max(5).optional(),
  Selected: z.number().int().min(1).max(5).optional(),
  Rejected: z.number().int().min(1).max(5).optional(),
});

const roundEvaluationEntrySchema = z.object({
  interviewerName: z.string().trim().optional(),
  internalNote: z.string().trim().optional(),
  updatedAt: z.string().datetime(),
});

const roundEvaluationsSchemaObject = z.object({
  Applied: roundEvaluationEntrySchema.optional(),
  Screening: roundEvaluationEntrySchema.optional(),
  "Task Assigned": roundEvaluationEntrySchema.optional(),
  "Task Submitted": roundEvaluationEntrySchema.optional(),
  Interview: roundEvaluationEntrySchema.optional(),
  Selected: roundEvaluationEntrySchema.optional(),
  Rejected: roundEvaluationEntrySchema.optional(),
});

const applicantNoteSchema = z.object({
  id: z.string().trim().min(1),
  text: z.string().trim().min(1),
  createdAt: z.string().datetime(),
  internal: z.boolean(),
});

const stageHistorySchema = z.object({
  stage: applicantStageSchema,
  movedAt: z.string().datetime(),
});

const stageRatingsSchema = stageRatingsSchemaObject.optional();
const roundEvaluationsSchema = roundEvaluationsSchemaObject.optional();

export const createApplicantSchema = z.object({
  id: z.string().trim().min(1),
  jobId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  email: z.string().email().trim().toLowerCase(),
  phone: z.string().trim().min(1),
  gender: z.enum(["Male", "Female", "Non-Binary", "Prefer not to say"]).optional(),
  education: z.string().trim().min(1),
  location: z.string().trim().min(1),
  experience: z.string().trim().min(1),
  skills: z.array(z.string().trim().min(1)),
  resumeUrl: z.string().trim().min(1),
  resumeName: z.string().trim().min(1),
  stage: applicantStageSchema,
  rating: z.number().int().min(1).max(5),
  stageRatings: stageRatingsSchema,
  roundEvaluations: roundEvaluationsSchema,
  notes: z.array(applicantNoteSchema),
  rejectionReason: z.string().trim().optional(),
  taskAssignment: z
    .object({
      description: z.string().trim().min(1),
      fileUrl: z.string().trim().optional(),
      fileName: z.string().trim().optional(),
      assignedAt: z.string().datetime(),
    })
    .optional(),
  taskSubmissionUrl: z.string().trim().optional(),
  taskSubmissionName: z.string().trim().optional(),
  stageHistory: z.array(stageHistorySchema),
  appliedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const updateApplicantStageSchema = z.object({
  stage: applicantStageSchema,
});

export const updateApplicantRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

export const updateApplicantStageRatingSchema = z.object({
  stage: applicantStageSchema,
  rating: z.number().int().min(1).max(5),
});

export const updateRoundEvaluationSchema = z.object({
  stage: applicantStageSchema,
  interviewerName: z.string().trim().optional(),
  internalNote: z.string().trim().optional(),
});

export const addNoteSchema = z.object({
  text: z.string().trim().min(1),
  internal: z.boolean().optional(),
});

export const assignTaskSchema = z.object({
  description: z.string().trim().min(1),
  fileUrl: z.string().trim().optional(),
  fileName: z.string().trim().optional(),
});

export const submitTaskSchema = z.object({
  taskSubmissionUrl: z.string().trim().min(1),
  taskSubmissionName: z.string().trim().optional(),
});

export const rejectApplicantSchema = z.object({
  reason: z.string().trim().min(1),
});

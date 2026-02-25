import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import path from "path";
import { ZodError } from "zod";
import { applicantsService } from "./applicants.service";
import {
  addNoteSchema,
  assignTaskSchema,
  createApplicantSchema,
  rejectApplicantSchema,
  submitTaskSchema,
  updateApplicantRatingSchema,
  updateApplicantStageRatingSchema,
  updateApplicantStageSchema,
  updateRoundEvaluationSchema,
} from "./applicants.validation";

const badRequest = (res: Response, error: ZodError) =>
  res.status(400).json({
    success: false,
    error: error.issues[0]?.message ?? "Invalid request payload",
  });

const notFound = (res: Response) =>
  res.status(404).json({
    success: false,
    error: "Applicant not found",
  });

const readParam = (value: string | string[] | undefined) => (typeof value === "string" ? value : null);

export const applicantsController = {
  async getAll(_req: Request, res: Response) {
    const data = await applicantsService.getAll();
    return res.status(200).json({ success: true, data });
  },

  async getByJob(req: Request, res: Response) {
    const jobId = readParam(req.params.jobId);
    if (!jobId) return res.status(400).json({ success: false, error: "Job id is required" });
    const data = await applicantsService.getByJob(jobId);
    return res.status(200).json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    const parsed = createApplicantSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    try {
      const data = await applicantsService.create(parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        return res.status(400).json({
          success: false,
          error: "This job posting is no longer available. Please refresh and apply again.",
        });
      }
      throw error;
    }
  },

  async uploadResume(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Resume file is required" });
    }
    const asset = await applicantsService.createResumeAsset(req.file);
    const resumeUrl = `/api/applicants/resumes/${encodeURIComponent(asset.id)}`;
    return res.status(201).json({
      success: true,
      data: {
        resumeUrl,
        resumeName: asset.fileName,
      },
    });
  },

  async downloadResume(req: Request, res: Response) {
    const assetId = readParam(req.params.assetId);
    if (!assetId) {
      return res.status(400).json({ success: false, error: "Resume asset id is required" });
    }

    const asset = await applicantsService.getResumeAsset(assetId);
    if (!asset) {
      return res.status(404).json({ success: false, error: "Resume not found" });
    }

    const safeFileName = path.basename(asset.fileName || "resume.pdf");
    res.setHeader("Content-Type", asset.mimeType || "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${safeFileName.replace(/"/g, "")}"`);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(asset.content);
  },

  async updateStage(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = updateApplicantStageSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.updateStage(id, parsed.data.stage);
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },

  async updateRating(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = updateApplicantRatingSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.updateRating(id, parsed.data.rating);
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },

  async updateStageRating(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = updateApplicantStageRatingSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.updateStageRating(id, parsed.data.stage, parsed.data.rating);
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },

  async updateRoundEvaluation(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = updateRoundEvaluationSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.updateRoundEvaluation(id, parsed.data.stage, {
      interviewerName: parsed.data.interviewerName,
      internalNote: parsed.data.internalNote,
    });
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },

  async addNote(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = addNoteSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.addNote(id, parsed.data);
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },

  async assignTask(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = assignTaskSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.assignTask(id, parsed.data);
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },

  async submitTask(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = submitTaskSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.submitTask(id, parsed.data);
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },

  async reject(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Applicant id is required" });
    const parsed = rejectApplicantSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error);
    const data = await applicantsService.reject(id, parsed.data.reason);
    if (!data) return notFound(res);
    return res.status(200).json({ success: true, data });
  },
};


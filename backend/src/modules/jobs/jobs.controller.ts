import type { Request, Response } from "express";
import { ZodError } from "zod";
import { jobsService } from "./jobs.service";
import { createJobSchema, updateJobSchema } from "./jobs.validation";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({
    success: false,
    error: error.issues[0]?.message ?? "Invalid request payload",
  });

const readParam = (value: string | string[] | undefined) => (typeof value === "string" ? value : null);

export const jobsController = {
  async getAll(_req: Request, res: Response) {
    const data = await jobsService.getAll();
    return res.status(200).json({ success: true, data });
  },

  async getPublished(_req: Request, res: Response) {
    const data = await jobsService.getPublished();
    return res.status(200).json({ success: true, data });
  },

  async getById(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Job id is required" });
    const data = await jobsService.getById(id);
    if (!data) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    return res.status(200).json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const data = await jobsService.create(parsed.data);
    return res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Job id is required" });
    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const data = await jobsService.update(id, parsed.data);
    if (!data) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    return res.status(200).json({ success: true, data });
  },

  async remove(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Job id is required" });
    const ok = await jobsService.remove(id);
    if (!ok) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    return res.status(200).json({ success: true });
  },
};

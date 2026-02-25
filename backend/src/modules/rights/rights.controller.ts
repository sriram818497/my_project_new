import type { Request, Response } from "express";
import { ZodError } from "zod";
import { rightsService } from "./rights.service";
import { rightsEmailService } from "./rightsEmail.service";
import { rightsPayloadSchema, updateRightsStatusSchema } from "./rights.validation";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, error: error.issues[0]?.message ?? "Invalid request payload" });

const readParam = (value: string | string[] | undefined) => (typeof value === "string" ? value : null);

export const rightsController = {
  async getAll(_req: Request, res: Response) {
    const data = await rightsService.getAll();
    return res.status(200).json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    const parsed = rightsPayloadSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const data = await rightsService.create(parsed.data);
    void rightsEmailService.sendSubmissionNotifications(data);
    return res.status(201).json({ success: true, data });
  },

  async updateStatus(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Request id is required" });
    const parsed = updateRightsStatusSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const previous = await rightsService.getById(id);
    if (!previous) return res.status(404).json({ success: false, error: "Request not found" });
    const data = await rightsService.updateStatus(id, parsed.data.status);
    if (!data) return res.status(404).json({ success: false, error: "Request not found" });
    void rightsEmailService.sendStatusUpdateNotifications(data, previous.status, data.status);
    return res.status(200).json({ success: true, data });
  },
};

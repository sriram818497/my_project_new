import type { Request, Response } from "express";
import { ZodError } from "zod";
import { communicationService } from "./communication.service";
import {
  updatePreferencesSchema,
  updateStatusSchema,
  upsertPreferenceSchema,
} from "./communication.validation";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, error: error.issues[0]?.message ?? "Invalid request payload" });

const readParam = (value: string | string[] | undefined) => (typeof value === "string" ? value : null);

export const communicationController = {
  async getAll(_req: Request, res: Response) {
    const data = await communicationService.getAll();
    return res.status(200).json({ success: true, data });
  },

  async getByEmail(req: Request, res: Response) {
    const email = readParam(req.params.email);
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });
    const data = await communicationService.getByEmail(email);
    if (!data) return res.status(404).json({ success: false, error: "Profile not found" });
    return res.status(200).json({ success: true, data });
  },

  async upsert(req: Request, res: Response) {
    const parsed = upsertPreferenceSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const data = await communicationService.upsertFromPreferenceCenter(parsed.data);
    return res.status(200).json({ success: true, data });
  },

  async updateStatus(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Profile id is required" });
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const data = await communicationService.updateStatus(id, parsed.data.status, parsed.data.actor);
    if (!data) return res.status(404).json({ success: false, error: "Profile not found" });
    return res.status(200).json({ success: true, data });
  },

  async updatePreferences(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Profile id is required" });
    const parsed = updatePreferencesSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const data = await communicationService.updatePreferences(id, parsed.data.preferences, parsed.data.actor);
    if (!data) return res.status(404).json({ success: false, error: "Profile not found" });
    return res.status(200).json({ success: true, data });
  },
};


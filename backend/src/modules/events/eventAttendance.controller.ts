import type { Request, Response } from "express";
import { ZodError } from "zod";
import { eventAttendanceService } from "./eventAttendance.service";
import { registerEventSchema, updateAttendanceSchema } from "./eventAttendance.validation";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, error: error.issues[0]?.message ?? "Invalid request payload" });

const readParam = (value: string | string[] | undefined) => (typeof value === "string" ? value : null);

export const eventAttendanceController = {
  async getAll(_req: Request, res: Response) {
    const data = await eventAttendanceService.getAll();
    return res.status(200).json({ success: true, data });
  },

  async register(req: Request, res: Response) {
    const parsed = registerEventSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const id = await eventAttendanceService.register(parsed.data);
    return res.status(201).json({ success: true, id });
  },

  async updateStatus(req: Request, res: Response) {
    const id = readParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: "Registration id is required" });
    const parsed = updateAttendanceSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const data = await eventAttendanceService.updateAttendanceStatus(id, parsed.data.status);
    if (!data) return res.status(404).json({ success: false, error: "Registration not found" });
    return res.status(200).json({ success: true, data });
  },
};


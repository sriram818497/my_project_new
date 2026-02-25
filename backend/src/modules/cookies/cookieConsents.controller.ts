import type { Request, Response } from "express";
import { ZodError } from "zod";
import { cookieConsentsService } from "./cookieConsents.service";
import { logConsentSchema } from "./cookieConsents.validation";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, error: error.issues[0]?.message ?? "Invalid request payload" });

export const cookieConsentsController = {
  async getAll(_req: Request, res: Response) {
    const data = await cookieConsentsService.getAll();
    return res.status(200).json({ success: true, data });
  },

  async logDecision(req: Request, res: Response) {
    const parsed = logConsentSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);
    const forwardedFor = req.headers["x-forwarded-for"];
    const headerIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    const data = await cookieConsentsService.logDecision(parsed.data, {
      headerIp,
      socketIp: req.ip || req.socket.remoteAddress || undefined,
    });
    return res.status(201).json({ success: true, data });
  },
};

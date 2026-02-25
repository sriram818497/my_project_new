import type { Request, Response } from "express";
import { ZodError } from "zod";
import { translationService } from "./translation.service";
import { translateSchema } from "./translation.validation";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, error: error.issues[0]?.message ?? "Invalid request payload" });

export const translationController = {
  async translate(req: Request, res: Response) {
    const parsed = translateSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const data = await translationService.translate(parsed.data);
    return res.status(200).json({
      success: true,
      enabled: translationService.isEnabled(),
      data,
    });
  },
};

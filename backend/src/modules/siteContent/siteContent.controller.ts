import type { Request, Response } from "express";
import { ZodError } from "zod";
import { siteContentService } from "./siteContent.service";
import { keyParamSchema, upsertContentSchema } from "./siteContent.validation";

const validationError = (res: Response, error: ZodError) =>
  res.status(400).json({ success: false, error: error.issues[0]?.message ?? "Invalid request payload" });

const parseKeysQuery = (value: unknown): string[] => {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean)
    .slice(0, 50);
};

export const siteContentController = {
  async getByKey(req: Request, res: Response) {
    const parsed = keyParamSchema.safeParse(req.params);
    if (!parsed.success) return validationError(res, parsed.error);
    const data = await siteContentService.getByKey(parsed.data.key);
    if (!data) return res.status(404).json({ success: false, error: "Content key not found" });
    return res.status(200).json({ success: true, data });
  },

  async getByKeys(req: Request, res: Response) {
    const keys = parseKeysQuery(req.query.keys);
    if (!keys.length) return res.status(200).json({ success: true, data: [] });
    const data = await siteContentService.getByKeys(keys);
    return res.status(200).json({ success: true, data });
  },

  async upsert(req: Request, res: Response) {
    const parsedKey = keyParamSchema.safeParse(req.params);
    if (!parsedKey.success) return validationError(res, parsedKey.error);
    const parsedBody = upsertContentSchema.safeParse(req.body);
    if (!parsedBody.success) return validationError(res, parsedBody.error);
    const data = await siteContentService.upsert(parsedKey.data.key, parsedBody.data.payload);
    return res.status(200).json({ success: true, data });
  },
};


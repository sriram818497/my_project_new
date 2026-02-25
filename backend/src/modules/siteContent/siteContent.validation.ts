import { z } from "zod";

export const keyParamSchema = z.object({
  key: z.string().trim().min(1).max(120),
});

export const upsertContentSchema = z.object({
  payload: z.unknown(),
});


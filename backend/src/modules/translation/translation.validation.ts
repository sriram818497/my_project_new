import { z } from "zod";

const languageCodeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(10)
  .regex(/^[a-z-]+$/, "Language code must contain only lowercase letters and hyphen");

const textSchema = z
  .string()
  .trim()
  .min(1, "Text is required")
  .max(2000, "Text exceeds maximum allowed length");

export const translateSchema = z.object({
  sourceLang: languageCodeSchema.default("en"),
  targetLang: languageCodeSchema,
  texts: z.array(textSchema).min(1, "At least one text is required").max(80, "Too many texts in one request"),
});

export type TranslateInput = z.infer<typeof translateSchema>;

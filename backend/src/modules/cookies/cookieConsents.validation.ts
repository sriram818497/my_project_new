import { z } from "zod";

export const consentStatusSchema = z.enum(["accepted_all", "rejected_all", "custom"]);
export const consentSourceSchema = z.enum(["banner_accept", "banner_decline", "preference_center"]);

export const logConsentSchema = z.object({
  ipAddress: z.string().trim().min(1).optional(),
  state: z.string().trim().min(1).optional(),
  country: z.string().trim().min(1).optional(),
  status: consentStatusSchema,
  essential: z.boolean(),
  analytics: z.boolean(),
  personalization: z.boolean(),
  marketing: z.boolean(),
  source: consentSourceSchema,
  cookieSnapshot: z.record(z.string(), z.string().optional()).default({}),
});

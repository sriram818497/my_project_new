import { z } from "zod";

export const statusSchema = z.enum(["subscribed", "unsubscribed"]);

export const preferencesSchema = z.object({
  newsletters: z.boolean(),
  productUpdates: z.boolean(),
  promotionalOffers: z.boolean(),
});

export const upsertPreferenceSchema = z.object({
  fullName: z.string().trim().min(1),
  email: z.string().email().trim().toLowerCase(),
  preferences: preferencesSchema,
});

export const updateStatusSchema = z.object({
  status: statusSchema,
  actor: z.string().trim().optional(),
});

export const updatePreferencesSchema = z.object({
  preferences: preferencesSchema,
  actor: z.string().trim().optional(),
});


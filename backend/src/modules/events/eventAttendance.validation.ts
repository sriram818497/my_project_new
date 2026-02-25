import { z } from "zod";

export const attendanceStatusSchema = z.enum(["registered", "attended", "missed"]);

export const registerEventSchema = z.object({
  eventId: z.string().trim().min(1),
  eventTitle: z.string().trim().min(1),
  fullName: z.string().trim().min(1),
  email: z.string().email().trim().toLowerCase(),
  currentRole: z.string().trim().min(1),
  organization: z.string().trim().min(1),
  originCity: z.string().trim().min(1),
  contact: z.string().trim().optional(),
  consent: z.boolean(),
});

export const updateAttendanceSchema = z.object({
  status: attendanceStatusSchema,
});


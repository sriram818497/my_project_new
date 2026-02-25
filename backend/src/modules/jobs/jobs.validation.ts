import { z } from "zod";

const nonEmpty = (label: string) => z.string().trim().min(1, `${label} is required`);

const dateLike = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const createJobSchema = z.object({
  id: nonEmpty("id"),
  jobCode: z.string().trim().min(1).optional(),
  title: nonEmpty("title"),
  department: nonEmpty("department"),
  location: nonEmpty("location"),
  type: nonEmpty("type"),
  education: z.string().trim().optional(),
  experience: z.string().trim().optional(),
  skills: z.array(z.string().trim().min(1)).optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  postedDate: dateLike.optional(),
  applicationDeadline: dateLike.optional(),
  walkIn: z.boolean().optional(),
  roleOverview: nonEmpty("roleOverview"),
  aboutRole: nonEmpty("aboutRole"),
  responsibilities: z.array(z.string().trim().min(1)).optional(),
  qualifications: z.array(z.string().trim().min(1)).optional(),
  desiredSkills: z.array(z.string().trim().min(1)).optional(),
  status: z.enum(["draft", "published", "archived"]),
  isFeatured: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const updateJobSchema = createJobSchema.partial().omit({
  id: true,
  createdAt: true,
});


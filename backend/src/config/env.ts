import { config } from "dotenv";
import { z } from "zod";

config();

const booleanFromEnv = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) return false;
    const normalized = value.toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
  });

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(24, "JWT_SECRET must be at least 24 characters"),
  JWT_EXPIRES_IN: z.string().min(1).default("1d"),
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL").default("http://localhost:5173"),
  RESEND_API_KEY: z.string().trim().optional(),
  EMAIL_FROM: z.string().trim().optional(),
  EMAIL_USER: z.string().trim().optional(),
  EMAIL_PASS: z.string().trim().optional(),
  ADMIN_EMAIL: z.string().email().trim().optional(),
  SMTP_HOST: z.string().trim().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_SECURE: booleanFromEnv,
  RIGHTS_MANAGER_EMAIL: z.string().email().trim().optional(),
  DASHBOARD_URL: z.string().url().trim().optional(),
  ENABLE_RIGHTS_EMAIL_NOTIFICATIONS: booleanFromEnv,
  BHASHINI_UDYAT_KEY: z.string().trim().optional(),
  BHASHINI_INTERFACE_API_KEY: z.string().trim().optional(),
  BHASHINI_BASE_URL: z.string().url().trim().optional(),
  BHASHINI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(15000),
  ENABLE_BHASHINI: booleanFromEnv,
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${formatted}`);
}

export const env = parsed.data;

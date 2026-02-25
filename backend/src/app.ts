import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import authRouter from "./modules/auth/auth.routes";
import jobsRouter from "./modules/jobs/jobs.routes";
import applicantsRouter from "./modules/applicants/applicants.routes";
import rightsRouter from "./modules/rights/rights.routes";
import eventAttendanceRouter from "./modules/events/eventAttendance.routes";
import communicationRouter from "./modules/communication/communication.routes";
import cookieConsentsRouter from "./modules/cookies/cookieConsents.routes";
import siteContentRouter from "./modules/siteContent/siteContent.routes";
import translationRouter from "./modules/translation/translation.routes";

const app = express();

app.disable("x-powered-by");

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "");
const isDevLocalhostOrigin = (origin: string) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

const allowedOrigins = new Set(
  [env.FRONTEND_URL, ...(env.FRONTEND_URLS ?? [])]
    .filter(Boolean)
    .map((origin) => normalizeOrigin(origin))
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header).
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);

      if (env.NODE_ENV !== "production" && isDevLocalhostOrigin(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "proteccio-backend",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/applicants", applicantsRouter);
app.use("/api/rights-requests", rightsRouter);
app.use("/api/event-registrations", eventAttendanceRouter);
app.use("/api/communication-preferences", communicationRouter);
app.use("/api/cookie-consents", cookieConsentsRouter);
app.use("/api/site-content", siteContentRouter);
app.use("/api/translation", translationRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  const statusCode = 500;

  if (env.NODE_ENV !== "production" && error instanceof Error) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
});

export default app;

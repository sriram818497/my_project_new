import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticate } from "../../middleware/authenticate";
import { applicantsController } from "./applicants.controller";

const applicantsRouter = Router();
const resumeUploadDir = path.resolve(process.cwd(), "uploads", "resumes");

fs.mkdirSync(resumeUploadDir, { recursive: true });

const uploadResume = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, resumeUploadDir),
    filename: (_req, file, callback) => {
      const ext = path.extname(file.originalname || ".pdf").toLowerCase();
      const safeExt = ext || ".pdf";
      const fileName = `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`;
      callback(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (ext !== ".pdf") {
      return callback(new Error("Only PDF resumes are allowed"));
    }
    callback(null, true);
  },
});

applicantsRouter.get("/", authenticate, (req, res) => applicantsController.getAll(req, res));
applicantsRouter.get("/job/:jobId", authenticate, (req, res) => applicantsController.getByJob(req, res));
applicantsRouter.post("/upload-resume", uploadResume.single("resume"), (req, res) => applicantsController.uploadResume(req, res));
applicantsRouter.post("/", (req, res) => applicantsController.create(req, res));
applicantsRouter.patch("/:id/stage", authenticate, (req, res) => applicantsController.updateStage(req, res));
applicantsRouter.patch("/:id/rating", authenticate, (req, res) => applicantsController.updateRating(req, res));
applicantsRouter.patch("/:id/stage-rating", authenticate, (req, res) => applicantsController.updateStageRating(req, res));
applicantsRouter.patch("/:id/round-evaluation", authenticate, (req, res) =>
  applicantsController.updateRoundEvaluation(req, res)
);
applicantsRouter.post("/:id/notes", authenticate, (req, res) => applicantsController.addNote(req, res));
applicantsRouter.patch("/:id/assign-task", authenticate, (req, res) => applicantsController.assignTask(req, res));
applicantsRouter.patch("/:id/submit-task", authenticate, (req, res) => applicantsController.submitTask(req, res));
applicantsRouter.patch("/:id/reject", authenticate, (req, res) => applicantsController.reject(req, res));

export default applicantsRouter;

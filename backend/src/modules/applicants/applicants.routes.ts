import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { applicantsController } from "./applicants.controller";

const applicantsRouter = Router();

applicantsRouter.get("/", authenticate, (req, res) => applicantsController.getAll(req, res));
applicantsRouter.get("/job/:jobId", authenticate, (req, res) => applicantsController.getByJob(req, res));
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


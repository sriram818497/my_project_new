import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { jobsController } from "./jobs.controller";

const jobsRouter = Router();

jobsRouter.get("/", (req, res) => jobsController.getAll(req, res));
jobsRouter.get("/published", (req, res) => jobsController.getPublished(req, res));
jobsRouter.get("/:id", (req, res) => jobsController.getById(req, res));
jobsRouter.post("/", authenticate, (req, res) => jobsController.create(req, res));
jobsRouter.patch("/:id", authenticate, (req, res) => jobsController.update(req, res));
jobsRouter.delete("/:id", authenticate, (req, res) => jobsController.remove(req, res));

export default jobsRouter;

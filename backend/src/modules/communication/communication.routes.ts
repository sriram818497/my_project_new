import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { communicationController } from "./communication.controller";

const communicationRouter = Router();

communicationRouter.get("/", (req, res) => communicationController.getAll(req, res));
communicationRouter.get("/email/:email", (req, res) => communicationController.getByEmail(req, res));
communicationRouter.post("/", (req, res) => communicationController.upsert(req, res));
communicationRouter.patch("/:id/status", authenticate, (req, res) => communicationController.updateStatus(req, res));
communicationRouter.patch("/:id/preferences", authenticate, (req, res) =>
  communicationController.updatePreferences(req, res)
);

export default communicationRouter;

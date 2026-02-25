import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { rightsController } from "./rights.controller";

const rightsRouter = Router();

rightsRouter.get("/", (req, res) => rightsController.getAll(req, res));
rightsRouter.post("/", (req, res) => rightsController.create(req, res));
rightsRouter.patch("/:id/status", authenticate, (req, res) => rightsController.updateStatus(req, res));

export default rightsRouter;

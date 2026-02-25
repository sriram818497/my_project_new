import { Router } from "express";
import { translationController } from "./translation.controller";

const translationRouter = Router();

translationRouter.post("/translate", (req, res) => translationController.translate(req, res));

export default translationRouter;

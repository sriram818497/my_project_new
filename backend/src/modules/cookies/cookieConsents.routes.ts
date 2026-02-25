import { Router } from "express";
import { cookieConsentsController } from "./cookieConsents.controller";

const cookieConsentsRouter = Router();

cookieConsentsRouter.get("/", (req, res) => cookieConsentsController.getAll(req, res));
cookieConsentsRouter.post("/", (req, res) => cookieConsentsController.logDecision(req, res));

export default cookieConsentsRouter;

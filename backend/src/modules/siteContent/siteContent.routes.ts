import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { siteContentController } from "./siteContent.controller";

const siteContentRouter = Router();

siteContentRouter.get("/", (req, res) => siteContentController.getByKeys(req, res));
siteContentRouter.get("/:key", (req, res) => siteContentController.getByKey(req, res));
siteContentRouter.put("/:key", authenticate, (req, res) => siteContentController.upsert(req, res));

export default siteContentRouter;

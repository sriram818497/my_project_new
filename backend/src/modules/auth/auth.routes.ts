import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.get("/profile", authenticate, (req, res) => authController.profile(req, res));
authRouter.post("/forgot-password", (req, res) => authController.forgotPassword(req, res));
authRouter.post("/reset-password", (req, res) => authController.resetPassword(req, res));

export default authRouter;


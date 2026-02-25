import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { eventAttendanceController } from "./eventAttendance.controller";

const eventAttendanceRouter = Router();

eventAttendanceRouter.get("/", authenticate, (req, res) => eventAttendanceController.getAll(req, res));
eventAttendanceRouter.post("/", (req, res) => eventAttendanceController.register(req, res));
eventAttendanceRouter.patch("/:id/status", authenticate, (req, res) => eventAttendanceController.updateStatus(req, res));

export default eventAttendanceRouter;

import express from "express";
import { requireRole } from "../middleware/rbac.middleware";
import * as advisorController from "./advisor.controller";

const router = express.Router();

router.put(
  "/assessment/:id/review",
  requireRole(["advisor"]),
  advisorController.review
);

export default router;
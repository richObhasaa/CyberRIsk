import express from "express";
import * as adminController from "./admin.controller";
import { requireRole } from "../middleware/rbac.middleware";

const router = express.Router();

router.get(
  "/users",
  requireRole(["admin"]),
  adminController.listUsers
);

router.put(
  "/users/:userId/promote",
  requireRole(["admin"]),
  adminController.promoteUser
);

router.get(
  "/assessments",
  requireRole(["admin"]),
  adminController.listAssessments
);

export default router;
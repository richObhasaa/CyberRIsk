import { Request, Response } from "express";
import * as adminService from "./admin.service";

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const data = await adminService.getAllUsers();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const promoteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { organizationId } = req.body;

    await adminService.promoteToAdvisor(userId, organizationId);

    res.json({ success: true, message: "User promoted to advisor" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Promotion failed" });
  }
};

export const listAssessments = async (_req: Request, res: Response) => {
  try {
    const data = await adminService.getAllAssessments();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assessments",
    });
  }
};
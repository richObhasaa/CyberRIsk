import { Request, Response } from "express";
import * as advisorService from "./advisor.service";

export const review = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { summary } = req.body;
    const advisorId = req.user.userId;

    await advisorService.reviewAssessment(id, advisorId, summary);

    res.json({ success: true, message: "Assessment finalized" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Review failed" });
  }
};
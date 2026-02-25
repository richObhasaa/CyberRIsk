import { Request, Response, NextFunction } from "express";
import { supabase } from "../db/supabase";

export async function requireApprovalRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const { assessment_id } = req.body;

    if (!assessment_id)
      return res.status(400).json({ error: "assessment_id required" });

    const { data: assessment } = await supabase
      .from("assessments")
      .select("organization_id")
      .eq("id", assessment_id)
      .single();

    if (!assessment)
      return res.status(404).json({ error: "Assessment not found" });

    const { data: orgUser } = await supabase
      .from("organization_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", assessment.organization_id)
      .single();

    if (!orgUser)
      return res.status(403).json({ error: "No organization access" });

    if (!["admin", "auditor"].includes(orgUser.role))
      return res
        .status(403)
        .json({ error: "Approval permission required" });

    next();
  } catch {
    return res.status(500).json({ error: "Authorization failed" });
  }
}
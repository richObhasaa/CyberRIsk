import { Request, Response, NextFunction } from "express";
import { supabase } from "../src/db/supabase";

export const requireRole = (allowedRoles: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const { userId, organizationId } = req.user;

      const { data, error } = await supabase
        .from("organization_users")
        .select("role")
        .eq("user_id", userId)
        .eq("organization_id", organizationId)
        .single();

      if (error || !data || !allowedRoles.includes(data.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ message: "RBAC error" });
    }
  };
};
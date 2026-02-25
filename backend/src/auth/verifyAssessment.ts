import { Request, Response, NextFunction } from "express";
import { supabase } from "../db/supabase";

const supabaseClient = supabase;

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user)
      return res.status(401).json({ error: "Invalid token" });

    (req as any).user = data.user;

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
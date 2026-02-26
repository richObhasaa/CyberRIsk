import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: string | JwtPayload
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ error: "No token" })
    return
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    res.status(401).json({ error: "No token" })
    return
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET not defined")
  }

  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch {
    res.status(403).json({ error: "Invalid token" })
  }
}
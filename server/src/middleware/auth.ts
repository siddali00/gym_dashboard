import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sdf-mvp-secret-change-in-prod";

const VALID_ROLES = ["cliente", "medico", "nutrizionista", "fabbro", "coach_di_ferro"] as const;
export type Role = (typeof VALID_ROLES)[number];

export function isValidRole(r: string): r is Role {
  return VALID_ROLES.includes(r as Role);
}

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: Role;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Non autenticato" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role?: string };
    req.userId = decoded.userId;
    req.userRole = (decoded.role as Role) || "cliente";
    next();
  } catch {
    return res.status(401).json({ error: "Token non valido" });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: "Accesso non autorizzato per questo ruolo" });
    }
    next();
  };
}

export function requireProfessional(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.userRole || req.userRole === "cliente") {
    return res.status(403).json({ error: "Solo i professionisti possono accedere" });
  }
  next();
}

export function signToken(userId: number, role: string = "cliente"): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

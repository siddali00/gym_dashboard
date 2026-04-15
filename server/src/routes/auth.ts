import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../index";
import { signToken, authMiddleware, AuthRequest, isValidRole } from "../middleware/auth";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, cf, consents, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Compila tutti i campi obbligatori" });
    }

    const userRole = role && isValidRole(role) ? role : "cliente";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email già registrata" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, phone, cf, role: userRole },
    });

    if (userRole === "cliente" && consents && typeof consents === "object") {
      for (const [key, granted] of Object.entries(consents)) {
        await prisma.consent.create({
          data: { userId: user.id, key, granted: !!granted },
        });
      }
    }

    const token = signToken(user.id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Email o password non corretti" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Email o password non corretti" });

    const token = signToken(user.id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ ok: true });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true, phone: true, cf: true },
    });
    if (!user) return res.status(404).json({ error: "Utente non trovato" });
    return res.json({ user });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.put("/", async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, cf } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, phone, cf },
      select: { id: true, email: true, name: true, role: true, phone: true, cf: true },
    });
    return res.json({ user });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

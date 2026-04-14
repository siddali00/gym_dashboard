import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const metrics = await prisma.selfMetric.findMany({
    where: { userId: req.userId },
    orderBy: { addedAt: "desc" },
  });
  return res.json(metrics);
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { category, date, values, bmi } = req.body;
    const metric = await prisma.selfMetric.create({
      data: { userId: req.userId!, category, date, values, bmi: bmi ?? null },
    });
    return res.json(metric);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

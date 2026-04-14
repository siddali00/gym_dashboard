import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const isPro = req.userRole && req.userRole !== "cliente";
  if (isPro) {
    const metrics = await prisma.selfMetric.findMany({
      where: { addedById: req.userId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { addedAt: "desc" },
    });
    return res.json(metrics);
  }
  const metrics = await prisma.selfMetric.findMany({
    where: { userId: req.userId },
    orderBy: { addedAt: "desc" },
  });
  return res.json(metrics);
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { category, date, values, bmi, clientId } = req.body;

    let targetUserId = req.userId!;
    let addedById: number | null = null;

    if (clientId && req.userRole && req.userRole !== "cliente") {
      const link = await prisma.profLink.findFirst({
        where: { profId: req.userId!, clientId: Number(clientId) },
      });
      if (!link) return res.status(403).json({ error: "Non sei collegato a questo cliente" });
      targetUserId = Number(clientId);
      addedById = req.userId!;
    }

    const metric = await prisma.selfMetric.create({
      data: { userId: targetUserId, category, date, values, bmi: bmi ?? null, addedById },
      include: { user: { select: { id: true, name: true } } },
    });
    return res.json(metric);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const isPro = req.userRole && req.userRole !== "cliente";
    let existing;
    if (isPro) {
      existing = await prisma.selfMetric.findFirst({ where: { id, addedById: req.userId! } });
    } else {
      existing = await prisma.selfMetric.findFirst({ where: { id, userId: req.userId! } });
    }
    if (!existing) return res.status(404).json({ error: "Not found" });

    const { category, date, values, bmi } = req.body;
    const metric = await prisma.selfMetric.update({
      where: { id },
      data: { category, date, values, bmi: bmi ?? null },
      include: { user: { select: { id: true, name: true } } },
    });
    return res.json(metric);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const isPro = req.userRole && req.userRole !== "cliente";
    let existing;
    if (isPro) {
      existing = await prisma.selfMetric.findFirst({ where: { id, addedById: req.userId! } });
    } else {
      existing = await prisma.selfMetric.findFirst({ where: { id, userId: req.userId! } });
    }
    if (!existing) return res.status(404).json({ error: "Not found" });
    await prisma.selfMetric.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

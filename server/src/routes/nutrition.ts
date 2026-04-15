import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, requireProfessional, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const isPro = req.userRole && req.userRole !== "cliente";
  if (isPro) {
    const items = await prisma.nutritionPlan.findMany({
      where: { addedById: req.userId },
      include: {
        addedBy: { select: { name: true, role: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { addedAt: "desc" },
    });
    return res.json(items);
  }
  const items = await prisma.nutritionPlan.findMany({
    where: { userId: req.userId },
    include: { addedBy: { select: { name: true, role: true } } },
    orderBy: { addedAt: "desc" },
  });
  return res.json(items);
});

router.post("/", requireProfessional, async (req: AuthRequest, res: Response) => {
  try {
    const { clientId, title, calories, protein, carbs, fat, fiber, notes } = req.body;
    if (!clientId || !title) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }
    const link = await prisma.profLink.findFirst({
      where: { profId: req.userId!, clientId: Number(clientId) },
    });
    if (!link) return res.status(403).json({ error: "Non sei collegato a questo cliente" });

    const item = await prisma.nutritionPlan.create({
      data: {
        userId: Number(clientId),
        addedById: req.userId!,
        title, calories, protein, carbs, fat, fiber, notes,
      },
      include: {
        addedBy: { select: { name: true, role: true } },
        user: { select: { id: true, name: true } },
      },
    });
    return res.json(item);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.put("/:id", requireProfessional, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.nutritionPlan.findFirst({ where: { id, addedById: req.userId! } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const { title, calories, protein, carbs, fat, fiber, notes } = req.body;
    const item = await prisma.nutritionPlan.update({
      where: { id },
      data: { title, calories, protein, carbs, fat, fiber, notes },
      include: {
        addedBy: { select: { name: true, role: true } },
        user: { select: { id: true, name: true } },
      },
    });
    return res.json(item);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", requireProfessional, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.nutritionPlan.findFirst({ where: { id, addedById: req.userId! } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    await prisma.nutritionPlan.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

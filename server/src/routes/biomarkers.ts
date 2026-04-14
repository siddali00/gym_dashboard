import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, requireProfessional, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const isPro = req.userRole && req.userRole !== "cliente";
  if (isPro) {
    const items = await prisma.biomarker.findMany({
      where: { addedById: req.userId },
      include: {
        addedBy: { select: { name: true, role: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { addedAt: "desc" },
    });
    return res.json(items);
  }
  const items = await prisma.biomarker.findMany({
    where: { userId: req.userId },
    include: { addedBy: { select: { name: true, role: true } } },
    orderBy: { addedAt: "desc" },
  });
  return res.json(items);
});

router.post("/", requireProfessional, async (req: AuthRequest, res: Response) => {
  try {
    const { clientId, name, category, value, unit, refMin, refMax, status, date, notes } = req.body;
    if (!clientId || !name || !value || !date) {
      return res.status(400).json({ error: "Campi obbligatori mancanti" });
    }
    const link = await prisma.profLink.findFirst({
      where: { profId: req.userId!, clientId: Number(clientId) },
    });
    if (!link) return res.status(403).json({ error: "Non sei collegato a questo cliente" });

    const item = await prisma.biomarker.create({
      data: {
        userId: Number(clientId),
        addedById: req.userId!,
        name, category, value, unit, refMin, refMax,
        status: status || "normale", date, notes,
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
    const existing = await prisma.biomarker.findFirst({ where: { id, addedById: req.userId! } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const { name, category, value, unit, refMin, refMax, status, date, notes } = req.body;
    const item = await prisma.biomarker.update({
      where: { id },
      data: { name, category, value, unit, refMin, refMax, status, date, notes },
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
    const existing = await prisma.biomarker.findFirst({ where: { id, addedById: req.userId! } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    await prisma.biomarker.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

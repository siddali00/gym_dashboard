import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, requireProfessional, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/my-clients", requireProfessional, async (req: AuthRequest, res: Response) => {
  const links = await prisma.profLink.findMany({
    where: { profId: req.userId },
    include: { client: { select: { id: true, name: true, email: true } } },
    orderBy: { addedAt: "desc" },
  });

  const clients = await Promise.all(
    links.map(async (l) => {
      const cId = l.client.id;
      const [bm, metrics, workouts, nutrition, supplements] = await Promise.all([
        prisma.biomarker.count({ where: { userId: cId, addedById: req.userId! } }),
        prisma.selfMetric.count({ where: { userId: cId, addedById: req.userId! } }),
        prisma.workout.count({ where: { userId: cId, addedById: req.userId! } }),
        prisma.nutritionPlan.count({ where: { userId: cId, addedById: req.userId! } }),
        prisma.supplement.count({ where: { userId: cId, addedById: req.userId! } }),
      ]);
      return {
        ...l.client,
        stats: { bm, metrics, workouts, nutrition, supplements, total: bm + metrics + workouts + nutrition + supplements },
      };
    })
  );

  return res.json(clients);
});

router.get("/my-professionals", async (req: AuthRequest, res: Response) => {
  const links = await prisma.profLink.findMany({
    where: { clientId: req.userId },
    include: { prof: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { addedAt: "desc" },
  });
  return res.json(links.map((l) => l.prof));
});

router.get("/all-professionals", async (req: AuthRequest, res: Response) => {
  const pros = await prisma.user.findMany({
    where: { role: { not: "cliente" } },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
  return res.json(pros);
});

// Client assigns a professional to themselves
router.post("/add-professional", async (req: AuthRequest, res: Response) => {
  try {
    const { profId } = req.body;
    if (!profId) return res.status(400).json({ error: "profId richiesto" });

    const prof = await prisma.user.findFirst({
      where: { id: Number(profId), role: { not: "cliente" } },
    });
    if (!prof) return res.status(404).json({ error: "Specialista non trovato" });

    await prisma.profLink.upsert({
      where: { profId_clientId: { profId: Number(profId), clientId: req.userId! } },
      update: {},
      create: { profId: Number(profId), clientId: req.userId! },
    });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Client removes a professional from themselves
router.delete("/remove-professional/:profId", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.profLink.delete({
      where: { profId_clientId: { profId: Number(req.params.profId), clientId: req.userId! } },
    });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

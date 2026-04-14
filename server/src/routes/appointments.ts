import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const isPro = req.userRole && req.userRole !== "cliente";
  if (isPro) {
    const appts = await prisma.appointment.findMany({
      where: { createdById: req.userId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { date: "desc" },
    });
    return res.json(appts);
  }

  const appts = await prisma.appointment.findMany({
    where: { userId: req.userId },
    orderBy: { date: "desc" },
  });
  return res.json(appts);
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { title, date, time, location, notes, status, clientId } = req.body;

    let targetUserId = req.userId!;
    let createdBy: string | null = null;
    const isPro = clientId && req.userRole && req.userRole !== "cliente";

    if (isPro) {
      const link = await prisma.profLink.findFirst({
        where: { profId: req.userId!, clientId: Number(clientId) },
      });
      if (!link) return res.status(403).json({ error: "Non sei collegato a questo cliente" });
      targetUserId = Number(clientId);

      const prof = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: { name: true, role: true },
      });
      createdBy = prof?.name || req.userRole || null;

      const proConflict = await prisma.appointment.findFirst({
        where: { createdById: req.userId!, date, time },
      });
      if (proConflict) return res.status(409).json({ error: "CONFLICT_PRO" });

      const clientConflict = await prisma.appointment.findFirst({
        where: { userId: targetUserId, date, time },
      });
      if (clientConflict) return res.status(409).json({ error: "CONFLICT_CLIENT" });
    }

    const createdById = isPro ? req.userId! : null;
    const appt = await prisma.appointment.create({
      data: { userId: targetUserId, title, date, time, location, notes, status, createdBy, createdById },
      include: { user: { select: { id: true, name: true } } },
    });
    return res.json(appt);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, date, time, location, notes, status } = req.body;

    const isPro = req.userRole && req.userRole !== "cliente";
    let existing;
    if (isPro) {
      existing = await prisma.appointment.findFirst({ where: { id, createdById: req.userId! } });
    } else {
      existing = await prisma.appointment.findFirst({ where: { id, userId: req.userId! } });
    }
    if (!existing) return res.status(404).json({ error: "Not found" });

    if (isPro && (date !== existing.date || time !== existing.time)) {
      const proConflict = await prisma.appointment.findFirst({
        where: { createdById: req.userId!, date, time, id: { not: id } },
      });
      if (proConflict) return res.status(409).json({ error: "CONFLICT_PRO" });

      const clientConflict = await prisma.appointment.findFirst({
        where: { userId: existing.userId, date, time, id: { not: id } },
      });
      if (clientConflict) return res.status(409).json({ error: "CONFLICT_CLIENT" });
    }

    const appt = await prisma.appointment.update({
      where: { id },
      data: { title, date, time, location, notes, status },
      include: { user: { select: { id: true, name: true } } },
    });
    return res.json(appt);
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
      existing = await prisma.appointment.findFirst({ where: { id, createdById: req.userId! } });
    } else {
      existing = await prisma.appointment.findFirst({ where: { id, userId: req.userId! } });
    }
    if (!existing) return res.status(404).json({ error: "Not found" });
    await prisma.appointment.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

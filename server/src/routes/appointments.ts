import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const appts = await prisma.appointment.findMany({
    where: { userId: req.userId },
    orderBy: { date: "desc" },
  });
  return res.json(appts);
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { title, date, time, location, notes, status } = req.body;
    const appt = await prisma.appointment.create({
      data: { userId: req.userId!, title, date, time, location, notes, status },
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
    const existing = await prisma.appointment.findFirst({
      where: { id, userId: req.userId! },
    });
    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }
    const appt = await prisma.appointment.update({
      where: { id },
      data: { title, date, time, location, notes, status },
    });
    return res.json(appt);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

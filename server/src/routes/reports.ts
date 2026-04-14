import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  const isPro = req.userRole && req.userRole !== "cliente";
  if (isPro) {
    const reports = await prisma.medicalReport.findMany({
      where: { uploadedById: req.userId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { addedAt: "desc" },
    });
    return res.json(reports);
  }
  const reports = await prisma.medicalReport.findMany({
    where: { userId: req.userId },
    orderBy: { addedAt: "desc" },
  });
  return res.json(reports);
});

router.post("/", upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, doctor, date, notes, clientId, diagnosis, findings, recommendations } = req.body;

    let targetUserId = req.userId!;
    let uploadedBy = "cliente";

    if (clientId && req.userRole && req.userRole !== "cliente") {
      const link = await prisma.profLink.findFirst({
        where: { profId: req.userId!, clientId: Number(clientId) },
      });
      if (!link) return res.status(403).json({ error: "Non sei collegato a questo cliente" });
      targetUserId = Number(clientId);

      const prof = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: { name: true, role: true },
      });
      uploadedBy = prof?.name || req.userRole;
    }

    const uploadedById = (clientId && req.userRole && req.userRole !== "cliente") ? req.userId! : null;
    const report = await prisma.medicalReport.create({
      data: {
        userId: targetUserId,
        title, type, doctor, date, notes,
        diagnosis: diagnosis || null,
        findings: findings || null,
        recommendations: recommendations || null,
        fileName: req.file?.originalname,
        filePath: req.file?.path,
        uploadedBy,
        uploadedById,
      },
      include: { user: { select: { id: true, name: true } } },
    });
    return res.json(report);
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
      existing = await prisma.medicalReport.findFirst({ where: { id, uploadedById: req.userId! } });
    } else {
      existing = await prisma.medicalReport.findFirst({ where: { id, userId: req.userId! } });
    }
    if (!existing) return res.status(404).json({ error: "Not found" });
    await prisma.medicalReport.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

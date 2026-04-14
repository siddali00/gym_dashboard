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
  const reports = await prisma.medicalReport.findMany({
    where: { userId: req.userId },
    orderBy: { addedAt: "desc" },
  });
  return res.json(reports);
});

router.post("/", upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, doctor, date, notes } = req.body;
    const report = await prisma.medicalReport.create({
      data: {
        userId: req.userId!,
        title,
        type,
        doctor,
        date,
        notes,
        fileName: req.file?.originalname,
        filePath: req.file?.path,
      },
    });
    return res.json(report);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

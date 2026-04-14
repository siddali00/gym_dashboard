import { Router, Response } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/day/:date", async (req: AuthRequest, res: Response) => {
  const date = req.params.date as string;
  const day = await prisma.foodDay.findUnique({
    where: { userId_date: { userId: req.userId!, date } },
  });
  return res.json(day);
});

router.put("/day/:date", async (req: AuthRequest, res: Response) => {
  try {
    const date = req.params.date as string;
    const day = await prisma.foodDay.upsert({
      where: { userId_date: { userId: req.userId!, date } },
      update: { meals: req.body.meals },
      create: { userId: req.userId!, date, meals: req.body.meals },
    });
    return res.json(day);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/custom-foods", async (req: AuthRequest, res: Response) => {
  const foods = await prisma.customFood.findMany({ where: { userId: req.userId } });
  return res.json(foods);
});

router.post("/custom-foods", async (req: AuthRequest, res: Response) => {
  try {
    const { name, kcal, pro, cho, fat, fib } = req.body;
    const food = await prisma.customFood.create({
      data: { userId: req.userId!, name, kcal, pro: pro || 0, cho: cho || 0, fat: fat || 0, fib: fib || 0 },
    });
    return res.json(food);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;

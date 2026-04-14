import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import metricsRoutes from "./routes/metrics";
import foodRoutes from "./routes/food";
import reportsRoutes from "./routes/reports";
import appointmentsRoutes from "./routes/appointments";
import profileRoutes from "./routes/profile";
import biomarkersRoutes from "./routes/biomarkers";
import nutritionRoutes from "./routes/nutrition";
import workoutsRoutes from "./routes/workouts";
import supplementsRoutes from "./routes/supplements";
import linksRoutes from "./routes/links";

export const prisma = new PrismaClient();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/biomarkers", biomarkersRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/workouts", workoutsRoutes);
app.use("/api/supplements", supplementsRoutes);
app.use("/api/links", linksRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

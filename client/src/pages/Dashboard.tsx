import { useState } from "react";
import { DashLayout } from "../components/DashLayout";
import { Home } from "./Home";
import { SelfMetrics } from "./SelfMetrics";
import { FoodDiary } from "./FoodDiary";
import { MedicalReports } from "./MedicalReports";
import { Appointments } from "./Appointments";
import { Biomarkers, NutritionPlan, Workouts, Supplements } from "./Placeholders";
import { MySpecialists } from "./MySpecialists";
import { Privacy } from "./Privacy";
import { useI18n } from "../i18n";

const PAGES: Record<string, React.FC<{ setPage: (p: string) => void }>> = {
  home: Home,
  metrics: SelfMetrics as any,
  food: FoodDiary as any,
  biomarkers: Biomarkers as any,
  nutrition: NutritionPlan as any,
  workouts: Workouts as any,
  supplements: Supplements as any,
  referti: MedicalReports as any,
  appointments: Appointments as any,
  specialists: MySpecialists as any,
  privacy: Privacy as any,
};

export function Dashboard() {
  const { t } = useI18n();
  const [page, setPage] = useState("home");
  const Page = PAGES[page] || Home;
  const nav = [
    { id: "home", icon: "🏠", label: t("nav_home") },
    { id: "metrics", icon: "📊", label: t("nav_metrics") },
    { id: "food", icon: "🍽️", label: t("nav_food") },
    { id: "biomarkers", icon: "🔬", label: t("nav_biomarkers") },
    { id: "nutrition", icon: "🥗", label: t("nav_nutrition") },
    { id: "workouts", icon: "🏋️", label: t("nav_workouts") },
    { id: "supplements", icon: "💊", label: t("nav_supplements") },
    { id: "referti", icon: "📋", label: t("nav_reports") },
    { id: "appointments", icon: "📅", label: t("nav_appointments") },
    { id: "specialists", icon: "👥", label: t("nav_specialists") },
    { id: "privacy", icon: "🔒", label: t("nav_privacy") },
  ];

  return (
    <DashLayout nav={nav} active={page} setActive={setPage}>
      <Page setPage={setPage} />
    </DashLayout>
  );
}

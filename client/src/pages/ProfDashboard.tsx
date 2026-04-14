import { useState, useEffect } from "react";
import { DashLayout } from "../components/DashLayout";
import { useAuth } from "../store";
import { useI18n, type TKey } from "../i18n";
import { api } from "../api";
import { ProfHome } from "./ProfHome";
import { ClientListPage } from "./ClientListPage";
import { Appointments } from "./Appointments";
import { EntBiomarker } from "./EntBiomarker";
import { EntNutrition } from "./EntNutrition";
import { EntWorkout } from "./EntWorkout";
import { EntSupplement } from "./EntSupplement";
import { EntMetrics } from "./EntMetrics";
import { MedicalReports } from "./MedicalReports";

interface NavItem { id: string; icon: string; label: string }

const ROLE_NAV: Record<string, Array<{ id: string; icon: string; labelKey: TKey }>> = {
  medico: [
    { id: "enter-bm", icon: "🔬", labelKey: "prof_nav_enter_bm" },
    { id: "enter-reports", icon: "📋", labelKey: "prof_nav_enter_reports" },
  ],
  nutrizionista: [
    { id: "enter-nutri", icon: "🥗", labelKey: "prof_nav_enter_nutri" },
    { id: "enter-suppl", icon: "💊", labelKey: "prof_nav_enter_suppl" },
  ],
  fabbro: [
    { id: "enter-metrics", icon: "📐", labelKey: "prof_nav_enter_metrics" },
  ],
  coach_di_ferro: [
    { id: "enter-workout", icon: "🏋️", labelKey: "prof_nav_enter_workout" },
    { id: "enter-metrics", icon: "📐", labelKey: "prof_nav_enter_metrics" },
    { id: "enter-suppl", icon: "💊", labelKey: "prof_nav_enter_suppl" },
  ],
};

export function ProfDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [page, setPage] = useState("home");
  const [clients, setClients] = useState<any[]>([]);
  const [selClient, setSelClient] = useState<number | null>(null);

  useEffect(() => {
    api.getMyClients().then(setClients).catch(() => {});
  }, []);

  const refreshClients = () => api.getMyClients().then(setClients).catch(() => {});

  if (!user) return null;
  const role = user.role;

  const baseNav: NavItem[] = [
    { id: "home", icon: "🏠", label: t("prof_nav_home") },
    { id: "clients", icon: "👥", label: t("prof_nav_clients") },
    { id: "appointments", icon: "📅", label: t("prof_nav_appointments") },
  ];
  const roleSpecific = (ROLE_NAV[role] || []).map((n) => ({
    id: n.id,
    icon: n.icon,
    label: t(n.labelKey),
  }));
  const nav = [...baseNav, ...roleSpecific];

  return (
    <DashLayout nav={nav} active={page} setActive={setPage}>
      {page === "home" && <ProfHome clients={clients} setPage={setPage} />}
      {page === "clients" && <ClientListPage clients={clients} refresh={refreshClients} />}
      {page === "appointments" && <Appointments clients={clients} selected={selClient} onSelect={setSelClient} />}
      {page === "enter-bm" && <EntBiomarker clients={clients} selected={selClient} onSelect={setSelClient} />}
      {page === "enter-reports" && <MedicalReports clients={clients} selected={selClient} onSelect={setSelClient} />}
      {page === "enter-nutri" && <EntNutrition clients={clients} selected={selClient} onSelect={setSelClient} />}
      {page === "enter-suppl" && <EntSupplement clients={clients} selected={selClient} onSelect={setSelClient} />}
      {page === "enter-metrics" && <EntMetrics clients={clients} selected={selClient} onSelect={setSelClient} />}
      {page === "enter-workout" && <EntWorkout clients={clients} selected={selClient} onSelect={setSelClient} />}
    </DashLayout>
  );
}

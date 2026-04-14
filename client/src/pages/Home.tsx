import { useState, useEffect } from "react";
import { PageHead, InfoBox } from "../components/ui";
import { api } from "../api";
import { useAuth } from "../store";
import { useI18n } from "../i18n";

export function Home({ setPage }: { setPage: (p: string) => void }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [counts, setCounts] = useState({ metrics: 0, foodDays: 0, reports: 0, appointments: 0 });

  useEffect(() => {
    Promise.all([
      api.getMetrics().then((d) => d.length).catch(() => 0),
      api.getReports().then((d) => d.length).catch(() => 0),
      api.getAppointments().then((d) => d.length).catch(() => 0),
    ]).then(([metrics, reports, appointments]) => {
      setCounts((c) => ({ ...c, metrics, reports, appointments }));
    });
  }, []);

  const kpis = [
    { icon: "📊", label: t("kpi_metrics"), val: counts.metrics, page: "metrics", color: "text-green" },
    { icon: "🍽️", label: t("kpi_food"), val: "→", page: "food", color: "text-amber" },
    { icon: "📋", label: t("kpi_reports"), val: counts.reports, page: "referti", color: "text-purple" },
    { icon: "📅", label: t("kpi_appointments"), val: counts.appointments, page: "appointments", color: "text-blue" },
    { icon: "🔬", label: t("kpi_biomarkers"), val: "—", page: "biomarkers", color: "text-accent" },
    { icon: "🏋️", label: t("kpi_workouts"), val: "—", page: "workouts", color: "text-blue" },
  ];

  return (
    <>
      <PageHead title={t("home_title")} accent={t("home_accent")} sub={t("home_sub", { name: user?.name || "" })} />

      {counts.metrics === 0 && (
        <InfoBox icon="👋" title={t("home_start_title")} body={t("home_start_body")} />
      )}

      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {kpis.map((k) => (
          <div
            key={k.label}
            onClick={() => setPage(k.page)}
            className="bg-card border border-border rounded-xl p-[14px_10px] text-center cursor-pointer hover:border-accent/30 transition-colors"
          >
            <div className="text-[22px] mb-1.5">{k.icon}</div>
            <div className={`font-bebas text-[30px] ${k.color}`}>{k.val}</div>
            <div className="text-[10px] text-muted uppercase tracking-[.1em] mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <InfoBox
        icon="🔒"
        title={t("home_data_safe_title")}
        body={t("home_data_safe_body")}
        color="accent"
      />
    </>
  );
}

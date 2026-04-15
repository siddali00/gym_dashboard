import { PageHead, Card, Badge, Empty } from "../components/ui";
import { useAuth } from "../store";
import { useI18n } from "../i18n";

export function ProfHome({
  clients,
  setPage,
}: {
  clients: any[];
  setPage: (p: string) => void;
}) {
  const { user } = useAuth();
  const { t } = useI18n();
  if (!user) return null;

  const ROLE_LABELS: Record<string, string> = {
    medico: "Medico",
    nutrizionista: "Nutrizionista",
    fabbro: "Fabbro",
    coach_di_ferro: "Coach di Ferro",
  };

  return (
    <>
      <PageHead
        title={t("prof_home_title")}
        accent={t("prof_home_accent")}
        sub={t("prof_home_welcome", { name: user.name })}
      />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card className="p-4 text-center">
          <div className="font-bebas text-3xl text-accent">{clients.length}</div>
          <div className="text-[11px] text-muted">{t("prof_kpi_clients")}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="font-bebas text-lg">{ROLE_LABELS[user.role] || user.role}</div>
          <div className="text-[11px] text-muted">{t("prof_kpi_role")}</div>
        </Card>
        <Card className="p-4 text-center">
          <Badge color="ok">{t("prof_gdpr_ok")}</Badge>
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-border font-bebas text-sm">
          👥 {t("prof_nav_clients")} ({clients.length})
        </div>
        <div className="px-4">
          {clients.length === 0 ? (
            <Empty icon="👥" msg={t("prof_no_clients")} sub={t("prof_no_clients_sub")} />
          ) : (
            clients.map((c: any) => {
              const stats = c.stats || { bm: 0, metrics: 0, total: 0 };
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 py-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent/[.04] -mx-4 px-4 transition-colors"
                  onClick={() => setPage("clients")}
                >
                  <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs shrink-0">
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{c.name}</div>
                    <div className="text-[11px] text-muted truncate">{c.email}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold">{stats.bm} BM</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">{stats.metrics} Mis</span>
                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold">{stats.total} Tot</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </>
  );
}

import { PageHead, Card, Empty } from "../components/ui";
import { useI18n } from "../i18n";

function StatPill({ val, label, color }: { val: number; label: string; color: string }) {
  return (
    <div className={`flex-1 rounded-lg py-1.5 text-center ${color}`}>
      <div className="font-bebas text-lg leading-none">{val}</div>
      <div className="text-[9px] text-muted mt-0.5">{label}</div>
    </div>
  );
}

export function ClientListPage({ clients }: { clients: any[]; refresh: () => void }) {
  const { t } = useI18n();

  return (
    <>
      <PageHead title={t("cl_title")} accent={t("cl_accent")} sub={t("cl_sub")} />

      {clients.length === 0 ? (
        <Card>
          <div className="py-10">
            <Empty icon="👥" msg={t("cl_empty")} sub={t("cl_empty_sub")} />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {clients.map((c: any) => {
            const stats = c.stats || { bm: 0, metrics: 0, total: 0 };
            return (
              <Card key={c.id}>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                      {c.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold truncate">{c.name}</div>
                      <div className="text-[11px] text-muted truncate">{c.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <StatPill val={stats.bm} label={t("cl_stat_bm")} color="bg-red-500/10 text-red-400" />
                    <StatPill val={stats.metrics} label={t("cl_stat_metrics")} color="bg-blue-500/10 text-blue-400" />
                    <StatPill val={stats.total} label={t("cl_stat_total")} color="bg-green-500/10 text-green-400" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

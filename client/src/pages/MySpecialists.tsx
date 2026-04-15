import { useState, useEffect } from "react";
import { PageHead, Card, CardHead, Inp, Sel, InfoBox, Empty } from "../components/ui";
import { ROLE_INFO } from "../data/constants";
import { api } from "../api";
import { useI18n, type TKey } from "../i18n";

const ROLE_KEYS = ["medico", "nutrizionista", "fabbro", "coach_di_ferro"];

export function MySpecialists() {
  const { t } = useI18n();
  const [allPros, setAllPros] = useState<any[]>([]);
  const [myIds, setMyIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getAllProfessionals().catch(() => []),
      api.getMyProfessionals().catch(() => []),
    ]).then(([all, mine]) => {
      setAllPros(Array.isArray(all) ? all : []);
      setMyIds(new Set((Array.isArray(mine) ? mine : []).map((p: any) => p.id)));
      setLoading(false);
    });
  }, []);

  async function assignPro(id: number) {
    try {
      await api.addProfessional(id);
      setMyIds((s) => new Set(s).add(id));
    } catch {}
  }

  async function removePro(id: number) {
    try {
      await api.removeProfessional(id);
      setMyIds((s) => { const n = new Set(s); n.delete(id); return n; });
    } catch {}
  }

  const myPros = allPros.filter((p) => myIds.has(p.id));
  const available = allPros.filter((p) => {
    if (myIds.has(p.id)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && p.role !== roleFilter) return false;
    return true;
  });

  return (
    <>
      <PageHead title={t("spec_title")} accent={t("spec_accent")} sub={t("spec_sub")} />

      <InfoBox icon="🔒" title={t("spec_control_title")} body={t("spec_control_body")} color="accent" />

      {/* Assigned team */}
      <div className="mb-4">
        <h3 className="font-bebas text-sm text-muted uppercase tracking-wider mb-2.5">
          {t("spec_team")} ({myPros.length})
        </h3>
        {myPros.length === 0 ? (
          <Card><div className="p-6"><Empty icon="👥" msg={t("spec_empty")} /></div></Card>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {myPros.map((p) => {
              const info = ROLE_INFO[p.role] || { icon: "👤", titleKey: "role_client" };
              return (
                <Card key={p.id}>
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl mb-2">
                      {info.icon}
                    </div>
                    <div className="text-[14px] font-semibold">{p.name}</div>
                    <div className="text-[12px] text-green-400 mb-0.5">{t(info.titleKey as TKey)}</div>
                    <div className="text-[11px] text-muted mb-3">{p.email}</div>
                    <button
                      type="button"
                      onClick={() => removePro(p.id)}
                      className="w-full py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 cursor-pointer hover:bg-red-500/20 transition-colors"
                    >
                      {t("spec_remove")}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Search & assign */}
      <Card>
        <CardHead><span className="font-bebas text-sm">🔍 {t("spec_search_head")}</span></CardHead>
        <div className="p-4">
          <div className="flex gap-2.5 mb-4">
            <div className="flex-1 min-w-0">
              <Inp
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("spec_search_ph")}
              />
            </div>
            <div className="w-[180px] shrink-0">
              <Sel value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">{t("spec_all_roles")}</option>
                {ROLE_KEYS.map((r) => {
                  const info = ROLE_INFO[r];
                  return <option key={r} value={r}>{info ? t(info.titleKey as TKey) : r}</option>;
                })}
              </Sel>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted text-sm">...</div>
          ) : available.length === 0 ? (
            <Empty icon="👥" msg={t("spec_empty")} />
          ) : (
            available.map((p) => {
              const info = ROLE_INFO[p.role] || { icon: "👤", titleKey: "role_client" };
              return (
                <div key={p.id} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-lg shrink-0">
                    {info.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold">{p.name}</div>
                    <div className="text-[11px] text-accent/70">{t(info.titleKey as TKey)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => assignPro(p.id)}
                    className="px-3 py-1.5 text-[11px] font-bold rounded-md bg-green-500/20 text-green-400 border border-green-500/30 cursor-pointer hover:bg-green-500/30 transition-colors"
                  >
                    {t("spec_assign")}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </>
  );
}

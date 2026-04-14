import { useState, useEffect } from "react";
import { PageHead, Card, CardHead, InfoBox, Badge, Empty } from "../components/ui";
import { api } from "../api";
import { useI18n } from "../i18n";

function AddedByFooter({ item }: { item: any }) {
  const { t } = useI18n();
  const name = item.addedBy?.name || "—";
  return (
    <div className="text-[10px] text-muted mt-1.5 flex items-center gap-1">
      <span className="inline-block w-3 h-3 rounded-full bg-accent/15 text-center text-[8px] leading-[12px]">👤</span>
      {t("added_by", { name })} · {new Date(item.addedAt).toLocaleDateString("it-IT")}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-muted uppercase tracking-wider">{label}</span>
      <span className="text-[12px] font-medium">{value}</span>
    </div>
  );
}

/* ─── BIOMARKERS ─── */
export function Biomarkers() {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.getBiomarkers().then(setItems).catch(() => {}); }, []);

  return (
    <>
      <PageHead title={t("bm_title")} accent={t("bm_accent")} sub={t("bm_sub")} />
      <InfoBox icon="🔒" title={t("ro_title")} body={t("ro_body_suffix")} />
      <Card>
        <CardHead>
          <span className="font-bebas text-sm">🔬 {t("bm_title")} {t("bm_accent")} ({items.length})</span>
        </CardHead>
        <div className="px-4">
          {items.length === 0 ? (
            <Empty icon="🔬" msg={t("bm_empty_msg")} sub={t("bm_empty_sub")} />
          ) : (
            items.map((bm) => (
              <div key={bm.id} className="py-3 border-b border-border last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-lg shrink-0 mt-0.5">🔬</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-semibold">{bm.name}</span>
                      <Badge color={bm.status === "normale" ? "ok" : "warn"}>{bm.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
                      <div className="text-[13px]">
                        <span className="font-mono font-semibold text-accent">{bm.value}</span>
                        {bm.unit && <span className="text-[11px] text-muted ml-0.5">{bm.unit}</span>}
                      </div>
                      {(bm.refMin || bm.refMax) && (
                        <div className="text-[11px] text-muted">
                          Ref: {bm.refMin || "—"} – {bm.refMax || "—"} {bm.unit || ""}
                        </div>
                      )}
                    </div>
                    {bm.category && <div className="text-[11px] text-muted">{bm.category}</div>}
                    {bm.date && <div className="text-[11px] text-muted">📅 {bm.date}</div>}
                    {bm.notes && <div className="text-[11px] text-muted/70 italic mt-1">{bm.notes}</div>}
                    <AddedByFooter item={bm} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

/* ─── NUTRITION PLANS ─── */
export function NutritionPlan() {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.getNutritionPlans().then(setItems).catch(() => {}); }, []);

  return (
    <>
      <PageHead title={t("nu_title")} accent={t("nu_accent")} sub={t("nu_sub")} />
      <InfoBox icon="🔒" title={t("ro_title")} body={t("ro_body_suffix")} />
      <Card>
        <CardHead>
          <span className="font-bebas text-sm">🥗 {t("nu_title")} {t("nu_accent")} ({items.length})</span>
        </CardHead>
        <div className="px-4">
          {items.length === 0 ? (
            <Empty icon="🥗" msg={t("nu_empty_msg")} sub={t("nu_empty_sub")} />
          ) : (
            items.map((n) => (
              <div key={n.id} className="py-3 border-b border-border last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-lg shrink-0 mt-0.5">🥗</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold mb-1.5">{n.title}</div>
                    <div className="flex flex-wrap gap-2 mb-1.5">
                      {n.calories && (
                        <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-[11px] font-medium">
                          🔥 {n.calories} kcal
                        </span>
                      )}
                      {n.protein && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-medium">
                          P {n.protein}g
                        </span>
                      )}
                      {n.carbs && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-medium">
                          C {n.carbs}g
                        </span>
                      )}
                      {n.fat && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[11px] font-medium">
                          G {n.fat}g
                        </span>
                      )}
                      {n.fiber && (
                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[11px] font-medium">
                          F {n.fiber}g
                        </span>
                      )}
                    </div>
                    {n.notes && <div className="text-[11px] text-muted/70 italic mt-1">{n.notes}</div>}
                    <AddedByFooter item={n} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

/* ─── WORKOUTS ─── */
export function Workouts() {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.getWorkouts().then(setItems).catch(() => {}); }, []);

  return (
    <>
      <PageHead title={t("wo_title")} accent={t("wo_accent")} sub={t("wo_sub")} />
      <InfoBox icon="🔒" title={t("ro_title")} body={t("ro_body_suffix")} />
      <Card>
        <CardHead>
          <span className="font-bebas text-sm">🏋️ {t("wo_title")} {t("wo_accent")} ({items.length})</span>
        </CardHead>
        <div className="px-4">
          {items.length === 0 ? (
            <Empty icon="🏋️" msg={t("wo_empty_msg")} sub={t("wo_empty_sub")} />
          ) : (
            items.map((w) => (
              <div key={w.id} className="py-3 border-b border-border last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-lg shrink-0 mt-0.5">🏋️</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold mb-1.5">{w.name}</div>
                    <div className="flex flex-wrap gap-2 mb-1.5">
                      {w.type && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-medium">
                          {w.type}
                        </span>
                      )}
                      {w.level && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-medium">
                          {w.level}
                        </span>
                      )}
                      {w.weeks && (
                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[11px] font-medium">
                          📅 {w.weeks} {t("wo_weeks_suffix")}
                        </span>
                      )}
                    </div>
                    {w.notes && <div className="text-[11px] text-muted/70 italic mt-1">{w.notes}</div>}
                    <AddedByFooter item={w} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

/* ─── SUPPLEMENTS ─── */
export function Supplements() {
  const { t } = useI18n();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api.getSupplements().then(setItems).catch(() => {}); }, []);

  return (
    <>
      <PageHead title={t("su_title")} accent={t("su_accent")} sub={t("su_sub")} />
      <InfoBox icon="🔒" title={t("ro_title")} body={t("ro_body_suffix")} />
      <Card>
        <CardHead>
          <span className="font-bebas text-sm">💊 {t("su_title")} {t("su_accent")} ({items.length})</span>
        </CardHead>
        <div className="px-4">
          {items.length === 0 ? (
            <Empty icon="💊" msg={t("su_empty_msg")} sub={t("su_empty_sub")} />
          ) : (
            items.map((s) => (
              <div key={s.id} className="py-3 border-b border-border last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-lg shrink-0 mt-0.5">💊</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-semibold">{s.name}</span>
                      <Badge color="ok">{t("su_active")}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-1.5">
                      {s.category && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[11px] font-medium">
                          {s.category}
                        </span>
                      )}
                      {s.dosage && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-medium">
                          💧 {s.dosage}
                        </span>
                      )}
                      {s.frequency && (
                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[11px] font-medium">
                          🔁 {s.frequency}
                        </span>
                      )}
                    </div>
                    {s.notes && <div className="text-[11px] text-muted/70 italic mt-1">{s.notes}</div>}
                    <AddedByFooter item={s} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

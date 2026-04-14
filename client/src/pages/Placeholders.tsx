import { useState, useEffect } from "react";
import { PageHead, Card, CardHead, InfoBox, Badge, Empty } from "../components/ui";
import { api } from "../api";
import { useI18n } from "../i18n";

function AddedByFooter({ item }: { item: any }) {
  const { t } = useI18n();
  const name = item.addedBy?.name || "—";
  return (
    <div className="text-[10px] text-muted mt-1">
      {t("added_by", { name })} · {new Date(item.addedAt).toLocaleDateString("it-IT")}
    </div>
  );
}

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
              <div key={bm.id} className="py-[11px] border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{bm.name}</div>
                    {bm.category && <div className="text-[11px] text-muted">{bm.category}</div>}
                  </div>
                  <div className="font-mono text-sm font-semibold">
                    {bm.value}
                    {bm.unit && <span className="text-[10px] text-muted ml-1">{bm.unit}</span>}
                  </div>
                  <Badge color={bm.status === "normale" ? "ok" : "warn"}>{bm.status}</Badge>
                </div>
                <AddedByFooter item={bm} />
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

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
              <div key={n.id} className="py-[11px] border-b border-border">
                <div className="text-[13px] font-medium mb-1">{n.title}</div>
                <div className="flex gap-2.5 text-xs text-muted">
                  {n.calories && <span>🔥 {n.calories}kcal</span>}
                  {n.protein && <span>P {n.protein}g</span>}
                  {n.carbs && <span>C {n.carbs}g</span>}
                  {n.fat && <span>G {n.fat}g</span>}
                </div>
                <AddedByFooter item={n} />
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

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
              <div key={w.id} className="py-[11px] border-b border-border">
                <div className="text-[13px] font-medium mb-1">{w.name}</div>
                <div className="text-[11px] text-muted">
                  {w.type} · {w.level} · {w.weeks} {t("wo_weeks_suffix")}
                </div>
                <AddedByFooter item={w} />
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

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
              <div key={s.id} className="py-[11px] border-b border-border flex items-center gap-2.5">
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{s.name}</div>
                  {s.category && <div className="text-[11px] text-muted">{s.category}</div>}
                </div>
                {s.dosage && <div className="text-xs text-muted">{s.dosage}</div>}
                <Badge color="ok">{t("su_active")}</Badge>
                <AddedByFooter item={s} />
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

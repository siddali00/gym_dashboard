import { useState, useEffect } from "react";
import { PageHead, Card, CardHead, FG, Inp, Btn, OkMsg, Badge, Empty } from "../components/ui";
import { METRIC_CATS } from "../data/constants";
import { api } from "../api";
import { metricFieldKey, useI18n, type TKey } from "../i18n";

export function SelfMetrics() {
  const { t } = useI18n();
  const [cat, setCat] = useState("corpo");
  const [form, setForm] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [ok, setOk] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api.getMetrics().then(setHistory).catch(() => {});
  }, []);

  async function save() {
    const vals = Object.entries(form)
      .filter(([, v]) => v !== "")
      .map(([k, v]) => {
        const fd = Object.values(METRIC_CATS).flatMap((c) => c.fields).find((f) => f.k === k);
        return { key: k, value: v, unit: fd?.u || "" };
      });
    if (!vals.length) return;

    const peso = parseFloat(form.peso || "0");
    const alt = parseFloat(form.altezza || "0");
    const bmi = cat === "corpo" && peso && alt ? parseFloat((peso / Math.pow(alt / 100, 2)).toFixed(1)) : null;

    const metric = await api.addMetric({ category: cat, date, values: vals, bmi });
    setHistory((h) => [metric, ...h]);
    setForm({});
    setOk(t("sm_saved"));
    setTimeout(() => setOk(""), 3000);
  }

  const catInfo = METRIC_CATS[cat];
  const catLabel = t(`mc_${cat}` as TKey);
  const bmiVal =
    cat === "corpo" && form.peso && form.altezza
      ? (parseFloat(form.peso) / Math.pow(parseFloat(form.altezza) / 100, 2)).toFixed(1)
      : null;

  function fieldLabel(fd: { k: string; l: string; u: string }) {
    const name = t(metricFieldKey(fd.k));
    return `${name}${fd.u ? ` (${fd.u})` : ""}`;
  }

  function categoryLabelForHistory(category: string) {
    const k = category as keyof typeof METRIC_CATS;
    return METRIC_CATS[k] ? t(`mc_${k}` as TKey) : category;
  }

  return (
    <>
      <PageHead title={t("sm_title")} accent={t("sm_accent")} sub={t("sm_sub")} />

      <div className="flex gap-2 flex-wrap mb-[18px]">
        {Object.entries(METRIC_CATS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => { setCat(k); setForm({}); }}
            className={`px-3.5 py-[7px] rounded-full border text-xs cursor-pointer transition-colors ${
              cat === k ? "border-accent/50 bg-accent/10 text-accent" : "border-border bg-transparent text-muted hover:bg-white/[.03]"
            }`}
          >
            {v.icon} {t(`mc_${k}` as TKey)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <Card>
          <CardHead>
            <span className="font-bebas text-sm">
              {catInfo.icon} {t("sm_insert")} {catLabel.toUpperCase()}
            </span>
          </CardHead>
          <div className="p-[18px]">
            <FG label={t("sm_label_date")}>
              <Inp type="date" value={date} onChange={(e) => setDate(e.target.value)} className="max-w-[180px]" />
            </FG>
            {cat === "corpo" && (
              <FG label={t("sm_label_height_bmi")}>
                <Inp
                  type="number"
                  value={form.altezza || ""}
                  onChange={(e) => setForm((f) => ({ ...f, altezza: e.target.value }))}
                  placeholder="es. 178"
                  className="max-w-[180px]"
                />
              </FG>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {catInfo.fields.map((fd) => (
                <FG key={fd.k} label={fieldLabel(fd)}>
                  <Inp
                    type={fd.t || "number"}
                    value={form[fd.k] || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [fd.k]: e.target.value }))}
                    placeholder="—"
                  />
                </FG>
              ))}
            </div>
            {bmiVal && (
              <div className="bg-el rounded-lg px-3.5 py-2.5 mb-2.5 text-[13px]">
                {t("sm_bmi_calc")} <strong className="text-accent">{bmiVal}</strong>
              </div>
            )}
            <OkMsg msg={ok} />
            <Btn onClick={save} className="w-full mt-2">{t("sm_save")}</Btn>
          </div>
        </Card>

        <Card>
          <CardHead>
            <span className="font-bebas text-sm">📅 {t("sm_latest")}</span>
          </CardHead>
          <div className="px-3.5 max-h-[420px] overflow-y-auto">
            {history.length === 0 ? (
              <Empty icon="📊" msg={t("sm_empty_msg")} sub={t("sm_empty_sub")} />
            ) : (
              history.slice(0, 15).map((e, i) => (
                <div key={i} className="py-2.5 border-b border-border">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-muted">{e.date}</span>
                    <Badge color="muted">{categoryLabelForHistory(e.category)}</Badge>
                  </div>
                  {(e.values as any[])?.map((v: any, j: number) => (
                    <div key={j} className="text-xs text-sec flex justify-between">
                      <span>{t(metricFieldKey(v.key))}</span>
                      <span className="font-mono text-text">
                        {v.value} <span className="text-muted text-[10px]">{v.unit}</span>
                      </span>
                    </div>
                  ))}
                  {e.bmi && <div className="text-xs text-accent mt-0.5">{t("sm_bmi_prefix")} {e.bmi}</div>}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

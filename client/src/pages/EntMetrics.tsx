import { useState, useEffect, useRef } from "react";
import { PageHead, Card, CardHead, FG, Inp, Sel, Txta, Btn, OkMsg, Empty } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ClientSelector } from "../components/ClientSelector";
import { api } from "../api";
import { useI18n } from "../i18n";

const METRIC_TYPES = [
  "Peso (kg)", "% Massa Grassa", "Massa Muscolare (kg)", "Acqua Corporea (%)",
  "Vita (cm)", "Fianchi (cm)", "Petto (cm)", "Braccia (cm)", "Coscia (cm)", "Polpacci (cm)",
  "Pressione Sistolica (mmHg)", "Pressione Diastolica (mmHg)", "FC a Riposo (bpm)",
  "HRV (ms)", "SpO2 (%)", "Temperatura (°C)",
];

function summarizeValues(values: any): string {
  if (!Array.isArray(values)) return "";
  return values.map((v: any) => `${v.key}: ${v.value}${v.unit ? " " + v.unit : ""}`).join(", ");
}

function valuesMatchType(values: any): string {
  if (!Array.isArray(values) || values.length === 0) return METRIC_TYPES[0];
  const v = values[0];
  const match = METRIC_TYPES.find((mt) => {
    const m = mt.match(/^(.+?)\s*\((.+?)\)$/);
    if (!m) return false;
    return m[1].toLowerCase().replace(/[^a-z]/g, "_") === v.key;
  });
  return match || METRIC_TYPES[0];
}

function valuesGetValue(values: any): string {
  if (!Array.isArray(values) || values.length === 0) return "";
  return String(values[0].value || "");
}

const emptyForm = () => ({
  type: METRIC_TYPES[0], value: "",
  date: new Date().toISOString().split("T")[0], notes: "",
});

export function EntMetrics({
  clients, selected, onSelect,
}: { clients: any[]; selected: number | null; onSelect: (id: number | null) => void }) {
  const { t } = useI18n();
  const formCardRef = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => { api.getMetrics().then(setItems).catch(() => {}); }, []);

  function startEdit(m: any) {
    setEditingId(m.id);
    setForm({
      type: valuesMatchType(m.values),
      value: valuesGetValue(m.values),
      date: m.date || new Date().toISOString().split("T")[0],
      notes: "",
    });
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  async function save() {
    if (!form.value || !form.date) return;
    if (editingId == null && !selected) return;
    setErr("");
    const typeMatch = form.type.match(/^(.+?)\s*\((.+?)\)$/);
    const key = typeMatch ? typeMatch[1].toLowerCase().replace(/[^a-z]/g, "_") : form.type;
    const unit = typeMatch ? typeMatch[2] : "";

    try {
      if (editingId != null) {
        const updated = await api.updateMetric(editingId, {
          category: "pro_entry",
          date: form.date,
          values: [{ key, value: form.value, unit }],
        });
        setItems((l) => l.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
        setOk(t("ent_me_updated"));
      } else {
        const metric = await api.addMetric({
          category: "pro_entry",
          date: form.date,
          values: [{ key, value: form.value, unit }],
          clientId: selected,
        });
        setItems((l) => [metric, ...l]);
        setForm(emptyForm());
        setOk(t("ent_me_saved"));
      }
      setTimeout(() => setOk(""), 3000);
    } catch (e: any) {
      setErr(e?.message || "Error");
    }
  }

  async function remove(id: number) {
    await api.deleteMetric(id);
    setItems((l) => l.filter((x) => x.id !== id));
    setConfirmId(null);
    if (editingId === id) cancelEdit();
  }

  return (
    <>
      <PageHead title={t("ent_me_title")} accent={t("ent_me_accent")} />
      <div className="grid grid-cols-2 gap-4">
        <Card ref={formCardRef}>
          <CardHead>
            <span className="font-bebas text-sm">
              {editingId != null ? t("ent_me_edit_head") : t("ent_me_new_head")}
            </span>
          </CardHead>
          <div className="p-[18px]">
            <ClientSelector clients={clients} selected={selected} onSelect={onSelect} />
            <FG label={t("ent_me_type")}><Sel value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>{METRIC_TYPES.map((mt) => <option key={mt} value={mt}>{mt}</option>)}</Sel></FG>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("ent_me_value")}><Inp type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} /></FG>
              <FG label={t("ent_me_date")}><Inp type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></FG>
            </div>
            <FG label={t("ent_me_notes")}><Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} /></FG>
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <OkMsg msg={ok} />
            <div className="flex gap-2">
              {editingId != null && (
                <Btn variant="outline" onClick={cancelEdit} className="flex-1">
                  {t("ent_me_cancel_edit")}
                </Btn>
              )}
              <Btn onClick={save} className="flex-[2]">
                {editingId != null ? t("ent_me_save_update") : t("ent_me_save")}
              </Btn>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">{t("ent_audit_footer")}</p>
          </div>
        </Card>

        <Card>
          <CardHead><span className="font-bebas text-sm">{t("ent_recent")} ({items.length})</span></CardHead>
          <div className="px-4 max-h-[550px] overflow-y-auto">
            {items.length === 0 ? <Empty icon="📐" msg={t("ent_no_entries")} /> : items.map((m) => (
              <div
                key={m.id}
                className={`py-[11px] border-b border-border ${editingId === m.id ? "bg-accent/[.06] -mx-2 px-2 rounded-lg" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{summarizeValues(m.values)}</div>
                    <div className="text-[11px] text-muted">{m.date} · {m.category}</div>
                    {m.user && <div className="text-[10px] text-accent/70">{t("ent_for_client", { name: m.user.name })}</div>}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(m)}
                      className="bg-transparent border border-border rounded-md px-2 py-0.5 text-[11px] text-muted cursor-pointer hover:text-accent hover:border-accent/30"
                    >
                      {t("ap_edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(m.id)}
                      className="text-[11px] text-muted hover:text-accent cursor-pointer bg-transparent border-none px-1 text-lg"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        onConfirm={() => confirmId !== null && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}

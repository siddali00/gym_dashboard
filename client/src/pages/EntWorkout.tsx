import { useState, useEffect, useRef } from "react";
import { PageHead, Card, CardHead, FG, Inp, Sel, Txta, Btn, OkMsg, Empty } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ClientSelector } from "../components/ClientSelector";
import { api } from "../api";
import { useI18n } from "../i18n";

const WORKOUT_TYPES = ["Body Building", "Powerlifting", "Functional", "Cardio", "Calisthenics", "CrossFit", "Rehab", "Sport Specifico"];
const WORKOUT_LEVELS = ["Principiante", "Intermedio", "Avanzato", "Agonista"];

const emptyForm = () => ({ name: "", type: "Body Building", level: "Intermedio", weeks: "4", notes: "" });

export function EntWorkout({
  clients, selected, onSelect,
}: { clients: any[]; selected: number | null; onSelect: (id: number | null) => void }) {
  const { t } = useI18n();
  const formRef = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm());

  useEffect(() => { api.getWorkouts().then(setItems).catch(() => {}); }, []);

  function startEdit(w: any) {
    setEditingId(w.id);
    setForm({
      name: w.name || "", type: w.type || "Body Building",
      level: w.level || "Intermedio", weeks: w.weeks || "4", notes: w.notes || "",
    });
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function cancelEdit() { setEditingId(null); setForm(emptyForm()); }

  async function save() {
    if (!form.name) return;
    if (editingId == null && !selected) return;
    setErr("");
    try {
      if (editingId != null) {
        const updated = await api.updateWorkout(editingId, form);
        setItems((l) => l.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
        setOk(t("ent_wo_updated"));
      } else {
        const item = await api.addWorkout({ clientId: selected, ...form });
        setItems((l) => [item, ...l]);
        setForm(emptyForm());
        setOk(t("ent_wo_saved"));
      }
      setTimeout(() => setOk(""), 3000);
    } catch (e: any) { setErr(e?.message || "Error"); }
  }

  async function remove(id: number) {
    await api.deleteWorkout(id);
    setItems((l) => l.filter((x) => x.id !== id));
    setConfirmId(null);
    if (editingId === id) cancelEdit();
  }

  return (
    <>
      <PageHead title={t("ent_wo_title")} accent={t("ent_wo_accent")} />
      <div className="grid grid-cols-2 gap-4">
        <Card ref={formRef}>
          <CardHead><span className="font-bebas text-sm">{editingId != null ? t("ent_wo_edit_head") : t("ent_wo_new_head")}</span></CardHead>
          <div className="p-[18px]">
            <ClientSelector clients={clients} selected={selected} onSelect={onSelect} />
            <FG label={t("ent_wo_name")}><Inp value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></FG>
            <div className="grid grid-cols-3 gap-2.5">
              <FG label={t("ent_wo_type")}><Sel value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>{WORKOUT_TYPES.map((wt) => <option key={wt} value={wt}>{wt}</option>)}</Sel></FG>
              <FG label={t("ent_wo_level")}><Sel value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}>{WORKOUT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}</Sel></FG>
              <FG label={t("ent_wo_weeks")}><Inp type="number" min={1} max={52} value={form.weeks} onChange={(e) => setForm((f) => ({ ...f, weeks: e.target.value }))} /></FG>
            </div>
            <FG label={t("ent_wo_notes")}><Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} /></FG>
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <OkMsg msg={ok} />
            <div className="flex gap-2">
              {editingId != null && <Btn variant="outline" onClick={cancelEdit} className="flex-1">{t("ent_cancel_edit")}</Btn>}
              <Btn onClick={save} className="flex-[2]">{editingId != null ? t("ent_save_update") : t("ent_wo_save")}</Btn>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">{t("ent_audit_footer")}</p>
          </div>
        </Card>

        <Card>
          <CardHead><span className="font-bebas text-sm">{t("ent_recent")} ({items.length})</span></CardHead>
          <div className="px-4 max-h-[550px] overflow-y-auto">
            {items.length === 0 ? <Empty icon="🏋️" msg={t("ent_no_entries")} /> : items.map((w) => (
              <div key={w.id} className={`py-[11px] border-b border-border ${editingId === w.id ? "bg-accent/[.06] -mx-2 px-2 rounded-lg" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{w.name}</div>
                    <div className="text-[11px] text-muted">{w.type} · {w.level} · {w.weeks} {t("wo_weeks_suffix")}</div>
                    {w.user && <div className="text-[10px] text-accent/70">{t("ent_for_client", { name: w.user.name })}</div>}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <button type="button" onClick={() => startEdit(w)} className="bg-transparent border border-border rounded-md px-2 py-0.5 text-[11px] text-muted cursor-pointer hover:text-accent hover:border-accent/30">{t("ap_edit")}</button>
                    <button type="button" onClick={() => setConfirmId(w.id)} className="text-muted hover:text-accent cursor-pointer bg-transparent border-none px-1 text-lg">×</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ConfirmDialog open={confirmId !== null} onConfirm={() => confirmId !== null && remove(confirmId)} onCancel={() => setConfirmId(null)} />
    </>
  );
}

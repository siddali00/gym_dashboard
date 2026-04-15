import { useState, useEffect, useRef } from "react";
import { PageHead, Card, CardHead, FG, Inp, Txta, Btn, OkMsg, Empty } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ClientSelector } from "../components/ClientSelector";
import { api } from "../api";
import { useI18n } from "../i18n";

const emptyForm = () => ({ title: "", calories: "", protein: "", carbs: "", fat: "", fiber: "", notes: "" });

export function EntNutrition({
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

  useEffect(() => { api.getNutritionPlans().then(setItems).catch(() => {}); }, []);

  function startEdit(n: any) {
    setEditingId(n.id);
    setForm({
      title: n.title || "", calories: n.calories || "", protein: n.protein || "",
      carbs: n.carbs || "", fat: n.fat || "", fiber: n.fiber || "", notes: n.notes || "",
    });
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function cancelEdit() { setEditingId(null); setForm(emptyForm()); }

  async function save() {
    if (!form.title) return;
    if (editingId == null && !selected) return;
    setErr("");
    try {
      if (editingId != null) {
        const updated = await api.updateNutritionPlan(editingId, form);
        setItems((l) => l.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
        setOk(t("ent_nu_updated"));
      } else {
        const item = await api.addNutritionPlan({ clientId: selected, ...form });
        setItems((l) => [item, ...l]);
        setForm(emptyForm());
        setOk(t("ent_nu_saved"));
      }
      setTimeout(() => setOk(""), 3000);
    } catch (e: any) { setErr(e?.message || "Error"); }
  }

  async function remove(id: number) {
    await api.deleteNutritionPlan(id);
    setItems((l) => l.filter((x) => x.id !== id));
    setConfirmId(null);
    if (editingId === id) cancelEdit();
  }

  return (
    <>
      <PageHead title={t("ent_nu_title")} accent={t("ent_nu_accent")} />
      <div className="grid grid-cols-2 gap-4">
        <Card ref={formRef}>
          <CardHead><span className="font-bebas text-sm">{editingId != null ? t("ent_nu_edit_head") : t("ent_nu_new_head")}</span></CardHead>
          <div className="p-[18px]">
            <ClientSelector clients={clients} selected={selected} onSelect={onSelect} />
            <FG label={t("ent_nu_plan_title")}><Inp value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></FG>
            <div className="grid grid-cols-3 gap-2.5">
              <FG label={t("ent_nu_calories")}><Inp type="number" value={form.calories} onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))} /></FG>
              <FG label={t("ent_nu_protein")}><Inp type="number" value={form.protein} onChange={(e) => setForm((f) => ({ ...f, protein: e.target.value }))} /></FG>
              <FG label={t("ent_nu_carbs")}><Inp type="number" value={form.carbs} onChange={(e) => setForm((f) => ({ ...f, carbs: e.target.value }))} /></FG>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("ent_nu_fat")}><Inp type="number" value={form.fat} onChange={(e) => setForm((f) => ({ ...f, fat: e.target.value }))} /></FG>
              <FG label={t("ent_nu_fiber")}><Inp type="number" value={form.fiber} onChange={(e) => setForm((f) => ({ ...f, fiber: e.target.value }))} /></FG>
            </div>
            <FG label={t("ent_nu_notes")}><Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} /></FG>
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <OkMsg msg={ok} />
            <div className="flex gap-2">
              {editingId != null && <Btn variant="outline" onClick={cancelEdit} className="flex-1">{t("ent_cancel_edit")}</Btn>}
              <Btn onClick={save} className="flex-[2]">{editingId != null ? t("ent_save_update") : t("ent_nu_save")}</Btn>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">{t("ent_audit_footer")}</p>
          </div>
        </Card>

        <Card>
          <CardHead><span className="font-bebas text-sm">{t("ent_recent")} ({items.length})</span></CardHead>
          <div className="px-4 max-h-[550px] overflow-y-auto">
            {items.length === 0 ? <Empty icon="🥗" msg={t("ent_no_entries")} /> : items.map((n) => (
              <div key={n.id} className={`py-[11px] border-b border-border ${editingId === n.id ? "bg-accent/[.06] -mx-2 px-2 rounded-lg" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{n.title}</div>
                    <div className="text-[11px] text-muted">{[n.calories && `🔥${n.calories}kcal`, n.protein && `P${n.protein}g`, n.carbs && `C${n.carbs}g`, n.fat && `G${n.fat}g`].filter(Boolean).join(" · ")}</div>
                    {n.user && <div className="text-[10px] text-accent/70">{t("ent_for_client", { name: n.user.name })}</div>}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <button type="button" onClick={() => startEdit(n)} className="bg-transparent border border-border rounded-md px-2 py-0.5 text-[11px] text-muted cursor-pointer hover:text-accent hover:border-accent/30">{t("ap_edit")}</button>
                    <button type="button" onClick={() => setConfirmId(n.id)} className="text-muted hover:text-accent cursor-pointer bg-transparent border-none px-1 text-lg">×</button>
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

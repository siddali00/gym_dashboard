import { useState, useEffect, useRef } from "react";
import { PageHead, Card, CardHead, FG, Inp, Txta, Btn, OkMsg, Empty } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ClientSelector } from "../components/ClientSelector";
import { api } from "../api";
import { useI18n } from "../i18n";

const emptyForm = () => ({ name: "", category: "", dosage: "", frequency: "", notes: "" });

export function EntSupplement({
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

  useEffect(() => { api.getSupplements().then(setItems).catch(() => {}); }, []);

  function startEdit(s: any) {
    setEditingId(s.id);
    setForm({
      name: s.name || "", category: s.category || "",
      dosage: s.dosage || "", frequency: s.frequency || "", notes: s.notes || "",
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
        const updated = await api.updateSupplement(editingId, form);
        setItems((l) => l.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
        setOk(t("ent_su_updated"));
      } else {
        const item = await api.addSupplement({ clientId: selected, ...form });
        setItems((l) => [item, ...l]);
        setForm(emptyForm());
        setOk(t("ent_su_saved"));
      }
      setTimeout(() => setOk(""), 3000);
    } catch (e: any) { setErr(e?.message || "Error"); }
  }

  async function remove(id: number) {
    await api.deleteSupplement(id);
    setItems((l) => l.filter((x) => x.id !== id));
    setConfirmId(null);
    if (editingId === id) cancelEdit();
  }

  return (
    <>
      <PageHead title={t("ent_su_title")} accent={t("ent_su_accent")} />
      <div className="grid grid-cols-2 gap-4">
        <Card ref={formRef}>
          <CardHead><span className="font-bebas text-sm">{editingId != null ? t("ent_su_edit_head") : t("ent_su_new_head")}</span></CardHead>
          <div className="p-[18px]">
            <ClientSelector clients={clients} selected={selected} onSelect={onSelect} />
            <FG label={t("ent_su_name")}><Inp value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></FG>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("ent_su_category")}><Inp value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></FG>
              <FG label={t("ent_su_dosage")}><Inp value={form.dosage} onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))} /></FG>
            </div>
            <FG label={t("ent_su_frequency")}><Inp value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))} /></FG>
            <FG label={t("ent_su_notes")}><Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} /></FG>
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <OkMsg msg={ok} />
            <div className="flex gap-2">
              {editingId != null && <Btn variant="outline" onClick={cancelEdit} className="flex-1">{t("ent_cancel_edit")}</Btn>}
              <Btn onClick={save} className="flex-[2]">{editingId != null ? t("ent_save_update") : t("ent_su_save")}</Btn>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">{t("ent_audit_footer")}</p>
          </div>
        </Card>

        <Card>
          <CardHead><span className="font-bebas text-sm">{t("ent_recent")} ({items.length})</span></CardHead>
          <div className="px-4 max-h-[550px] overflow-y-auto">
            {items.length === 0 ? <Empty icon="💊" msg={t("ent_no_entries")} /> : items.map((s) => (
              <div key={s.id} className={`py-[11px] border-b border-border ${editingId === s.id ? "bg-accent/[.06] -mx-2 px-2 rounded-lg" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{s.name}</div>
                    <div className="text-[11px] text-muted">{[s.category, s.dosage, s.frequency].filter(Boolean).join(" · ")}</div>
                    {s.user && <div className="text-[10px] text-accent/70">{t("ent_for_client", { name: s.user.name })}</div>}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <button type="button" onClick={() => startEdit(s)} className="bg-transparent border border-border rounded-md px-2 py-0.5 text-[11px] text-muted cursor-pointer hover:text-accent hover:border-accent/30">{t("ap_edit")}</button>
                    <button type="button" onClick={() => setConfirmId(s.id)} className="text-muted hover:text-accent cursor-pointer bg-transparent border-none px-1 text-lg">×</button>
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

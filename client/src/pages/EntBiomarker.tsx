import { useState, useEffect, useRef } from "react";
import { PageHead, Card, CardHead, FG, Inp, Sel, Txta, Btn, OkMsg, Badge, Empty } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ClientSelector } from "../components/ClientSelector";
import { api } from "../api";
import { useI18n, type TKey } from "../i18n";

const BM_CATEGORIES: TKey[] = [
  "ent_bm_cat_hematology", "ent_bm_cat_hormones", "ent_bm_cat_metabolism",
  "ent_bm_cat_lipids", "ent_bm_cat_inflammation", "ent_bm_cat_micronutrients",
  "ent_bm_cat_thyroid", "ent_bm_cat_liver", "ent_bm_cat_kidneys", "ent_bm_cat_other",
];

const BM_STATUSES: Array<{ val: string; labelKey: TKey }> = [
  { val: "normale", labelKey: "ent_bm_st_normal" },
  { val: "basso", labelKey: "ent_bm_st_low" },
  { val: "alto", labelKey: "ent_bm_st_high" },
  { val: "critico", labelKey: "ent_bm_st_critical" },
];

const emptyForm = () => ({
  name: "", category: "", value: "", unit: "",
  refMin: "", refMax: "", status: "normale",
  date: new Date().toISOString().split("T")[0], notes: "",
});

export function EntBiomarker({
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

  useEffect(() => { api.getBiomarkers().then(setItems).catch(() => {}); }, []);

  function startEdit(bm: any) {
    setEditingId(bm.id);
    setForm({
      name: bm.name || "", category: bm.category || "", value: bm.value || "", unit: bm.unit || "",
      refMin: bm.refMin || "", refMax: bm.refMax || "", status: bm.status || "normale",
      date: bm.date || new Date().toISOString().split("T")[0], notes: bm.notes || "",
    });
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function cancelEdit() { setEditingId(null); setForm(emptyForm()); }

  async function save() {
    if (!form.name || !form.value || !form.date) return;
    if (editingId == null && !selected) return;
    setErr("");
    try {
      if (editingId != null) {
        const updated = await api.updateBiomarker(editingId, form);
        setItems((l) => l.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
        setOk(t("ent_bm_updated"));
      } else {
        const item = await api.addBiomarker({ clientId: selected, ...form });
        setItems((l) => [item, ...l]);
        setForm(emptyForm());
        setOk(t("ent_bm_saved"));
      }
      setTimeout(() => setOk(""), 3000);
    } catch (e: any) { setErr(e?.message || "Error"); }
  }

  async function remove(id: number) {
    await api.deleteBiomarker(id);
    setItems((l) => l.filter((x) => x.id !== id));
    setConfirmId(null);
    if (editingId === id) cancelEdit();
  }

  return (
    <>
      <PageHead title={t("ent_bm_title")} accent={t("ent_bm_accent")} />
      <div className="grid grid-cols-2 gap-4">
        <Card ref={formRef}>
          <CardHead><span className="font-bebas text-sm">{editingId != null ? t("ent_bm_edit_head") : t("ent_bm_new_head")}</span></CardHead>
          <div className="p-[18px]">
            <ClientSelector clients={clients} selected={selected} onSelect={onSelect} />
            <FG label={t("ent_bm_name")}><Inp value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></FG>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("ent_bm_category")}><Sel value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}><option value="">—</option>{BM_CATEGORIES.map((k) => <option key={k} value={t(k)}>{t(k)}</option>)}</Sel></FG>
              <FG label={t("ent_bm_status")}><Sel value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>{BM_STATUSES.map((s) => <option key={s.val} value={s.val}>{t(s.labelKey)}</option>)}</Sel></FG>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <FG label={t("ent_bm_value")}><Inp value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} /></FG>
              <FG label={t("ent_bm_unit")}><Inp value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} /></FG>
              <FG label={t("ent_bm_date")}><Inp type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></FG>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("ent_bm_ref_min")}><Inp value={form.refMin} onChange={(e) => setForm((f) => ({ ...f, refMin: e.target.value }))} /></FG>
              <FG label={t("ent_bm_ref_max")}><Inp value={form.refMax} onChange={(e) => setForm((f) => ({ ...f, refMax: e.target.value }))} /></FG>
            </div>
            <FG label={t("ent_bm_notes")}><Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} /></FG>
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <OkMsg msg={ok} />
            <div className="flex gap-2">
              {editingId != null && <Btn variant="outline" onClick={cancelEdit} className="flex-1">{t("ent_cancel_edit")}</Btn>}
              <Btn onClick={save} className="flex-[2]">{editingId != null ? t("ent_save_update") : t("ent_bm_save")}</Btn>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">{t("ent_audit_footer")}</p>
          </div>
        </Card>

        <Card>
          <CardHead><span className="font-bebas text-sm">{t("ent_recent")} ({items.length})</span></CardHead>
          <div className="px-4 max-h-[550px] overflow-y-auto">
            {items.length === 0 ? <Empty icon="🔬" msg={t("ent_no_entries")} /> : items.map((bm) => (
              <div key={bm.id} className={`py-[11px] border-b border-border ${editingId === bm.id ? "bg-accent/[.06] -mx-2 px-2 rounded-lg" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{bm.name}</div>
                    {bm.user && <div className="text-[10px] text-accent/70">{t("ent_for_client", { name: bm.user.name })}</div>}
                  </div>
                  <div className="font-mono text-sm font-semibold">{bm.value}{bm.unit && <span className="text-[10px] text-muted ml-1">{bm.unit}</span>}</div>
                  <Badge color={bm.status === "normale" ? "ok" : "warn"}>{bm.status}</Badge>
                  <div className="shrink-0 flex items-center gap-1">
                    <button type="button" onClick={() => startEdit(bm)} className="bg-transparent border border-border rounded-md px-2 py-0.5 text-[11px] text-muted cursor-pointer hover:text-accent hover:border-accent/30">{t("ap_edit")}</button>
                    <button type="button" onClick={() => setConfirmId(bm.id)} className="text-muted hover:text-accent cursor-pointer bg-transparent border-none px-1 text-lg">×</button>
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

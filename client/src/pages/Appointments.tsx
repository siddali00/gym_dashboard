import { useState, useEffect, useRef } from "react";
import { PageHead, Card, CardHead, FG, Inp, Sel, Txta, Btn, OkMsg, Badge, Empty, InfoBox } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ClientSelector } from "../components/ClientSelector";
import { api } from "../api";
import { useI18n } from "../i18n";

const STATUS_VALUES = ["confermato", "da confermare", "annullato"] as const;

function normalizeDateInput(s: unknown): string {
  if (s == null || typeof s !== "string") return new Date().toISOString().split("T")[0];
  const d = s.includes("T") ? s.split("T")[0] : s.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : new Date().toISOString().split("T")[0];
}

function normalizeTimeInput(s: unknown): string {
  if (s == null || typeof s !== "string") return "09:00";
  const tv = s.trim();
  const m = tv.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;
  return "09:00";
}

interface AppointmentsProps {
  clients?: any[];
  selected?: number | null;
  onSelect?: (id: number | null) => void;
}

export function Appointments({ clients, selected, onSelect }: AppointmentsProps = {}) {
  const { t } = useI18n();
  const isPro = !!(clients && onSelect);
  const formCardRef = useRef<HTMLDivElement>(null);
  const [appts, setAppts] = useState<any[]>([]);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    location: "",
    notes: "",
    status: "confermato" as string,
  });

  const emptyForm = () => ({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    location: "",
    notes: "",
    status: "confermato" as string,
  });

  function startEdit(a: any) {
    const id = Number(a.id);
    if (!Number.isFinite(id)) return;
    setEditingId(id);
    setForm({
      title: String(a.title ?? ""),
      date: normalizeDateInput(a.date),
      time: normalizeTimeInput(a.time),
      location: a.location != null ? String(a.location) : "",
      notes: a.notes != null ? String(a.notes) : "",
      status: STATUS_VALUES.includes(a.status as (typeof STATUS_VALUES)[number]) ? a.status : "confermato",
    });
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function statusLabel(s: string) {
    if (s === "confermato") return t("ap_status_lbl_confirmed");
    if (s === "da confermare") return t("ap_status_lbl_pending");
    if (s === "annullato") return t("ap_status_lbl_cancelled");
    return s;
  }

  useEffect(() => {
    api.getAppointments().then(setAppts).catch(() => {});
  }, []);

  async function save() {
    if (!form.title || !form.date || !form.time) return;
    if (editingId == null && !selected) {
      setErr(t("ap_select_client_first"));
      return;
    }
    setErr("");
    try {
      if (editingId != null) {
        const updated = await api.updateAppointment(editingId, form);
        setAppts((list) => list.map((x) => (x.id === editingId ? updated : x)));
        cancelEdit();
        setOk(t("ap_updated_ok"));
      } else {
        const payload: any = { ...form, clientId: selected };
        const appt = await api.addAppointment(payload);
        setAppts((a) => [appt, ...a]);
        setForm(emptyForm());
        setOk(t("ap_created_ok"));
      }
      setTimeout(() => setOk(""), 3000);
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("CONFLICT_PRO")) setErr(t("ap_conflict_pro"));
      else if (msg.includes("CONFLICT_CLIENT")) setErr(t("ap_conflict_client"));
      else setErr(msg || "Error");
    }
  }

  async function remove(id: number) {
    await api.deleteAppointment(id);
    setAppts((a) => a.filter((x) => x.id !== id));
    setConfirmId(null);
  }

  /* ---------- Athlete: read-only view ---------- */
  if (!isPro) {
    return (
      <>
        <PageHead title={t("ap_title")} accent={t("ap_accent")} sub={t("ap_sub_athlete")} />
        <InfoBox icon="🔒" title={t("ro_title")} body={t("ro_body_suffix")} />
        <Card>
          <CardHead><span className="font-bebas text-sm">{t("ap_list_head")} ({appts.length})</span></CardHead>
          <div className="px-4 max-h-[600px] overflow-y-auto">
            {appts.length === 0 ? (
              <Empty icon="📅" msg={t("ap_empty_msg")} sub={t("ap_empty_sub")} />
            ) : (
              appts.map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 py-[11px] border-b border-border min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{a.title}</div>
                    {a.location && <div className="text-[11px] text-muted truncate">{a.location}</div>}
                    {a.createdBy && (
                      <div className="text-[10px] text-accent/70">{t("ap_scheduled_by", { name: a.createdBy })}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold">{a.date}</div>
                    <div className="text-[11px] text-muted">{a.time}</div>
                  </div>
                  <Badge color={a.status === "confermato" ? "ok" : "warn"}>{statusLabel(a.status)}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </>
    );
  }

  /* ---------- Professional: full CRUD ---------- */
  return (
    <>
      <PageHead title={t("ap_title")} accent={t("ap_accent")} sub={t("ap_sub")} />

      <div className="grid grid-cols-2 gap-4">
        <Card ref={formCardRef}>
          <CardHead>
            <span className="font-bebas text-sm">{editingId != null ? t("ap_edit_head") : t("ap_new_head")}</span>
          </CardHead>
          <div className="p-[18px]">
            <ClientSelector clients={clients!} selected={selected!} onSelect={onSelect!} />
            <FG label={t("ap_label_title")}>
              <Inp value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={t("ap_ph_title")} />
            </FG>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("ap_label_date")}>
                <Inp type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </FG>
              <FG label={t("ap_label_time")}>
                <Inp type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
              </FG>
            </div>
            <FG label={t("ap_label_place")}>
              <Inp value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder={t("ap_ph_place")} />
            </FG>
            <FG label={t("ap_label_status")}>
              <Sel value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {STATUS_VALUES.map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </Sel>
            </FG>
            <FG label={t("ap_label_notes")}>
              <Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} placeholder={t("ap_notes_ph")} />
            </FG>
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <OkMsg msg={ok} />
            <div className="flex gap-2">
              {editingId != null && (
                <Btn variant="outline" onClick={cancelEdit} className="flex-1">
                  {t("ap_cancel_edit")}
                </Btn>
              )}
              <Btn onClick={save} className="flex-[2]">
                {editingId != null ? t("ap_save_update") : t("ap_create")}
              </Btn>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead><span className="font-bebas text-sm">{t("ap_list_head")} ({appts.length})</span></CardHead>
          <div className="px-4 max-h-[500px] overflow-y-auto">
            {appts.length === 0 ? (
              <Empty icon="📅" msg={t("ap_empty_msg")} sub={t("ap_empty_sub")} />
            ) : (
              appts.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-2.5 py-[11px] border-b border-border min-w-0 ${editingId === Number(a.id) ? "bg-accent/[.06] -mx-2 px-2 rounded-lg" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{a.title}</div>
                    {a.location && <div className="text-[11px] text-muted truncate">{a.location}</div>}
                    {a.user && (
                      <div className="text-[10px] text-accent/70">{t("ap_for_client", { name: a.user.name })}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold">{a.date}</div>
                    <div className="text-[11px] text-muted">{a.time}</div>
                  </div>
                  <Badge color={a.status === "confermato" ? "ok" : "warn"}>{statusLabel(a.status)}</Badge>
                  <div className="shrink-0 flex items-center gap-1 relative z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startEdit(a);
                      }}
                      className="bg-transparent border border-border rounded-md px-2 py-0.5 text-[11px] text-muted cursor-pointer hover:text-accent hover:border-accent/30"
                    >
                      {t("ap_edit")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setConfirmId(a.id);
                      }}
                      className="bg-transparent border-none text-muted cursor-pointer text-lg hover:text-accent px-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
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

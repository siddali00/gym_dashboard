import { useState, useEffect } from "react";
import { PageHead, Card, CardHead, FG, Inp, Sel, Txta, Btn, OkMsg, Badge, Empty, InfoBox } from "../components/ui";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ClientSelector } from "../components/ClientSelector";
import { REPORT_TYPES } from "../data/constants";
import { api } from "../api";
import { useI18n, type TKey } from "../i18n";

interface MedicalReportsProps {
  clients?: any[];
  selected?: number | null;
  onSelect?: (id: number | null) => void;
}

export function MedicalReports({ clients, selected, onSelect }: MedicalReportsProps = {}) {
  const { t } = useI18n();
  const isPro = !!(clients && onSelect);
  const [consented, setConsented] = useState(isPro);
  const [reports, setReports] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    title: "",
    type: REPORT_TYPES[0],
    doctor: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    diagnosis: "",
    findings: "",
    recommendations: "",
  });

  function reportTypeLabel(stored: string) {
    const i = REPORT_TYPES.indexOf(stored as (typeof REPORT_TYPES)[number]);
    if (i >= 0) return t(`rt_${i}` as TKey);
    return stored;
  }

  useEffect(() => {
    if (consented) {
      api.getReports().then(setReports).catch(() => {});
    }
  }, [consented]);

  const [err, setErr] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function remove(id: number) {
    await api.deleteReport(id);
    setReports((r) => r.filter((x) => x.id !== id));
    setConfirmId(null);
  }

  async function save() {
    if (!form.title || !form.date) return;
    if (isPro && !selected) {
      setErr(t("mr_select_client_first"));
      return;
    }
    setErr("");
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("type", form.type);
    fd.append("doctor", form.doctor);
    fd.append("date", form.date);
    fd.append("notes", form.notes);
    if (isPro) {
      if (form.diagnosis) fd.append("diagnosis", form.diagnosis);
      if (form.findings) fd.append("findings", form.findings);
      if (form.recommendations) fd.append("recommendations", form.recommendations);
      fd.append("clientId", String(selected));
    }
    if (file) fd.append("file", file);

    const report = await api.uploadReport(fd);
    setReports((r) => [report, ...r]);
    setOk(t("mr_uploaded_ok"));
    setForm({
      title: "", type: REPORT_TYPES[0], doctor: "",
      date: new Date().toISOString().split("T")[0],
      notes: "", diagnosis: "", findings: "", recommendations: "",
    });
    setFile(null);
    setTimeout(() => setOk(""), 3000);
  }

  /* ---------- GDPR consent gate (athletes only) ---------- */
  if (!consented) {
    return (
      <>
        <PageHead title={t("mr_title")} accent={t("mr_accent")} />
        <Card className="max-w-[560px]">
          <div className="p-7">
            <div className="text-2xl text-center mb-3.5">🔒</div>
            <h2 className="font-bebas text-center mb-2">{t("mr_gate_title")}</h2>
            <p className="text-muted text-[13px] text-center mb-[18px] leading-relaxed">{t("mr_gate_body")}</p>
            <InfoBox icon="⚠️" title={t("mr_gate_infobox_title")} body={t("mr_gate_infobox_body")} color="amber" />
            <div className="bg-el rounded-[10px] p-4 mb-4">
              <div className="flex items-start gap-2.5 mt-3">
                <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 accent-accent" id="refcon" />
                <label htmlFor="refcon" className="text-[11px] text-sec cursor-pointer leading-relaxed">
                  {t("mr_gate_checkbox")}
                </label>
              </div>
            </div>
            <Btn onClick={() => setConsented(true)} className="w-full">{t("mr_gate_btn")}</Btn>
            <p className="text-[10px] text-muted text-center mt-2">{t("mr_gate_footer")}</p>
          </div>
        </Card>
      </>
    );
  }

  /* ---------- Main view ---------- */
  return (
    <>
      <PageHead title={t("mr_title")} accent={t("mr_accent")} sub={t("mr_sub")} />
      {!isPro && <InfoBox icon="🛡️" title={t("mr_protected_title")} body={t("mr_protected_body")} color="accent" />}

      <div className="grid grid-cols-2 gap-4">
        {/* ---- Upload / Entry form ---- */}
        <Card>
          <CardHead><span className="font-bebas text-sm">{t("mr_upload_head")}</span></CardHead>
          <div className="p-[18px]">
            {isPro && (
              <ClientSelector clients={clients!} selected={selected!} onSelect={onSelect!} />
            )}
            <FG label={t("mr_label_title")}>
              <Inp value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={t("mr_ph_title")} />
            </FG>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("mr_label_type")}>
                <Sel value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  {REPORT_TYPES.map((type, i) => (
                    <option key={type} value={type}>{t(`rt_${i}` as TKey)}</option>
                  ))}
                </Sel>
              </FG>
              <FG label={t("mr_label_date")}>
                <Inp type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </FG>
            </div>
            {!isPro && (
              <FG label={t("mr_label_doctor")}>
                <Inp value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))} placeholder={t("mr_ph_doctor")} />
              </FG>
            )}

            {/* Professional clinical fields */}
            {isPro && (
              <>
                <FG label={t("mr_diagnosis")}>
                  <Txta value={form.diagnosis} onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))} rows={3} placeholder={t("mr_ph_diagnosis")} />
                </FG>
                <FG label={t("mr_findings")}>
                  <Txta value={form.findings} onChange={(e) => setForm((f) => ({ ...f, findings: e.target.value }))} rows={3} placeholder={t("mr_ph_findings")} />
                </FG>
                <FG label={t("mr_recommendations")}>
                  <Txta value={form.recommendations} onChange={(e) => setForm((f) => ({ ...f, recommendations: e.target.value }))} rows={3} placeholder={t("mr_ph_recommendations")} />
                </FG>
              </>
            )}

            <FG label={t("mr_label_notes")}>
              <Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
            </FG>

            {/* File upload */}
            <FG label={isPro ? t("mr_attach_optional") : t("mr_label_file")}>
              <input
                id="report-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {!file ? (
                <label
                  htmlFor="report-file"
                  className="block rounded-xl border border-dashed border-border bg-el/70 px-4 py-4 cursor-pointer hover:border-accent/35 hover:bg-white/[.02] transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">📎</div>
                    <div className="text-[13px] text-sec mb-1">{t("mr_file_drop")}</div>
                    <div className="text-[10px] text-muted">{t("mr_file_hint")}</div>
                  </div>
                </label>
              ) : (
                <div className="bg-el rounded-[10px] border border-green/25 px-3 py-2.5 mb-0.5">
                  <div className="text-xs text-green mb-2">
                    📎 {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </div>
                  <div className="flex gap-2">
                    <label
                      htmlFor="report-file"
                      className="text-[11px] rounded-full px-2.5 py-1 border border-border text-muted cursor-pointer hover:bg-white/[.03]"
                    >
                      {t("mr_file_change")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-[11px] rounded-full px-2.5 py-1 border border-accent/30 text-accent cursor-pointer hover:bg-accent/10"
                    >
                      {t("mr_file_remove")}
                    </button>
                  </div>
                </div>
              )}
            </FG>

            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <OkMsg msg={ok} />
            <Btn onClick={save} className="w-full">{t("mr_upload_btn")}</Btn>
          </div>
        </Card>

        {/* ---- Report history ---- */}
        <Card>
          <CardHead><span className="font-bebas text-sm">{t("mr_history")} ({reports.length})</span></CardHead>
          <div className="px-4 max-h-[550px] overflow-y-auto">
            {reports.length === 0 ? (
              <Empty icon="📋" msg={t("mr_empty_msg")} sub={t("mr_empty_sub")} />
            ) : (
              reports.map((r) => {
                const canDelete = isPro
                  ? r.uploadedBy !== "cliente"
                  : r.uploadedBy === "cliente";

                return (
                  <div key={r.id} className="py-[11px] border-b border-border">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium mb-0.5">{r.title}</div>
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          <Badge color="muted">{reportTypeLabel(r.type)}</Badge>
                          <Badge color={r.uploadedBy === "cliente" ? "blue" : "ok"}>
                            {r.uploadedBy === "cliente"
                              ? t("mr_badge_self")
                              : t("mr_badge_pro", { name: r.uploadedBy })}
                          </Badge>
                        </div>
                      </div>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setConfirmId(r.id)}
                          className="shrink-0 bg-transparent border-none text-muted cursor-pointer text-lg hover:text-accent px-1"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {isPro && r.user && (
                      <div className="text-[10px] text-accent/70 mb-1">{t("mr_for_client", { name: r.user.name })}</div>
                    )}

                    {r.diagnosis && (
                      <div className="mt-1.5 bg-el/60 rounded-lg px-2.5 py-2 text-[11px] leading-relaxed">
                        <div className="text-muted text-[10px] font-semibold mb-0.5 uppercase tracking-wide">{t("mr_diagnosis")}</div>
                        <div className="text-sec">{r.diagnosis}</div>
                      </div>
                    )}
                    {r.findings && (
                      <div className="mt-1 bg-el/60 rounded-lg px-2.5 py-2 text-[11px] leading-relaxed">
                        <div className="text-muted text-[10px] font-semibold mb-0.5 uppercase tracking-wide">{t("mr_findings")}</div>
                        <div className="text-sec">{r.findings}</div>
                      </div>
                    )}
                    {r.recommendations && (
                      <div className="mt-1 bg-el/60 rounded-lg px-2.5 py-2 text-[11px] leading-relaxed">
                        <div className="text-muted text-[10px] font-semibold mb-0.5 uppercase tracking-wide">{t("mr_recommendations")}</div>
                        <div className="text-sec">{r.recommendations}</div>
                      </div>
                    )}

                    {r.doctor && <div className="text-[11px] text-muted mt-1">{r.doctor}</div>}
                    {r.fileName && <div className="text-[11px] text-accent mt-0.5">📎 {r.fileName}</div>}
                    <div className="text-[10px] text-muted mt-1">{r.date}</div>
                  </div>
                );
              })
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

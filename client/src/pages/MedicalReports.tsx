import { useState, useEffect } from "react";
import { PageHead, Card, CardHead, FG, Inp, Sel, Txta, Btn, OkMsg, Badge, Empty, InfoBox } from "../components/ui";
import { REPORT_TYPES } from "../data/constants";
import { api } from "../api";
import { useI18n, type TKey } from "../i18n";

export function MedicalReports() {
  const { t } = useI18n();
  const [consented, setConsented] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    title: "",
    type: REPORT_TYPES[0],
    doctor: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
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

  async function save() {
    if (!form.title || !form.date) return;
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("type", form.type);
    fd.append("doctor", form.doctor);
    fd.append("date", form.date);
    fd.append("notes", form.notes);
    if (file) fd.append("file", file);

    const report = await api.uploadReport(fd);
    setReports((r) => [report, ...r]);
    setOk(t("mr_uploaded_ok"));
    setForm({ title: "", type: REPORT_TYPES[0], doctor: "", date: new Date().toISOString().split("T")[0], notes: "" });
    setFile(null);
    setTimeout(() => setOk(""), 3000);
  }

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

  return (
    <>
      <PageHead title={t("mr_title")} accent={t("mr_accent")} sub={t("mr_sub")} />
      <InfoBox icon="🛡️" title={t("mr_protected_title")} body={t("mr_protected_body")} color="accent" />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHead><span className="font-bebas text-sm">{t("mr_upload_head")}</span></CardHead>
          <div className="p-[18px]">
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
            <FG label={t("mr_label_doctor")}>
              <Inp value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))} placeholder={t("mr_ph_doctor")} />
            </FG>
            <FG label={t("mr_label_file")}>
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
            <FG label={t("mr_label_notes")}>
              <Txta value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
            </FG>
            <OkMsg msg={ok} />
            <Btn onClick={save} className="w-full">{t("mr_upload_btn")}</Btn>
          </div>
        </Card>

        <Card>
          <CardHead><span className="font-bebas text-sm">{t("mr_history")} ({reports.length})</span></CardHead>
          <div className="px-4 max-h-[420px] overflow-y-auto">
            {reports.length === 0 ? (
              <Empty icon="📋" msg={t("mr_empty_msg")} sub={t("mr_empty_sub")} />
            ) : (
              reports.map((r, i) => (
                <div key={i} className="py-[11px] border-b border-border">
                  <div className="text-[13px] font-medium mb-0.5">{r.title}</div>
                  <div className="flex gap-2 mb-1">
                    <Badge color="muted">{reportTypeLabel(r.type)}</Badge>
                    <Badge color="blue">{t("mr_badge_self")}</Badge>
                  </div>
                  {r.doctor && <div className="text-[11px] text-muted">{r.doctor}</div>}
                  {r.fileName && <div className="text-[11px] text-accent mt-0.5">📎 {r.fileName}</div>}
                  <div className="text-[10px] text-muted mt-1">{r.date}</div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

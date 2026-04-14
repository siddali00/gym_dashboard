import { useState } from "react";
import { Card, FG, Inp, Btn, InfoBox } from "../components/ui";
import { GDPR_ITEMS } from "../data/constants";
import { useAuth } from "../store";
import { useI18n, type TKey } from "../i18n";

export function Register({ goLogin }: { goLogin: () => void }) {
  const { register } = useAuth();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", cf: "", phone: "" });
  const [cons, setCons] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const allReq = GDPR_ITEMS.filter((i) => i.req).every((i) => cons[i.id]);

  async function submit() {
    if (!form.name || !form.email || !form.password) {
      setErr(t("fill_all_required_error"));
      return;
    }
    if (!allReq) {
      setErr(t("required_consents_error"));
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await register({ ...form, consents: cons });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Branding */}
      <div className="text-center mb-9">
        <div className="w-[68px] h-[68px] bg-linear-to-br from-accent to-red-500 rounded-[18px] mx-auto mb-4 flex items-center justify-center text-[30px]">
          ⚕️
        </div>
        <h1 className="font-bebas text-[46px] tracking-[.06em] leading-none">{t("brand_name")}</h1>
        <p className="text-muted text-[13px] mt-1">{t("brand_tagline")}</p>
      </div>

      <Card className="w-full max-w-[490px] p-[30px]">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {[1, 2].map((x) => (
            <div
              key={x}
              className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${step >= x ? "bg-accent" : "bg-white/10"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 className="font-bebas text-2xl mb-4 tracking-wide">{t("register_data_title")}</h2>
            <FG label={t("full_name_required")}>
              <Inp value={form.name} onChange={upd("name")} placeholder={t("ph_name")} />
            </FG>
            <FG label={t("email_required")}>
              <Inp type="email" value={form.email} onChange={upd("email")} placeholder="mario@email.it" />
            </FG>
            <FG label={t("password_required")}>
              <Inp type="password" value={form.password} onChange={upd("password")} placeholder={t("password_hint")} />
            </FG>
            <div className="grid grid-cols-2 gap-2.5">
              <FG label={t("fiscal_code")}>
                <Inp
                  value={form.cf}
                  onChange={(e) => setForm((f) => ({ ...f, cf: e.target.value.toUpperCase() }))}
                  placeholder="RSSMRA80A01H501Z"
                />
              </FG>
              <FG label={t("phone")}>
                <Inp value={form.phone} onChange={upd("phone")} placeholder={t("ph_phone")} />
              </FG>
            </div>
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <Btn
              onClick={() => {
                if (!form.name || !form.email || !form.password) {
                  setErr(t("fill_required_error"));
                  return;
                }
                setErr("");
                setStep(2);
              }}
              className="w-full"
            >
              {t("continue")}
            </Btn>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-bebas text-[22px] mb-1 tracking-wide">{t("privacy_consents")}</h2>
            <p className="text-muted text-[11px] mb-4 leading-relaxed">{t("register_privacy_intro")}</p>
            <div className="flex flex-col gap-2 mb-3.5">
              {GDPR_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className={`bg-el rounded-[9px] p-[11px_13px] border transition-colors ${
                    cons[item.id] ? "border-green/30" : "border-border"
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <input
                      type="checkbox"
                      checked={!!cons[item.id]}
                      onChange={() => setCons((c) => ({ ...c, [item.id]: !c[item.id] }))}
                      className="w-[15px] h-[15px] mt-0.5 accent-accent cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-medium mb-0.5">
                        {t(`gdpr_${item.id}_label` as TKey)}
                        {item.req && <span className="text-accent"> *</span>}
                      </div>
                      <div className="text-[11px] text-muted leading-relaxed">{t(`gdpr_${item.id}_text` as TKey)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <InfoBox
              icon="🏛️"
              title={t("info_rights_register_title")}
              body={
                <span>
                  {t("info_rights_register_body")}{" "}
                  <span className="text-blue">dpo@salutediferro.com</span>
                </span>
              }
            />
            {err && <p className="text-accent text-xs mb-2">{err}</p>}
            <div className="flex gap-2">
              <Btn variant="outline" onClick={() => setStep(1)} className="flex-1">
                {t("back")}
              </Btn>
              <Btn onClick={submit} className="flex-[2]" disabled={loading}>
                {loading ? t("registering") : t("complete_registration")}
              </Btn>
            </div>
          </>
        )}

        <p className="text-center text-[11px] text-muted mt-3.5">
          {t("already_account")}{" "}
          <span className="text-accent cursor-pointer hover:underline" onClick={goLogin}>
            {t("login_link")}
          </span>
        </p>
      </Card>
    </div>
  );
}

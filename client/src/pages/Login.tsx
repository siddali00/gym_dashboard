import { useState } from "react";
import { Card, FG, Inp, Btn } from "../components/ui";
import { useAuth } from "../store";
import { useI18n } from "../i18n";

export function Login({ goRegister }: { goRegister: () => void }) {
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    setErr("");
    try {
      await login(email, pw);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

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

      <Card className="w-full max-w-[380px] p-[30px]">
        <h2 className="font-bebas text-[26px] mb-5 tracking-wide">{t("login_title")}</h2>
        <FG label={t("email_required")}>
          <Inp
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("ph_email")}
          />
        </FG>
        <FG label={t("password_required")}>
          <Inp
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
        </FG>
        {err && <p className="text-accent text-xs mb-2.5">{err}</p>}
        <Btn onClick={handle} className="w-full mb-3" disabled={loading}>
          {loading ? t("loading") : t("login_btn")}
        </Btn>
        <p className="text-center text-xs text-muted">
          {t("no_account")}{" "}
          <span className="text-accent cursor-pointer hover:underline" onClick={goRegister}>
            {t("register_link")}
          </span>
        </p>
      </Card>

      <p className="mt-6 text-[11px] text-muted text-center leading-relaxed">{t("auth_footer_gdpr")}</p>
    </div>
  );
}

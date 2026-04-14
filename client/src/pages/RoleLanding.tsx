import { useI18n, type TKey } from "../i18n";
import { ROLE_INFO } from "../data/constants";

const ROLES = Object.entries(ROLE_INFO).map(([dbRole, { icon, titleKey }]) => ({
  dbRole,
  icon,
  titleKey: titleKey as TKey,
  descKey: `${titleKey}_desc` as TKey,
}));

export function RoleLanding({ onChoose }: { onChoose: (dbRole: string) => void }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-6">
        <div className="w-[68px] h-[68px] bg-linear-to-br from-accent to-red-500 rounded-[18px] mx-auto mb-4 flex items-center justify-center text-[30px]">
          ⚕️
        </div>
        <h1 className="font-bebas text-[46px] tracking-[.06em] leading-none">{t("brand_name")}</h1>
        <p className="text-muted text-[13px] mt-1">{t("brand_tagline")}</p>
      </div>

      <div className="w-full max-w-[460px] mb-4 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-300">
        {t("landing_demo")}
      </div>

      <div className="w-full max-w-[460px] flex flex-col gap-2">
        {ROLES.map((role) => (
          <button
            key={role.dbRole}
            onClick={() => onChoose(role.dbRole)}
            className="w-full text-left bg-card border border-border hover:border-accent/30 rounded-xl px-4 py-3 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bebas tracking-[.08em] text-[15px] text-sec">{t(role.titleKey)}</div>
                <div className="text-[12px] text-muted truncate">{t(role.descKey)}</div>
              </div>
              <div className="text-muted">→</div>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-5 text-[11px] text-muted text-center leading-relaxed">{t("auth_footer_gdpr")}</p>
    </div>
  );
}

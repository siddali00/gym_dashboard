import { useState } from "react";
import { Card } from "../components/ui";
import { useI18n, type TKey } from "../i18n";

type RoleId = "client" | "doctor" | "nutritionist" | "blacksmith" | "iron_coach";

const ROLES: Array<{ id: RoleId; icon: string; titleKey: TKey; descKey: TKey }> = [
  { id: "client", icon: "🧑‍🦱", titleKey: "role_client", descKey: "role_client_desc" },
  { id: "doctor", icon: "🩺", titleKey: "role_doctor", descKey: "role_doctor_desc" },
  { id: "nutritionist", icon: "🥗", titleKey: "role_nutritionist", descKey: "role_nutritionist_desc" },
  { id: "blacksmith", icon: "🛠️", titleKey: "role_blacksmith", descKey: "role_blacksmith_desc" },
  { id: "iron_coach", icon: "🏋️", titleKey: "role_iron_coach", descKey: "role_iron_coach_desc" },
];

export function RoleLanding({ onChooseClient }: { onChooseClient: () => void }) {
  const { t } = useI18n();
  const [lockedRole, setLockedRole] = useState<RoleId | null>(null);

  const onChoose = (role: RoleId) => {
    if (role === "client") {
      onChooseClient();
      return;
    }
    setLockedRole(role);
  };

  if (lockedRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-[420px] p-6 text-center">
          <div className="text-4xl mb-3">🚧</div>
          <h2 className="font-bebas text-2xl tracking-[.08em] mb-2">{t("landing_only_client_title")}</h2>
          <p className="text-muted text-sm mb-5">{t("landing_only_client_body")}</p>
          <button
            onClick={onChooseClient}
            className="w-full rounded-[9px] px-[18px] py-[9px] font-bebas tracking-[.1em] text-[13px] bg-linear-to-br from-accent to-red-500 text-white border-none cursor-pointer mb-2"
          >
            {t("landing_try_client")}
          </button>
          <button
            onClick={() => setLockedRole(null)}
            className="w-full rounded-[9px] px-[18px] py-[9px] font-bebas tracking-[.1em] text-[13px] bg-transparent text-text border border-border cursor-pointer"
          >
            {t("landing_back_roles")}
          </button>
        </Card>
      </div>
    );
  }

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
            key={role.id}
            onClick={() => onChoose(role.id)}
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

import { useState } from "react";
import { PageHead, Card, CardHead, Badge, InfoBox, Btn } from "../components/ui";
import { GDPR_ITEMS } from "../data/constants";
import { useI18n, type TKey } from "../i18n";

export function Privacy() {
  const { t } = useI18n();
  const [cons, setCons] = useState<Record<string, boolean>>({});

  const rights: [string, TKey, TKey][] = [
    ["Art. 15", "r15_name", "r15_desc"],
    ["Art. 16", "r16_name", "r16_desc"],
    ["Art. 17", "r17_name", "r17_desc"],
    ["Art. 18", "r18_name", "r18_desc"],
    ["Art. 20", "r20_name", "r20_desc"],
    ["Art. 21", "r21_name", "r21_desc"],
  ];

  return (
    <>
      <PageHead title={t("pv_title")} accent={t("pv_accent")} sub={t("pv_sub")} />
      <InfoBox icon="🏛️" title={t("pv_controller_title")} body={t("pv_controller_body")} color="amber" />

      <div className="flex flex-col gap-2.5 mb-5">
        {GDPR_ITEMS.map((item) => (
          <Card key={item.id}>
            <div className="p-3.5 flex items-start gap-3">
              <input
                type="checkbox"
                checked={!!cons[item.id]}
                onChange={() => setCons((c) => ({ ...c, [item.id]: !c[item.id] }))}
                className="w-[15px] h-[15px] mt-0.5 accent-accent"
              />
              <div className="flex-1">
                <div className="text-[13px] font-medium mb-0.5">
                  {t(`gdpr_${item.id}_label` as TKey)}
                  {item.req && <span className="text-accent"> *</span>}
                </div>
                <div className="text-[11px] text-muted leading-relaxed">{t(`gdpr_${item.id}_text` as TKey)}</div>
              </div>
              <Badge color={cons[item.id] ? "ok" : "muted"}>
                {cons[item.id] ? t("pv_badge_granted") : t("pv_badge_denied")}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHead>
          <span className="font-bebas text-sm">{t("pv_rights_head")}</span>
        </CardHead>
        <div className="px-[18px]">
          {rights.map(([art, nameKey, descKey]) => (
            <div key={art} className="flex items-center gap-2.5 py-[9px] border-b border-border text-xs">
              <span className="text-accent font-semibold min-w-[54px] font-bebas">{art}</span>
              <span className="font-medium min-w-[80px]">{t(nameKey)}</span>
              <span className="text-muted flex-1">{t(descKey)}</span>
              <Btn variant="blue" className="!text-[10px] !px-2.5 !py-0.5">{t("pv_exercise")}</Btn>
            </div>
          ))}
          <div className="py-3 text-[11px] text-muted">{t("pv_rights_footer")}</div>
        </div>
      </Card>
    </>
  );
}

import { PageHead, Card, InfoBox, Empty } from "../components/ui";
import { useI18n } from "../i18n";

function ReadOnlySection({
  icon,
  titleKey,
  accentKey,
  subKey,
  emptyMsgKey,
  emptySubKey,
}: {
  icon: string;
  titleKey: "bm_title" | "nu_title" | "wo_title" | "su_title";
  accentKey: "bm_accent" | "nu_accent" | "wo_accent" | "su_accent";
  subKey: "bm_sub" | "nu_sub" | "wo_sub" | "su_sub";
  emptyMsgKey: "bm_empty_msg" | "nu_empty_msg" | "wo_empty_msg" | "su_empty_msg";
  emptySubKey: "bm_empty_sub" | "nu_empty_sub" | "wo_empty_sub" | "su_empty_sub";
}) {
  const { t } = useI18n();
  return (
    <>
      <PageHead title={t(titleKey)} accent={t(accentKey)} />
      <InfoBox
        icon="🔒"
        title={t("ro_title")}
        body={`${t(subKey)}. ${t("ro_body_suffix")}`}
      />
      <Card>
        <div className="px-[18px] py-[13px] border-b border-border font-bebas text-sm">
          {icon} {t(titleKey)} {t(accentKey)}
        </div>
        <Empty icon={icon} msg={t(emptyMsgKey)} sub={t(emptySubKey)} />
      </Card>
    </>
  );
}

export function Biomarkers() {
  return (
    <ReadOnlySection
      icon="🔬"
      titleKey="bm_title"
      accentKey="bm_accent"
      subKey="bm_sub"
      emptyMsgKey="bm_empty_msg"
      emptySubKey="bm_empty_sub"
    />
  );
}

export function NutritionPlan() {
  return (
    <ReadOnlySection
      icon="🥗"
      titleKey="nu_title"
      accentKey="nu_accent"
      subKey="nu_sub"
      emptyMsgKey="nu_empty_msg"
      emptySubKey="nu_empty_sub"
    />
  );
}

export function Workouts() {
  return (
    <ReadOnlySection
      icon="🏋️"
      titleKey="wo_title"
      accentKey="wo_accent"
      subKey="wo_sub"
      emptyMsgKey="wo_empty_msg"
      emptySubKey="wo_empty_sub"
    />
  );
}

export function Supplements() {
  return (
    <ReadOnlySection
      icon="💊"
      titleKey="su_title"
      accentKey="su_accent"
      subKey="su_sub"
      emptyMsgKey="su_empty_msg"
      emptySubKey="su_empty_sub"
    />
  );
}

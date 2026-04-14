import { useState } from "react";
import { PageHead, Card, CardHead, FG, Inp, Btn, OkMsg } from "../components/ui";
import { useAuth } from "../store";
import { api } from "../api";
import { useI18n } from "../i18n";

export function Profile() {
  const { user, setUser } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    cf: user?.cf || "",
  });
  const [ok, setOk] = useState("");

  async function save() {
    const { user: updated } = await api.updateProfile(form);
    setUser(updated);
    setOk(t("pr_saved_ok"));
    setTimeout(() => setOk(""), 3000);
  }

  return (
    <>
      <PageHead title={t("pr_title")} accent={t("pr_accent")} sub={t("pr_sub")} />
      <Card className="max-w-[500px]">
        <CardHead><span className="font-bebas text-sm">{t("pr_card_head")}</span></CardHead>
        <div className="p-[18px]">
          <FG label={t("pr_email")}>
            <Inp value={user?.email || ""} disabled className="opacity-60" />
          </FG>
          <FG label={t("pr_name")}>
            <Inp value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
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
              <Inp value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+39 333 000 0000" />
            </FG>
          </div>
          <OkMsg msg={ok} />
          <Btn onClick={save} className="w-full">{t("pr_save")}</Btn>
        </div>
      </Card>
    </>
  );
}

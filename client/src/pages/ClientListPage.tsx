import { useState, useEffect } from "react";
import { PageHead, Card, CardHead, Btn, OkMsg, Empty, Sel, FG } from "../components/ui";
import { api } from "../api";
import { useI18n } from "../i18n";

export function ClientListPage({
  clients,
  refresh,
}: {
  clients: any[];
  refresh: () => void;
}) {
  const { t } = useI18n();
  const [allClients, setAllClients] = useState<any[]>([]);
  const [pickId, setPickId] = useState<string>("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    api.getAllClients().then(setAllClients).catch(() => {});
  }, []);

  const linkedIds = new Set(clients.map((c: any) => c.id));
  const available = allClients.filter((c) => !linkedIds.has(c.id));

  async function link() {
    if (!pickId) return;
    await api.linkClient(Number(pickId));
    setPickId("");
    refresh();
    setOk(t("cl_linked"));
    setTimeout(() => setOk(""), 3000);
  }

  async function unlink(id: number) {
    await api.unlinkClient(id);
    refresh();
    setOk(t("cl_unlinked"));
    setTimeout(() => setOk(""), 3000);
  }

  return (
    <>
      <PageHead title={t("cl_title")} accent={t("cl_accent")} sub={t("cl_sub")} />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHead>
            <span className="font-bebas text-sm">{t("cl_add_title")}</span>
          </CardHead>
          <div className="p-[18px]">
            <FG label={t("cl_select_client")}>
              <Sel value={pickId} onChange={(e) => setPickId(e.target.value)}>
                <option value="">—</option>
                {available.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </Sel>
            </FG>
            <OkMsg msg={ok} />
            <Btn onClick={link} className="w-full">
              {t("cl_link_btn")}
            </Btn>
          </div>
        </Card>

        <Card>
          <CardHead>
            <span className="font-bebas text-sm">
              👥 {t("prof_nav_clients")} ({clients.length})
            </span>
          </CardHead>
          <div className="px-4 max-h-[500px] overflow-y-auto">
            {clients.length === 0 ? (
              <Empty icon="👥" msg={t("cl_empty")} />
            ) : (
              clients.map((c: any) => (
                <div key={c.id} className="flex items-center gap-2.5 py-3 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-semibold text-xs shrink-0">
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{c.name}</div>
                    <div className="text-[11px] text-muted truncate">{c.email}</div>
                  </div>
                  <button
                    onClick={() => unlink(c.id)}
                    className="text-[11px] text-accent border border-accent/30 rounded-md px-2 py-0.5 cursor-pointer hover:bg-accent/10 bg-transparent"
                  >
                    {t("cl_unlink")}
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

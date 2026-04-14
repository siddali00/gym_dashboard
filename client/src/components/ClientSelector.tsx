import { Sel, FG } from "./ui";
import { useI18n } from "../i18n";

interface Client {
  id: number;
  name: string;
  email: string;
}

export function ClientSelector({
  clients,
  selected,
  onSelect,
}: {
  clients: Client[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}) {
  const { t } = useI18n();

  return (
    <FG label={t("cs_label")}>
      <Sel value={selected ?? ""} onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}>
        <option value="">{t("cs_placeholder")}</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.email})
          </option>
        ))}
      </Sel>
      {clients.length === 0 && (
        <p className="text-xs text-amber-400 mt-1.5">{t("cs_no_clients")}</p>
      )}
    </FG>
  );
}

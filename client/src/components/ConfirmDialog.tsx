import { useI18n } from "../i18n";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, onConfirm, onCancel }: Props) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-xl w-[340px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-2xl text-center mb-3">⚠️</div>
        <h3 className="font-bebas text-center text-base mb-1.5">{t("confirm_delete_title")}</h3>
        <p className="text-muted text-[12px] text-center mb-5 leading-relaxed">{t("confirm_delete_body")}</p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-border text-[13px] text-sec bg-transparent cursor-pointer hover:bg-el transition-colors"
          >
            {t("confirm_delete_no")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl border-none text-[13px] text-white bg-accent cursor-pointer hover:opacity-90 transition-opacity"
          >
            {t("confirm_delete_yes")}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useI18n } from "../i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 bg-card/90 border border-border rounded-full p-1 flex items-center gap-1 backdrop-blur-sm">
      <button
        onClick={() => setLocale("it")}
        className={`px-3 py-1 text-xs rounded-full font-semibold cursor-pointer transition-colors ${
          locale === "it" ? "bg-accent text-white" : "text-sec hover:bg-white/[.04]"
        }`}
      >
        {t("lang_it")}
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1 text-xs rounded-full font-semibold cursor-pointer transition-colors ${
          locale === "en" ? "bg-accent text-white" : "text-sec hover:bg-white/[.04]"
        }`}
      >
        {t("lang_en")}
      </button>
    </div>
  );
}

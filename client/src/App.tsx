import { useState } from "react";
import { AuthProvider, useAuth } from "./store";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { I18nProvider, useI18n } from "./i18n";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { RoleLanding } from "./pages/RoleLanding";

function AppInner() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [authPage, setAuthPage] = useState<"login" | "register">("login");
  const [entryRole, setEntryRole] = useState<"unset" | "client">("unset");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-linear-to-br from-accent to-red-500 rounded-2xl flex items-center justify-center text-[28px]">
          ⚕️
        </div>
        <div className="font-bebas text-2xl tracking-[.1em]">{t("brand_name")}</div>
        <div className="text-muted text-xs">{t("loading_data")}</div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[9px] h-[9px] rounded-full bg-accent animate-pulse"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    if (entryRole === "unset") {
      return <RoleLanding onChooseClient={() => setEntryRole("client")} />;
    }
    if (authPage === "register") {
      return <Register goLogin={() => setAuthPage("login")} />;
    }
    return <Login goRegister={() => setAuthPage("register")} />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <LanguageSwitcher />
        <AppInner />
      </AuthProvider>
    </I18nProvider>
  );
}

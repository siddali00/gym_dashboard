import { ReactNode } from "react";
import { useAuth } from "../store";
import { useI18n } from "../i18n";

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

export function DashLayout({
  nav,
  active,
  setActive,
  children,
}: {
  nav: NavItem[];
  active: string;
  setActive: (id: string) => void;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <nav className="w-[220px] min-w-[220px] bg-bg/95 border-r border-border flex flex-col overflow-y-auto p-3">
        <div className="px-2.5 pt-1.5 pb-3.5 border-b border-border mb-2">
          <div className="font-bebas text-[11px] text-muted tracking-[.2em]">{t("dash_brand")}</div>
          <div className="font-bebas text-[15px] tracking-[.12em]">{t("dash_title")}</div>
        </div>

        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            className={`flex items-center gap-[9px] px-3 py-[9px] rounded-lg border-none w-full text-left text-[13px] mb-0.5 cursor-pointer transition-colors ${
              active === n.id
                ? "bg-accent/10 text-accent border-l-2 border-l-accent"
                : "bg-transparent text-sec border-l-2 border-l-transparent hover:bg-white/[.03]"
            }`}
          >
            <span className="text-sm">{n.icon}</span>
            {n.label}
          </button>
        ))}

        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1.5">
            <div className="w-[34px] h-[34px] rounded-full bg-accent/[.12] border border-accent/30 flex items-center justify-center text-accent font-semibold text-[13px] shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{user.name}</div>
              <div className="text-[9px] bg-blue/[.1] text-blue px-1.5 py-px rounded-full inline-block mt-0.5 capitalize">{user.role?.replace("_", " ") || "cliente"}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-[7px] px-3 bg-transparent border border-accent/20 rounded-lg text-accent text-xs cursor-pointer font-bebas tracking-[.08em] hover:bg-accent/10 transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

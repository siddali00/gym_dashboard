import {
  forwardRef,
} from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

export const Card = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(function Card(
  { children, className = "" },
  ref
) {
  return (
    <div ref={ref} className={`bg-card border border-border rounded-[14px] ${className}`}>
      {children}
    </div>
  );
});

export function CardHead({ children }: { children: ReactNode }) {
  return (
    <div className="px-[18px] py-[13px] border-b border-border flex items-center justify-between gap-2">
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger" | "green" | "blue";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = "rounded-[9px] px-[18px] py-[9px] cursor-pointer font-bebas tracking-[.1em] text-[13px] transition-all duration-150 border-none disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-linear-to-br from-accent to-red-500 text-white",
    outline: "bg-transparent border border-border text-text",
    danger: "bg-accent/10 text-accent border border-accent/20",
    green: "bg-linear-to-br from-green to-green-600 text-white",
    blue: "bg-blue/10 text-blue border border-blue/25",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Badge({ children, color = "muted" }: { children: ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    ok: "bg-green/10 text-green-400",
    warn: "bg-amber/10 text-amber-300",
    err: "bg-accent/10 text-accent",
    muted: "bg-muted/10 text-muted",
    blue: "bg-blue/10 text-blue",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] tracking-[.06em] inline-block ${colors[color] || colors.muted}`}>{children}</span>;
}

export function FG({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`mb-3 ${className}`}>
      <label className="text-[11px] text-muted block mb-1">{label}</label>
      {children}
    </div>
  );
}

export const Inp = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Inp(
  props,
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      className={`bg-el border border-border rounded-lg px-3 py-[9px] text-text font-sans text-[13px] w-full ${props.className || ""}`}
    />
  );
});

export function Sel(props: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      {...props}
      className={`bg-el border border-border rounded-lg px-3 py-[9px] text-text font-sans text-[13px] w-full ${props.className || ""}`}
    >
      {props.children}
    </select>
  );
}

export function Txta(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`bg-el border border-border rounded-lg px-3 py-[9px] text-text font-sans text-[13px] w-full resize-y ${props.className || ""}`}
    />
  );
}

export function Empty({ icon, msg, sub }: { icon: string; msg: string; sub?: string }) {
  return (
    <div className="text-center py-9 px-5 text-muted">
      <div className="text-[32px] mb-2.5">{icon}</div>
      <div className="text-sm text-sec mb-1">{msg}</div>
      {sub && <div className="text-xs">{sub}</div>}
    </div>
  );
}

export function PageHead({ title, accent, sub }: { title: string; accent: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-bebas text-4xl tracking-[.04em] mb-1">
        {title} <span className="text-accent">{accent}</span>
      </h1>
      {sub && <p className="text-muted text-[13px]">{sub}</p>}
    </div>
  );
}

export function InfoBox({ icon, title, body, color = "blue" }: { icon: string; title: string; body: ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue/[.07] border-blue/20 text-blue",
    amber: "bg-amber/[.07] border-amber/20 text-amber",
    accent: "bg-accent/[.07] border-accent/20 text-accent",
    green: "bg-green/[.07] border-green/20 text-green",
  };
  return (
    <div className={`border rounded-[10px] px-[15px] py-[11px] mb-3.5 text-xs ${colors[color] || colors.blue}`}>
      <strong className="block mb-1">{icon} {title}</strong>
      <span className="text-muted leading-relaxed">{body}</span>
    </div>
  );
}

export function OkMsg({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="bg-green/10 border border-green/30 rounded-lg px-3 py-2 text-[13px] text-green mb-3">
      ✓ {msg}
    </div>
  );
}

export function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-green/90 text-white px-5 py-3 rounded-xl text-sm shadow-lg z-50 flex items-center gap-3">
      ✓ {msg}
      <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">&times;</button>
    </div>
  );
}

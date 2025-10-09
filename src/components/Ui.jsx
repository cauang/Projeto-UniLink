// src/components/Ui.jsx
const cx = (...c) => c.filter(Boolean).join(" ");

export function Button({ as: Tag = "button", className, variant = "primary", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium transition";
  const styles = {
    primary: "text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 active:from-blue-700 active:to-emerald-700",
    ghost: "bg-neutral-800/60 hover:bg-neutral-800 text-neutral-100",
    outline: "border border-neutral-700 hover:border-neutral-500",
  };
  return <Tag className={cx(base, styles[variant], className)} {...props} />;
}

export function Input({ className, ...props }) {
  const base = "w-full rounded-xl bg-neutral-900/70 border border-neutral-800 px-3 py-2.5 outline-none ring-0 focus:border-neutral-600";
  return <input className={cx(base, className)} {...props} />;
}

export function Card({ className, ...props }) {
  const base = "bg-neutral-900/60 border border-neutral-800 backdrop-blur rounded-2xl";
  return <div className={cx(base, className)} {...props} />;
}

export function Chip({ className, ...props }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs border border-neutral-800 bg-neutral-900/70";
  return <span className={cx(base, className)} {...props} />;
}

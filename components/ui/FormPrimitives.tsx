// FormPrimitives — shared UI building blocks used by every card in the form.
//
//   inputCls   — Tailwind class string applied to all inputs and selects for
//                consistent styling across the form.
//   Card       — white rounded panel with a small uppercase section label at the top.
//                Each section of the PCR form is wrapped in one of these.
//   Field      — label + input wrapper that stacks them vertically with a small gap.
//                Every labeled input in the form uses this.

import { cn } from "@/lib/cn";

export const inputCls =
  "rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white";

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

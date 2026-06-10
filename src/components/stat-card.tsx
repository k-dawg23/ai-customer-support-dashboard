import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  accent
}: {
  label: string;
  value: string;
  hint: string;
  accent?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        {accent}
      </div>
      <p className="mt-4 text-sm text-muted">{hint}</p>
    </div>
  );
}

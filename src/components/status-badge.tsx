import { cn } from "@/lib/utils";
import type { ConversationStatus } from "@/lib/types";

const toneMap: Record<string, string> = {
  OPEN: "bg-info/15 text-info border-info/20",
  PENDING: "bg-warning/15 text-warning border-warning/20",
  RESOLVED: "bg-success/15 text-success border-success/20",
  ESCALATED: "bg-danger/15 text-danger border-danger/20",
  GENERATED: "bg-ai/15 text-ai border-ai/20"
};

export function StatusBadge({
  status,
  label
}: {
  status: ConversationStatus | "GENERATED";
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        toneMap[status]
      )}
    >
      {label ?? status.replace("_", " ")}
    </span>
  );
}

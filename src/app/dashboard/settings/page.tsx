import { updateSettingsAction } from "@/app/actions";
import { requireRole } from "@/lib/session";
import { getWorkspaceSettings } from "@/lib/store";
import { getMonthlyAiUsageSummary } from "@/lib/usage";

export default async function SettingsPage() {
  const { organisation, membership } = await requireRole(["ADMIN", "SUPPORT_AGENT", "VIEWER"]);
  const [settings, usageSummary] = await Promise.all([
    getWorkspaceSettings(organisation.id),
    getMonthlyAiUsageSummary(organisation.id)
  ]);
  const aiUsageCount = usageSummary.used;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Organisation support preferences and AI usage controls.
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form action={updateSettingsAction} className="grid gap-4 rounded-[28px] border border-border bg-surface p-6 md:grid-cols-2">
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-foreground">Company name</span>
            <input
              name="companyName"
              defaultValue={settings.companyName}
              disabled={membership.role !== "ADMIN"}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Support tone</span>
            <select
              name="supportTone"
              defaultValue={settings.supportTone}
              disabled={membership.role !== "ADMIN"}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            >
              <option value="FRIENDLY">Friendly</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="CONCISE">Concise</option>
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Default AI model</span>
            <input
              name="defaultAiModel"
              defaultValue={settings.defaultAiModel}
              disabled={membership.role !== "ADMIN"}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Monthly AI generation limit</span>
            <input
              name="monthlyAiUsageLimit"
              type="number"
              defaultValue={settings.monthlyAiUsageLimit}
              disabled={membership.role !== "ADMIN"}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Business hours</span>
            <input
              name="businessHours"
              defaultValue={settings.businessHours}
              disabled={membership.role !== "ADMIN"}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-foreground">Escalation message</span>
            <textarea
              name="escalationMessage"
              rows={4}
              defaultValue={settings.escalationMessage}
              disabled={membership.role !== "ADMIN"}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          {membership.role === "ADMIN" ? (
            <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white md:col-span-2">
              Save settings
            </button>
          ) : null}
        </form>

        <section className="space-y-4 rounded-[28px] border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">AI usage</h2>
          <div className="rounded-3xl border border-border bg-surface-muted p-5">
            <p className="text-sm text-muted">Current month usage</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {aiUsageCount} / {settings.monthlyAiUsageLimit}
            </p>
            <div className="mt-4 h-2 rounded-full bg-surface">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.min((aiUsageCount / settings.monthlyAiUsageLimit) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-surface-muted p-5">
            <p className="text-sm text-muted">Limit enforcement</p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              V1 enforces monthly AI usage by generation count. Token and cost estimates are still
              captured for analytics when available.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

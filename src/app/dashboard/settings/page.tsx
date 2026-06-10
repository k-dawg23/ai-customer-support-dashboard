import {
  createWorkspaceUserAction,
  removeWorkspaceUserAction,
  updateSettingsAction,
  updateWorkspaceUserRoleAction
} from "@/app/actions";
import { requireRole } from "@/lib/session";
import { getWorkspaceSettings, getWorkspaceUsers } from "@/lib/store";
import { getMonthlyAiUsageSummary } from "@/lib/usage";

export default async function SettingsPage() {
  const { organisation, membership, user } = await requireRole(["ADMIN", "SUPPORT_AGENT", "VIEWER"]);
  const [settings, usageSummary, workspaceUsers] = await Promise.all([
    getWorkspaceSettings(organisation.id),
    getMonthlyAiUsageSummary(organisation.id),
    getWorkspaceUsers(organisation.id)
  ]);
  const aiUsageCount = usageSummary.used;
  const canManage = membership.role === "ADMIN";

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
              disabled={!canManage}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Support tone</span>
            <select
              name="supportTone"
              defaultValue={settings.supportTone}
              disabled={!canManage}
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
              disabled={!canManage}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Monthly AI generation limit</span>
            <input
              name="monthlyAiUsageLimit"
              type="number"
              defaultValue={settings.monthlyAiUsageLimit}
              disabled={!canManage}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Business hours</span>
            <input
              name="businessHours"
              defaultValue={settings.businessHours}
              disabled={!canManage}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium text-foreground">Escalation message</span>
            <textarea
              name="escalationMessage"
              rows={4}
              defaultValue={settings.escalationMessage}
              disabled={!canManage}
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          {canManage ? (
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
              Limits are enforced by draft generation count for the current month. Token and cost
              estimates are still captured for analytics.
            </p>
          </div>
        </section>
      </div>

      {canManage ? (
        <section className="space-y-6 rounded-[28px] border border-border bg-surface p-6">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">User management</h2>
              <p className="text-sm text-muted">
                Manage workspace access, change roles, and invite new teammates.
              </p>
            </div>
            <p className="text-sm text-muted">{workspaceUsers.length} active users</p>
          </div>

          <form action={createWorkspaceUserAction} className="grid gap-3 rounded-3xl border border-border bg-surface-muted p-5 md:grid-cols-2 xl:grid-cols-4">
            <input
              name="name"
              placeholder="Full name"
              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
            />
            <select
              name="role"
              defaultValue="SUPPORT_AGENT"
              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPPORT_AGENT">Support Agent</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <input
              name="password"
              defaultValue="demo1234"
              placeholder="Temporary password"
              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
            />
            <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white md:col-span-2 xl:col-span-4">
              Add user
            </button>
          </form>

          <div className="space-y-3">
            {workspaceUsers.map((member) => {
              const isCurrentUser = member.id === user.id;
              return (
                <article
                  key={member.membershipId}
                  className="grid gap-4 rounded-3xl border border-border bg-surface-muted p-5 xl:grid-cols-[1.2fr_0.7fr_0.8fr]"
                >
                  <div>
                    <p className="text-base font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted">{member.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                      {isCurrentUser ? "Current user" : "Active member"}
                    </p>
                  </div>

                  <form action={updateWorkspaceUserRoleAction} className="flex flex-col gap-3">
                    <input type="hidden" name="membershipId" value={member.membershipId} />
                    <input type="hidden" name="userId" value={member.id} />
                    <label className="space-y-2 text-sm">
                      <span className="font-medium text-foreground">Role</span>
                      <select
                        name="role"
                        defaultValue={member.role}
                        disabled={isCurrentUser}
                        className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-foreground"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="SUPPORT_AGENT">Support Agent</option>
                        <option value="VIEWER">Viewer</option>
                      </select>
                    </label>
                    <button
                      type="submit"
                      disabled={isCurrentUser}
                      className="rounded-full border border-border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Change role
                    </button>
                  </form>

                  <form action={removeWorkspaceUserAction} className="flex flex-col justify-between gap-3">
                    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                      <p className="text-sm font-medium text-foreground">Permissions</p>
                      <p className="mt-1 text-sm text-muted">
                        {member.role === "ADMIN"
                          ? "Full access to settings, users, and content management."
                          : member.role === "SUPPORT_AGENT"
                            ? "Can manage conversations and use AI drafts."
                            : "Read-only access across the workspace."}
                      </p>
                    </div>
                    <input type="hidden" name="membershipId" value={member.membershipId} />
                    <input type="hidden" name="userId" value={member.id} />
                    <button
                      type="submit"
                      disabled={isCurrentUser}
                      className="rounded-full border border-danger/20 bg-danger/10 px-4 py-2 text-sm font-medium text-danger disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove user
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

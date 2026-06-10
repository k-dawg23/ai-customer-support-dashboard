import {
  createCannedResponseAction,
  deleteCannedResponseAction,
  updateCannedResponseAction
} from "@/app/actions";
import { requireRole } from "@/lib/session";
import { getWorkspaceCannedResponses } from "@/lib/store";

export default async function CannedResponsesPage() {
  const { organisation, membership } = await requireRole(["ADMIN", "SUPPORT_AGENT", "VIEWER"]);
  const responses = await getWorkspaceCannedResponses(organisation.id);
  const canManage = membership.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Canned responses</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Reusable replies with usage analytics.
        </h1>
      </div>

      {canManage ? (
        <form action={createCannedResponseAction} className="grid gap-3 rounded-[28px] border border-border bg-surface-muted p-6 lg:grid-cols-2">
          <input
            name="title"
            placeholder="Response title"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
          />
          <input
            name="category"
            placeholder="Category"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
          />
          <textarea
            name="body"
            rows={4}
            placeholder="Response text"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground lg:col-span-2"
          />
          <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
            Add canned response
          </button>
        </form>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {responses.map((response) => (
          <article key={response.id} className="rounded-[28px] border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">{response.category}</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">{response.title}</h2>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Used {response.usageCount}x
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-foreground">{response.body}</p>
            {canManage ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <form action={updateCannedResponseAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={response.id} />
                  <input
                    name="category"
                    defaultValue={response.category}
                    className="rounded-full border border-border bg-surface-muted px-4 py-2 text-sm text-foreground"
                  />
                  <button type="submit" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                    Update category
                  </button>
                </form>
                <form action={deleteCannedResponseAction}>
                  <input type="hidden" name="id" value={response.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-danger/20 bg-danger/10 px-4 py-2 text-sm font-medium text-danger"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

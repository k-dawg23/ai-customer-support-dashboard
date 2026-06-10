import {
  addNoteAction,
  assignConversationAction,
  generateDraftAction,
  insertCannedResponseAction,
  postReplyAction,
  rejectDraftAction,
  resolveConversationAction,
  saveDraftAction
} from "@/app/actions";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import {
  getConversation,
  getConversationMessages,
  getConversationNotes,
  getState,
  getWorkspaceAiGenerations,
  getWorkspaceCannedResponses,
  getWorkspaceUsers
} from "@/lib/store";
import { requireSession } from "@/lib/session";

export default async function ConversationDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ conversationId: string }>;
  searchParams: Promise<{ generationId?: string; edited?: string; limitReached?: string }>;
}) {
  const { organisation, membership } = await requireSession();
  const { conversationId } = await params;
  const { generationId, limitReached } = await searchParams;
  const [conversation, messages, notes, users, cannedResponses, allGenerations] = await Promise.all([
    getConversation(organisation.id, conversationId),
    getConversationMessages(conversationId),
    getConversationNotes(conversationId),
    getWorkspaceUsers(organisation.id),
    getWorkspaceCannedResponses(organisation.id),
    getWorkspaceAiGenerations(organisation.id)
  ]);
  const generations = allGenerations.filter(
    (item) => item.conversationId === conversationId
  );
  const currentGeneration = generations.find((item) => item.id === generationId) ?? generations[0];
  const canEdit = membership.role !== "VIEWER";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-6">
        <div className="rounded-[28px] border border-border bg-surface-muted p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-muted">
                #{conversation.id.replace("conv-", "")} · {conversation.customerName}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {conversation.subject}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={conversation.status} />
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {conversation.channel.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">Conversation history</h2>
          <div className="mt-6 space-y-4">
            {messages.map((message) => {
              const author = message.authorId
                ? users.find((user) => user.id === message.authorId)?.name ?? "Support"
                : "Customer";
              return (
                <article
                  key={message.id}
                  className={`rounded-3xl border p-4 ${
                    message.authorType === "customer"
                      ? "border-border bg-surface-muted"
                      : "border-primary/15 bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted">
                    <span>{author}</span>
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{message.body}</p>
                </article>
              );
            })}
          </div>
        </div>

        {membership.role !== "VIEWER" ? (
          <div className="rounded-[28px] border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Internal notes</h2>
              <p className="text-sm text-muted">Visible to Admin and Support Agent only.</p>
            </div>
            <div className="mt-4 space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="rounded-3xl border border-border bg-surface-muted p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    {users.find((user) => user.id === note.authorId)?.name ?? "Team"} ·{" "}
                    {formatDate(note.createdAt)}
                  </p>
                  <p className="mt-2 text-sm text-foreground">{note.body}</p>
                </div>
              ))}
            </div>
            <form action={addNoteAction} className="mt-4 space-y-3">
              <input type="hidden" name="conversationId" value={conversationId} />
              <textarea
                name="body"
                rows={3}
                placeholder="Add a private note"
                className="w-full rounded-3xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground"
              />
              <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                Add note
              </button>
            </form>
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <div className="rounded-[28px] border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Reply workspace</h2>
            <StatusBadge status="GENERATED" label="AI draft generated" />
          </div>
          {limitReached ? (
            <p className="mt-4 rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
              Monthly AI draft generation limit reached for this workspace.
            </p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <form action={assignConversationAction} className="space-y-2">
              <input type="hidden" name="conversationId" value={conversationId} />
              <label className="text-sm font-medium text-foreground">Assignee</label>
              <select
                name="assignedToId"
                defaultValue={conversation.assignedToId}
                disabled={!canEdit}
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground"
              >
                {users
                  .filter((user) => user.role !== "VIEWER")
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
              {canEdit ? (
                <button type="submit" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                  Update assignment
                </button>
              ) : null}
            </form>

            <form action={resolveConversationAction} className="space-y-2">
              <input type="hidden" name="conversationId" value={conversationId} />
              <label className="text-sm font-medium text-foreground">Status</label>
              <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
                {conversation.status}
              </div>
              {canEdit ? (
                <button type="submit" className="rounded-full bg-success px-4 py-2 text-sm font-semibold text-white">
                  Mark resolved
                </button>
              ) : null}
            </form>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-medium text-foreground">Suggested sources</h3>
            <div className="flex flex-wrap gap-2">
              {(currentGeneration?.sourceSnippetTitles ?? []).map((source) => (
                <span key={source} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {source}
                </span>
              ))}
              {currentGeneration?.warning ? (
                <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                  {currentGeneration.warning}
                </span>
              ) : null}
            </div>
          </div>

          {canEdit ? (
            <>
              <div className="mt-6 grid gap-3">
                <form action={generateDraftAction} className="grid gap-3">
                  <input type="hidden" name="conversationId" value={conversationId} />
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-foreground">Optional canned response</span>
                    <select
                      name="cannedResponseId"
                      defaultValue=""
                      className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground"
                    >
                      <option value="">None</option>
                      {cannedResponses.map((response) => (
                        <option key={response.id} value={response.id}>
                          {response.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white">
                    Generate suggested reply
                  </button>
                </form>

                <form action={insertCannedResponseAction} className="grid gap-3">
                  <input type="hidden" name="conversationId" value={conversationId} />
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-foreground">Insert canned response</span>
                    <select
                      name="cannedResponseId"
                      className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground"
                    >
                      {cannedResponses.map((response) => (
                        <option key={response.id} value={response.id}>
                          {response.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="rounded-full border border-border px-4 py-3 text-sm font-medium">
                    Insert into draft
                  </button>
                </form>
              </div>

              <form action={saveDraftAction} className="mt-6 space-y-3">
                <input type="hidden" name="conversationId" value={conversationId} />
                <input type="hidden" name="generationId" value={currentGeneration?.id ?? ""} />
                <textarea
                  name="latestDraft"
                  rows={12}
                  defaultValue={conversation.latestDraft}
                  className="w-full rounded-3xl border border-border bg-surface-muted px-4 py-4 text-sm leading-6 text-foreground"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    name="edited"
                    value="true"
                    className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white"
                  >
                    Save reviewed draft
                  </button>
                  <button
                    formAction={postReplyAction}
                    type="submit"
                    className="rounded-full border border-border px-4 py-3 text-sm font-medium text-foreground"
                  >
                    Save and move to pending
                  </button>
                  {currentGeneration ? (
                    <button
                      type="submit"
                      name="edited"
                      value="false"
                      className="rounded-full border border-border px-4 py-3 text-sm font-medium text-foreground"
                    >
                      Accept unchanged
                    </button>
                  ) : null}
                  {currentGeneration ? (
                    <button
                      formAction={rejectDraftAction}
                      type="submit"
                      className="rounded-full border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
                    >
                      Reject draft
                    </button>
                  ) : null}
                </div>
              </form>
            </>
          ) : (
            <div className="mt-6 rounded-3xl border border-border bg-surface-muted p-4 text-sm text-muted">
              Viewer access includes conversation history only. Draft editing, notes, and workflow actions are
              restricted.
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">AI generation history</h2>
          <div className="mt-4 space-y-3">
            {generations.map((generation) => (
              <div key={generation.id} className="rounded-3xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-foreground">{generation.confidenceLabel} confidence</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    {generation.outcome.replaceAll("_", " ")}
                  </p>
                </div>
                <p className="mt-2 text-sm text-muted">{generation.sourceSnippetTitles.join(" · ") || "No sources"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

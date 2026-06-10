import Link from "next/link";

import { getWorkspaceUsers, getWorkspaceConversations } from "@/lib/store";
import { requireSession } from "@/lib/session";
import type { ConversationStatus } from "@/lib/types";

export default async function ConversationsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: ConversationStatus }>;
}) {
  const { organisation } = await requireSession();
  const { status } = await searchParams;
  const [workspaceConversations, users] = await Promise.all([
    getWorkspaceConversations(organisation.id),
    getWorkspaceUsers(organisation.id)
  ]);
  const conversations = workspaceConversations.filter((conversation) =>
    status ? conversation.status === status : true
  );

  const formatStatus = (value: string) => value.replaceAll("_", " ");
  const formatChannel = (value: string) => value.replaceAll("_", " ");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Conversations</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Filter, assign, and review support threads.
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {["OPEN", "PENDING", "RESOLVED"].map((filter) => (
            <Link
              key={filter}
              href={`/dashboard/conversations?status=${filter}`}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition hover:border-primary hover:text-primary"
            >
              {filter.toLowerCase()}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {conversations.map((conversation) => {
          const assignedUser = users.find((user) => user.id === conversation.assignedToId);
          return (
            <article
              key={conversation.id}
              className="rounded-[28px] border border-border bg-surface p-5"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted">
                    #{conversation.id.replace("conv-", "")} · {conversation.customerName}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">{conversation.subject}</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Status</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {formatStatus(conversation.status)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Assigned</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {assignedUser?.name ?? "Unassigned"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Channel</p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {formatChannel(conversation.channel)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/conversations/${conversation.id}`}
                    className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Open conversation
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

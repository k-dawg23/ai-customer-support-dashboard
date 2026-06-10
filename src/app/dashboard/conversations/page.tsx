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

      <div className="overflow-hidden rounded-[28px] border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface-muted text-left text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-5 py-4">Conversation</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Assigned</th>
              <th className="px-5 py-4">Channel</th>
              <th className="px-5 py-4">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {conversations.map((conversation) => {
              const assignedUser = users.find((user) => user.id === conversation.assignedToId);
              return (
                <tr key={conversation.id} className="hover:bg-surface-muted/80">
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/conversations/${conversation.id}`} className="block">
                      <p className="text-sm text-muted">
                        #{conversation.id.replace("conv-", "")} · {conversation.customerName}
                      </p>
                      <p className="mt-1 font-medium text-foreground">{conversation.subject}</p>
                      <p className="mt-2 text-sm text-primary">Open conversation</p>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted">
                      Status: {conversation.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">{assignedUser?.name ?? "Unassigned"}</td>
                  <td className="px-5 py-4 text-sm text-muted">
                    Source: {conversation.channel.replace("_", " ")}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/conversations/${conversation.id}`}
                      className="inline-flex rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Activity, Bot, BookOpenText, Clock3, MessageSquareMore, Sparkles } from "lucide-react";

import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardMetrics } from "@/lib/metrics";
import { getWorkspaceConversations } from "@/lib/store";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const { organisation } = await requireSession();
  const [metrics, conversations] = await Promise.all([
    getDashboardMetrics(organisation.id),
    getWorkspaceConversations(organisation.id)
  ]);
  const recentConversations = conversations
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 rounded-[28px] border border-border bg-surface-muted p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Overview</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Support performance at a glance.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Monitor queue health, AI usage, and knowledge coverage from one dashboard designed for
            human-reviewed support workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="OPEN" label="Open queue" />
          <StatusBadge status="PENDING" label="Pending customer" />
          <StatusBadge status="RESOLVED" label="Resolved today" />
          <StatusBadge status="GENERATED" label="AI assisted" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Open conversations"
          value={String(metrics.openConversations)}
          hint="Tickets needing agent action."
          accent={<MessageSquareMore className="size-10 rounded-2xl bg-info/10 p-2 text-info" />}
        />
        <StatCard
          label="Resolved conversations"
          value={String(metrics.resolvedConversations)}
          hint="Issues closed in the current seed history."
          accent={<Activity className="size-10 rounded-2xl bg-success/10 p-2 text-success" />}
        />
        <StatCard
          label="Average response time"
          value={`${metrics.averageResponseTimeMinutes} min`}
          hint="Based on first customer-to-agent reply."
          accent={<Clock3 className="size-10 rounded-2xl bg-warning/10 p-2 text-warning" />}
        />
        <StatCard
          label="AI replies generated"
          value={String(metrics.aiRepliesGenerated)}
          hint="Human-reviewed drafts produced this month."
          accent={<Sparkles className="size-10 rounded-2xl bg-ai/10 p-2 text-ai" />}
        />
        <StatCard
          label="Knowledge base articles"
          value={String(metrics.knowledgeBaseArticles)}
          hint="Active and inactive business guidance."
          accent={<BookOpenText className="size-10 rounded-2xl bg-primary/10 p-2 text-primary" />}
        />
        <StatCard
          label="Canned response uses"
          value={String(metrics.cannedResponsesUsed)}
          hint="Reusable replies inserted into drafts."
          accent={<Bot className="size-10 rounded-2xl bg-primary/10 p-2 text-primary" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Recent conversations</h2>
              <p className="mt-1 text-sm text-muted">A quick view of the live queue.</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {recentConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-surface-muted p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-muted">
                    #{conversation.id.replace("conv-", "")} · {conversation.customerName}
                  </p>
                  <h3 className="mt-1 font-semibold text-foreground">{conversation.subject}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                    Status: {conversation.status.replace("_", " ").toLowerCase()}
                  </span>
                  <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                    Source: {conversation.channel.replace("_", " ").toLowerCase()}
                  </span>
                  <Link
                    href={`/dashboard/conversations/${conversation.id}`}
                    className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Open conversation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-[28px] border border-border bg-surface p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">AI outcome mix</h2>
            <p className="mt-1 text-sm text-muted">Basic quality analytics for human-reviewed drafts.</p>
          </div>
          {Object.entries(metrics.aiOutcomeBreakdown).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-foreground">{key.replaceAll("_", " ")}</span>
                <span className="text-muted">{value}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${Math.max((value / Math.max(metrics.aiRepliesGenerated, 1)) * 100, 6)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

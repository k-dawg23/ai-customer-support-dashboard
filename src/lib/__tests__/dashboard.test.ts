import { describe, expect, it, beforeEach } from "vitest";

import { canViewInternalNotes, getVisibleInternalNotes } from "@/lib/guards";
import { getDashboardMetrics } from "@/lib/metrics";
import { addAiGeneration, getState, resetStore, updateAiGenerationOutcome } from "@/lib/store";
import { getMonthlyAiUsageSummary } from "@/lib/usage";

describe("dashboard metrics and role guards", () => {
  beforeEach(() => {
    resetStore();
  });

  it("scopes metrics to the active organisation", async () => {
    const metrics = await getDashboardMetrics("org-stackbeacon");

    expect(metrics.openConversations).toBe(12);
    expect(metrics.pendingConversations).toBe(8);
    expect(metrics.resolvedConversations).toBe(15);
    expect(metrics.resolvedToday).toBe(7);
    expect(metrics.aiRepliesGenerated).toBe(42);
    expect(metrics.knowledgeBaseArticles).toBe(18);
    expect(metrics.cannedResponsesCount).toBe(12);
    expect(metrics.averageResponseTimeMinutes).toBe(14);
  });

  it("hides internal notes from viewers", async () => {
    expect(canViewInternalNotes("ADMIN")).toBe(true);
    expect(canViewInternalNotes("SUPPORT_AGENT")).toBe(true);
    expect(canViewInternalNotes("VIEWER")).toBe(false);
    expect(await getVisibleInternalNotes("VIEWER", "conv-1024")).toHaveLength(0);
  });

  it("tracks AI approval outcome transitions", async () => {
    const generation = await addAiGeneration({
      organisationId: "org-stackbeacon",
      conversationId: "conv-1036",
      draft: "Draft",
      confidenceLabel: "Medium",
      sourceArticleIds: ["kb-1"],
      sourceSnippetTitles: ["Billing upgrades take up to 15 minutes"],
      outcome: "generated",
      tokenEstimate: 200,
      estimatedCostUsd: 0.004
    });

    await updateAiGenerationOutcome(generation.id, "edited_and_used", "Edited draft");

    const updated = getState().aiGenerations.find((item) => item.id === generation.id);
    expect(updated?.outcome).toBe("edited_and_used");
    expect(updated?.draft).toBe("Edited draft");
  });

  it("summarizes monthly AI usage by generation count", async () => {
    const summary = await getMonthlyAiUsageSummary("org-stackbeacon");

    expect(summary.used).toBe(42);
    expect(summary.limit).toBe(120);
    expect(summary.tokens).toBeGreaterThan(0);
    expect(summary.estimatedCostUsd).toBeGreaterThan(0);
  });
});

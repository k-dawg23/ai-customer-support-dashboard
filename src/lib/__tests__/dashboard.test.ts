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

    expect(metrics.openConversations).toBe(1);
    expect(metrics.resolvedConversations).toBe(1);
    expect(metrics.aiRepliesGenerated).toBe(1);
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
      conversationId: "conv-1088",
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

    expect(summary.used).toBe(1);
    expect(summary.limit).toBe(100);
    expect(summary.tokens).toBe(420);
    expect(summary.estimatedCostUsd).toBe(0.01);
  });
});

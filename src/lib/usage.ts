import { getWorkspaceSettings, getWorkspaceUsageEvents } from "@/lib/store";

export async function getMonthlyAiUsageSummary(organisationId: string) {
  const [settings, usageEvents] = await Promise.all([
    getWorkspaceSettings(organisationId),
    getWorkspaceUsageEvents(organisationId)
  ]);
  const aiEvents = usageEvents.filter(
    (event) => event.organisationId === organisationId && event.type === "AI_GENERATION"
  );

  return {
    limit: settings.monthlyAiUsageLimit,
    used: aiEvents.length,
    remaining: Math.max(settings.monthlyAiUsageLimit - aiEvents.length, 0),
    tokens: aiEvents.reduce((sum, event) => sum + (event.tokenEstimate ?? 0), 0),
    estimatedCostUsd: Number(
      aiEvents.reduce((sum, event) => sum + (event.estimatedCostUsd ?? 0), 0).toFixed(4)
    )
  };
}

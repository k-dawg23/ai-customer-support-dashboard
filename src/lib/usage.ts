import { getWorkspaceSettings, getWorkspaceUsageEvents } from "@/lib/store";

function getReferenceDate(values: string[]) {
  const timestamps = values.map((value) => new Date(value).getTime()).filter((value) => !Number.isNaN(value));
  return timestamps.length ? new Date(Math.max(...timestamps)) : new Date();
}

export async function getMonthlyAiUsageSummary(organisationId: string) {
  const [settings, usageEvents] = await Promise.all([
    getWorkspaceSettings(organisationId),
    getWorkspaceUsageEvents(organisationId)
  ]);
  const aiEvents = usageEvents.filter(
    (event) => event.organisationId === organisationId && event.type === "AI_GENERATION"
  );
  const referenceDate = getReferenceDate(aiEvents.map((event) => event.createdAt));
  const month = referenceDate.getUTCMonth();
  const year = referenceDate.getUTCFullYear();
  const currentMonthEvents = aiEvents.filter((event) => {
    const eventDate = new Date(event.createdAt);
    return eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() === month;
  });

  return {
    limit: settings.monthlyAiUsageLimit,
    used: currentMonthEvents.length,
    remaining: Math.max(settings.monthlyAiUsageLimit - currentMonthEvents.length, 0),
    tokens: currentMonthEvents.reduce((sum, event) => sum + (event.tokenEstimate ?? 0), 0),
    estimatedCostUsd: Number(
      currentMonthEvents
        .reduce((sum, event) => sum + (event.estimatedCostUsd ?? 0), 0)
        .toFixed(4)
    )
  };
}

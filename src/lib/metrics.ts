import type { AiApprovalOutcome, ConversationStatus } from "@/lib/types";
import {
  getConversationMessages,
  getWorkspaceAiGenerations,
  getWorkspaceArticles,
  getWorkspaceCannedResponses,
  getWorkspaceConversations
} from "@/lib/store";

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function getReferenceDate(values: string[]) {
  const timestamps = values.map((value) => new Date(value).getTime()).filter((value) => !Number.isNaN(value));
  return timestamps.length ? new Date(Math.max(...timestamps)) : new Date();
}

export async function getDashboardMetrics(organisationId: string) {
  const [conversations, aiGenerations, articles, cannedResponses] = await Promise.all([
    getWorkspaceConversations(organisationId),
    getWorkspaceAiGenerations(organisationId),
    getWorkspaceArticles(organisationId),
    getWorkspaceCannedResponses(organisationId)
  ]);

  const countsByStatus = conversations.reduce<Record<ConversationStatus, number>>(
    (accumulator, conversation) => {
      accumulator[conversation.status] += 1;
      return accumulator;
    },
    { OPEN: 0, PENDING: 0, RESOLVED: 0, ESCALATED: 0 }
  );

  const responseDurations = (
    await Promise.all(
      conversations.map(async (conversation) => {
        const conversationMessages = await getConversationMessages(conversation.id);
        const [customerMessage] = conversationMessages.filter(
          (message) => message.authorType === "customer"
        );
        const firstAgentMessage = conversationMessages.find(
          (message) => message.authorType === "agent"
        );
        if (!customerMessage || !firstAgentMessage) {
          return null;
        }
        return (
          (new Date(firstAgentMessage.createdAt).getTime() -
            new Date(customerMessage.createdAt).getTime()) /
          (1000 * 60)
        );
      })
    )
  ).filter((value): value is number => value !== null);

  const averageResponseTimeMinutes =
    responseDurations.length === 0
      ? 0
      : Math.round(responseDurations.reduce((sum, value) => sum + value, 0) / responseDurations.length);

  const aiOutcomes = aiGenerations.reduce<Record<AiApprovalOutcome, number>>(
    (accumulator, generation) => {
      accumulator[generation.outcome] += 1;
      return accumulator;
    },
    {
      generated: 0,
      accepted_unchanged: 0,
      edited_and_used: 0,
      rejected: 0
    }
  );

  const reviewedTotal =
    aiOutcomes.accepted_unchanged + aiOutcomes.edited_and_used + aiOutcomes.rejected;
  const referenceDate = getReferenceDate([
    ...conversations.flatMap((conversation) => [conversation.updatedAt, conversation.resolvedAt ?? ""]),
    ...aiGenerations.map((generation) => generation.createdAt)
  ]);

  const resolvedToday = conversations.filter((conversation) => {
    if (!conversation.resolvedAt) {
      return false;
    }
    return startOfDay(new Date(conversation.resolvedAt)).getTime() === startOfDay(referenceDate).getTime();
  }).length;

  const aiPeriodStart = new Date(referenceDate);
  aiPeriodStart.setUTCDate(aiPeriodStart.getUTCDate() - 29);
  const aiLast30Days = aiGenerations.filter((generation) => {
    const createdAt = new Date(generation.createdAt);
    return createdAt >= aiPeriodStart && createdAt <= referenceDate;
  });

  const aiTrendLast30Days = Array.from({ length: 8 }, (_, index) => {
    const bucketStart = new Date(aiPeriodStart);
    bucketStart.setUTCDate(aiPeriodStart.getUTCDate() + index * 4);
    const bucketEnd = new Date(bucketStart);
    bucketEnd.setUTCDate(bucketStart.getUTCDate() + 4);
    return aiLast30Days.filter((generation) => {
      const createdAt = new Date(generation.createdAt);
      return createdAt >= bucketStart && createdAt < bucketEnd;
    }).length;
  });

  return {
    openConversations: countsByStatus.OPEN,
    pendingConversations: countsByStatus.PENDING,
    resolvedConversations: countsByStatus.RESOLVED,
    resolvedToday,
    averageResponseTimeMinutes,
    aiRepliesGenerated: aiLast30Days.length,
    knowledgeBaseArticles: articles.length,
    cannedResponsesCount: cannedResponses.length,
    cannedResponsesUsed: cannedResponses.reduce((sum, response) => sum + response.usageCount, 0),
    statusBreakdown: countsByStatus,
    aiOutcomeBreakdown: aiOutcomes,
    aiOutcomePercentages: {
      accepted_unchanged:
        reviewedTotal === 0 ? 0 : Math.round((aiOutcomes.accepted_unchanged / reviewedTotal) * 100),
      edited_and_used:
        reviewedTotal === 0 ? 0 : Math.round((aiOutcomes.edited_and_used / reviewedTotal) * 100),
      rejected: reviewedTotal === 0 ? 0 : Math.round((aiOutcomes.rejected / reviewedTotal) * 100)
    },
    aiTrendLast30Days
  };
}

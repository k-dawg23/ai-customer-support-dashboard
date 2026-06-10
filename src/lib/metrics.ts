import type { AiApprovalOutcome, ConversationStatus } from "@/lib/types";
import {
  getConversationMessages,
  getWorkspaceAiGenerations,
  getWorkspaceArticles,
  getWorkspaceCannedResponses,
  getWorkspaceConversations
} from "@/lib/store";

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
          (new Date(firstAgentMessage.createdAt).getTime() - new Date(customerMessage.createdAt).getTime()) /
          (1000 * 60)
        );
      })
    )
  ).filter((value): value is number => value !== null);

  const avgResponseTimeMinutes =
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

  return {
    openConversations: countsByStatus.OPEN,
    resolvedConversations: countsByStatus.RESOLVED,
    averageResponseTimeMinutes: avgResponseTimeMinutes,
    aiRepliesGenerated: aiGenerations.length,
    knowledgeBaseArticles: articles.length,
    cannedResponsesUsed: cannedResponses.reduce((sum, response) => sum + response.usageCount, 0),
    statusBreakdown: countsByStatus,
    aiOutcomeBreakdown: aiOutcomes
  };
}

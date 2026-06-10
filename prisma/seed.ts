import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  seedAiGenerations,
  seedArticles,
  seedCannedResponses,
  seedConversations,
  seedMemberships,
  seedMessages,
  seedNotes,
  seedOrganisation,
  seedSettings,
  seedUsageEvents,
  seedUsers
} from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  await prisma.usageEvent.deleteMany();
  await prisma.aiReplyGeneration.deleteMany();
  await prisma.internalNote.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.cannedResponse.deleteMany();
  await prisma.knowledgeBaseArticle.deleteMany();
  await prisma.organisationSettings.deleteMany();
  await prisma.organisationMember.deleteMany();
  await prisma.organisation.deleteMany();
  await prisma.user.deleteMany();

  await prisma.organisation.create({
    data: {
      id: seedOrganisation.id,
      name: seedOrganisation.name,
      settings: {
        create: {
          id: seedSettings.id,
          companyName: seedSettings.companyName,
          supportTone: seedSettings.supportTone,
          defaultAiModel: seedSettings.defaultAiModel,
          monthlyAiUsageLimit: seedSettings.monthlyAiUsageLimit,
          businessHours: seedSettings.businessHours,
          escalationMessage: seedSettings.escalationMessage
        }
      }
    }
  });

  await prisma.user.createMany({
    data: seedUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash
    }))
  });

  await prisma.organisationMember.createMany({
    data: seedMemberships.map((membership) => ({
      id: membership.id,
      organisationId: membership.organisationId,
      userId: membership.userId,
      role: membership.role,
      active: membership.active
    }))
  });

  await prisma.knowledgeBaseArticle.createMany({
    data: seedArticles.map((article) => ({
      id: article.id,
      organisationId: article.organisationId,
      title: article.title,
      category: article.category,
      summary: article.summary,
      body: article.body,
      state: article.state,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt)
    }))
  });

  await prisma.cannedResponse.createMany({
    data: seedCannedResponses.map((response) => ({
      id: response.id,
      organisationId: response.organisationId,
      title: response.title,
      category: response.category,
      body: response.body,
      usageCount: response.usageCount,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt)
    }))
  });

  await prisma.conversation.createMany({
    data: seedConversations.map((conversation) => ({
      id: conversation.id,
      organisationId: conversation.organisationId,
      customerName: conversation.customerName,
      customerEmail: conversation.customerEmail,
      subject: conversation.subject,
      channel: conversation.channel,
      status: conversation.status,
      priority: conversation.priority,
      assignedToId: conversation.assignedToId ?? null,
      latestDraft: conversation.latestDraft ?? null,
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt),
      resolvedAt: conversation.resolvedAt ? new Date(conversation.resolvedAt) : null
    }))
  });

  await prisma.message.createMany({
    data: seedMessages.map((message) => ({
      id: message.id,
      conversationId: message.conversationId,
      authorId: message.authorId ?? null,
      authorType: message.authorType,
      body: message.body,
      createdAt: new Date(message.createdAt)
    }))
  });

  await prisma.internalNote.createMany({
    data: seedNotes.map((note) => ({
      id: note.id,
      conversationId: note.conversationId,
      authorId: note.authorId,
      body: note.body,
      createdAt: new Date(note.createdAt)
    }))
  });

  await prisma.aiReplyGeneration.createMany({
    data: seedAiGenerations.map((generation) => ({
      id: generation.id,
      organisationId: generation.organisationId,
      conversationId: generation.conversationId,
      draft: generation.draft,
      confidenceLabel: generation.confidenceLabel,
      sourceArticleIds: generation.sourceArticleIds,
      sourceSnippetTitles: generation.sourceSnippetTitles,
      outcome:
        generation.outcome === "accepted_unchanged"
          ? "ACCEPTED_UNCHANGED"
          : generation.outcome === "edited_and_used"
            ? "EDITED_AND_USED"
            : generation.outcome === "rejected"
              ? "REJECTED"
              : "GENERATED",
      tokenEstimate: generation.tokenEstimate ?? null,
      estimatedCostUsd: generation.estimatedCostUsd ?? null,
      warning: generation.warning ?? null,
      createdAt: new Date(generation.createdAt),
      updatedAt: new Date(generation.updatedAt)
    }))
  });

  await prisma.usageEvent.createMany({
    data: seedUsageEvents.map(
      (event): Prisma.UsageEventCreateManyInput => ({
        id: event.id,
        organisationId: event.organisationId,
        type: event.type,
        referenceId: event.referenceId ?? null,
        tokenEstimate: event.tokenEstimate ?? null,
        estimatedCostUsd: event.estimatedCostUsd ?? null,
        metadata: (event.metadata as Prisma.InputJsonValue | undefined) ?? Prisma.JsonNull,
        createdAt: new Date(event.createdAt)
      })
    )
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

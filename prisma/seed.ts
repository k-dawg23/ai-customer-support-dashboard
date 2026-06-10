import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  const organisation = await prisma.organisation.create({
    data: {
      name: "StackBeacon Support",
      settings: {
        create: {
          companyName: "StackBeacon",
          supportTone: "PROFESSIONAL",
          defaultAiModel: "gpt-4.1-mini",
          monthlyAiUsageLimit: 100,
          businessHours: "Mon-Fri, 09:00-17:00 GMT",
          escalationMessage: "If we need more time to investigate, we will escalate this to a specialist and reply within one business day."
        }
      }
    }
  });

  const users = await prisma.$transaction([
    prisma.user.create({
      data: { name: "Ava Admin", email: "ava@stackbeacon.test", passwordHash }
    }),
    prisma.user.create({
      data: { name: "Sam Support", email: "sam@stackbeacon.test", passwordHash }
    }),
    prisma.user.create({
      data: { name: "Vera Viewer", email: "vera@stackbeacon.test", passwordHash }
    })
  ]);

  const [admin, agent, viewer] = users;

  await prisma.organisationMember.createMany({
    data: [
      { organisationId: organisation.id, userId: admin.id, role: "ADMIN" },
      { organisationId: organisation.id, userId: agent.id, role: "SUPPORT_AGENT" },
      { organisationId: organisation.id, userId: viewer.id, role: "VIEWER" }
    ]
  });

  const articles = await prisma.knowledgeBaseArticle.createManyAndReturn({
    data: [
      {
        organisationId: organisation.id,
        title: "Billing upgrades take up to 15 minutes",
        category: "Billing",
        summary: "Explains the short sync delay after subscription changes.",
        body: "Subscription upgrades can take up to 15 minutes to appear. Ask the customer to sign out and back in before escalating.",
        state: "ACTIVE"
      },
      {
        organisationId: organisation.id,
        title: "Refund review process",
        category: "Billing",
        summary: "Explains when refunds can be approved.",
        body: "Refunds are reviewed within one business day. Agents should collect the receipt number and reason before escalating.",
        state: "ACTIVE"
      },
      {
        organisationId: organisation.id,
        title: "Legacy import guidance",
        category: "Migrations",
        summary: "Deprecated internal-only steps.",
        body: "Legacy import guidance for a retired onboarding flow.",
        state: "INACTIVE"
      }
    ]
  });

  const cannedResponses = await prisma.cannedResponse.createManyAndReturn({
    data: [
      {
        organisationId: organisation.id,
        title: "Billing sync reassurance",
        category: "Billing",
        body: "Thanks for checking in. Subscription changes can take up to 15 minutes to appear. Please sign out and back in, then let us know if the issue continues.",
        usageCount: 8
      },
      {
        organisationId: organisation.id,
        title: "Need receipt number",
        category: "Escalations",
        body: "Could you reply with the receipt number for this purchase? That will let us verify the payment and investigate further.",
        usageCount: 5
      }
    ]
  });

  const conversation = await prisma.conversation.create({
    data: {
      organisationId: organisation.id,
      customerName: "John Smith",
      customerEmail: "john@example.com",
      subject: "Paid plan still shows Free",
      channel: "EMAIL",
      status: "OPEN",
      priority: "High",
      assignedToId: agent.id,
      latestDraft: "Thanks for contacting us. Subscription upgrades can take up to 15 minutes to appear. Please sign out and back in. If the issue persists, reply with your receipt number and we'll investigate further."
    }
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        authorType: "customer",
        body: "I paid yesterday but my account still shows Free.",
        createdAt: new Date("2026-06-09T08:05:00.000Z")
      },
      {
        conversationId: conversation.id,
        authorId: agent.id,
        authorType: "agent",
        body: "Thanks for contacting us. Subscription upgrades can take up to 15 minutes to appear. Please sign out and back in. If the issue persists, reply with your receipt number and we'll investigate further.",
        createdAt: new Date("2026-06-09T08:18:00.000Z")
      }
    ]
  });

  await prisma.internalNote.create({
    data: {
      conversationId: conversation.id,
      authorId: admin.id,
      body: "Customer is on the enterprise trial list. If payment verification fails, escalate to billing immediately."
    }
  });

  await prisma.aiReplyGeneration.create({
    data: {
      organisationId: organisation.id,
      conversationId: conversation.id,
      draft: "Thanks for contacting us. Subscription upgrades can take up to 15 minutes to appear. Please sign out and back in. If the issue persists, reply with your receipt number and we'll investigate further.",
      confidenceLabel: "High",
      sourceArticleIds: [articles[0].id, articles[1].id],
      sourceSnippetTitles: [articles[0].title, articles[1].title],
      outcome: "ACCEPTED_UNCHANGED",
      tokenEstimate: 420,
      estimatedCostUsd: 0.01
    }
  });

  const usageEvents: Prisma.UsageEventCreateManyInput[] = [
    {
      organisationId: organisation.id,
      type: "AI_GENERATION",
      referenceId: conversation.id,
      tokenEstimate: 420,
      estimatedCostUsd: 0.01,
      metadata: { outcome: "accepted_unchanged" }
    },
    {
      organisationId: organisation.id,
      type: "CANNED_RESPONSE_INSERTED",
      referenceId: cannedResponses[0].id,
      metadata: { conversationId: conversation.id }
    }
  ];

  await prisma.usageEvent.createMany({ data: usageEvents });
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

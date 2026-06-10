import type { AppState } from "@/lib/types";

export const demoState: AppState = {
  organisations: [{ id: "org-stackbeacon", name: "StackBeacon Support" }],
  users: [
    { id: "user-admin", name: "Ava Admin", email: "ava@stackbeacon.test", password: "demo1234" },
    { id: "user-agent", name: "Sam Support", email: "sam@stackbeacon.test", password: "demo1234" },
    { id: "user-viewer", name: "Vera Viewer", email: "vera@stackbeacon.test", password: "demo1234" }
  ],
  memberships: [
    { id: "member-admin", organisationId: "org-stackbeacon", userId: "user-admin", role: "ADMIN", active: true },
    { id: "member-agent", organisationId: "org-stackbeacon", userId: "user-agent", role: "SUPPORT_AGENT", active: true },
    { id: "member-viewer", organisationId: "org-stackbeacon", userId: "user-viewer", role: "VIEWER", active: true }
  ],
  conversations: [
    {
      id: "conv-1024",
      organisationId: "org-stackbeacon",
      customerName: "John Smith",
      customerEmail: "john@example.com",
      subject: "Paid plan still shows Free",
      channel: "EMAIL",
      status: "OPEN",
      priority: "High",
      assignedToId: "user-agent",
      latestDraft:
        "Thanks for contacting us. Subscription upgrades can take up to 15 minutes to appear. Please sign out and back in. If the issue persists, reply with your receipt number and we'll investigate further.",
      createdAt: "2026-06-09T08:05:00.000Z",
      updatedAt: "2026-06-09T08:18:00.000Z"
    },
    {
      id: "conv-1088",
      organisationId: "org-stackbeacon",
      customerName: "Priya Patel",
      customerEmail: "priya@example.com",
      subject: "Need invoice copy",
      channel: "WEBSITE",
      status: "PENDING",
      priority: "Medium",
      assignedToId: "user-admin",
      latestDraft: "We can help with that. Please confirm the billing email on the account and we’ll send over the invoice details.",
      createdAt: "2026-06-08T12:20:00.000Z",
      updatedAt: "2026-06-08T12:35:00.000Z"
    },
    {
      id: "conv-1113",
      organisationId: "org-stackbeacon",
      customerName: "Marco Green",
      customerEmail: "marco@example.com",
      subject: "Refund status",
      channel: "LIVE_CHAT",
      status: "RESOLVED",
      priority: "Low",
      assignedToId: "user-agent",
      latestDraft: "We have escalated your refund request and expect an update within one business day.",
      createdAt: "2026-06-07T09:00:00.000Z",
      updatedAt: "2026-06-07T09:50:00.000Z",
      resolvedAt: "2026-06-07T09:50:00.000Z"
    }
  ],
  messages: [
    {
      id: "msg-1",
      conversationId: "conv-1024",
      authorType: "customer",
      body: "I paid yesterday but my account still shows Free.",
      createdAt: "2026-06-09T08:05:00.000Z"
    },
    {
      id: "msg-2",
      conversationId: "conv-1024",
      authorType: "agent",
      authorId: "user-agent",
      body: "Thanks for contacting us. Subscription upgrades can take up to 15 minutes to appear. Please sign out and back in. If the issue persists, reply with your receipt number and we'll investigate further.",
      createdAt: "2026-06-09T08:18:00.000Z"
    },
    {
      id: "msg-3",
      conversationId: "conv-1088",
      authorType: "customer",
      body: "Can you send me a copy of invoice INV-8842?",
      createdAt: "2026-06-08T12:20:00.000Z"
    },
    {
      id: "msg-4",
      conversationId: "conv-1113",
      authorType: "customer",
      body: "What’s the status of my refund request?",
      createdAt: "2026-06-07T09:00:00.000Z"
    }
  ],
  notes: [
    {
      id: "note-1",
      conversationId: "conv-1024",
      authorId: "user-admin",
      body: "Customer is on the enterprise trial list. If payment verification fails, escalate to billing immediately.",
      createdAt: "2026-06-09T08:12:00.000Z"
    }
  ],
  articles: [
    {
      id: "kb-1",
      organisationId: "org-stackbeacon",
      title: "Billing upgrades take up to 15 minutes",
      category: "Billing",
      summary: "Explains the short sync delay after subscription changes.",
      body: "Subscription upgrades can take up to 15 minutes to appear. Ask the customer to sign out and back in before escalating.",
      state: "ACTIVE",
      createdAt: "2026-06-01T09:00:00.000Z",
      updatedAt: "2026-06-01T09:00:00.000Z"
    },
    {
      id: "kb-2",
      organisationId: "org-stackbeacon",
      title: "Refund review process",
      category: "Billing",
      summary: "Explains when refunds can be approved.",
      body: "Refunds are reviewed within one business day. Agents should collect the receipt number and reason before escalating.",
      state: "ACTIVE",
      createdAt: "2026-06-02T10:00:00.000Z",
      updatedAt: "2026-06-02T10:00:00.000Z"
    },
    {
      id: "kb-3",
      organisationId: "org-stackbeacon",
      title: "Legacy import guidance",
      category: "Migrations",
      summary: "Deprecated internal guide.",
      body: "Legacy import guidance for a retired onboarding flow.",
      state: "INACTIVE",
      createdAt: "2026-06-03T10:00:00.000Z",
      updatedAt: "2026-06-03T10:00:00.000Z"
    }
  ],
  cannedResponses: [
    {
      id: "can-1",
      organisationId: "org-stackbeacon",
      title: "Billing sync reassurance",
      category: "Billing",
      body: "Thanks for checking in. Subscription changes can take up to 15 minutes to appear. Please sign out and back in, then let us know if the issue continues.",
      usageCount: 8,
      createdAt: "2026-06-02T09:00:00.000Z",
      updatedAt: "2026-06-08T09:00:00.000Z"
    },
    {
      id: "can-2",
      organisationId: "org-stackbeacon",
      title: "Need receipt number",
      category: "Escalations",
      body: "Could you reply with the receipt number for this purchase? That will let us verify the payment and investigate further.",
      usageCount: 5,
      createdAt: "2026-06-02T10:00:00.000Z",
      updatedAt: "2026-06-08T10:00:00.000Z"
    }
  ],
  settings: [
    {
      id: "settings-1",
      organisationId: "org-stackbeacon",
      companyName: "StackBeacon",
      supportTone: "PROFESSIONAL",
      defaultAiModel: "gpt-4.1-mini",
      monthlyAiUsageLimit: 100,
      businessHours: "Mon-Fri, 09:00-17:00 GMT",
      escalationMessage:
        "If we need more time to investigate, we will escalate this to a specialist and reply within one business day."
    }
  ],
  aiGenerations: [
    {
      id: "ai-1",
      organisationId: "org-stackbeacon",
      conversationId: "conv-1024",
      draft:
        "Thanks for contacting us. Subscription upgrades can take up to 15 minutes to appear. Please sign out and back in. If the issue persists, reply with your receipt number and we'll investigate further.",
      confidenceLabel: "High",
      sourceArticleIds: ["kb-1", "kb-2"],
      sourceSnippetTitles: ["Billing upgrades take up to 15 minutes", "Refund review process"],
      outcome: "accepted_unchanged",
      tokenEstimate: 420,
      estimatedCostUsd: 0.01,
      createdAt: "2026-06-09T08:15:00.000Z",
      updatedAt: "2026-06-09T08:18:00.000Z"
    }
  ],
  usageEvents: [
    {
      id: "usage-1",
      organisationId: "org-stackbeacon",
      type: "AI_GENERATION",
      referenceId: "conv-1024",
      tokenEstimate: 420,
      estimatedCostUsd: 0.01,
      metadata: { outcome: "accepted_unchanged" },
      createdAt: "2026-06-09T08:15:00.000Z"
    },
    {
      id: "usage-2",
      organisationId: "org-stackbeacon",
      type: "CANNED_RESPONSE_INSERTED",
      referenceId: "can-1",
      metadata: { conversationId: "conv-1024" },
      createdAt: "2026-06-09T08:16:00.000Z"
    }
  ]
};

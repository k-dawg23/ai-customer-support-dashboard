import type {
  AiReplyGeneration,
  AppState,
  CannedResponse,
  Conversation,
  KnowledgeBaseArticle,
  Message,
  Organisation,
  OrganisationMember,
  OrganisationSettings,
  UsageEvent,
  User
} from "@/lib/types";

type SeedConversationConfig = {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  channel: Conversation["channel"];
  status: Conversation["status"];
  priority: Conversation["priority"];
  assignedToId: string;
  createdAt: string;
  resolvedAt?: string;
  thread: Array<{ authorType: Message["authorType"]; authorId?: string; body: string }>;
  note?: { authorId: string; body: string; createdAtOffsetMinutes: number };
};

const organisationId = "org-stackbeacon";

export const seedOrganisation: Organisation = {
  id: organisationId,
  name: "StackBeacon Support"
};

export const seedUsers: User[] = [
  { id: "user-admin", name: "Ava Admin", email: "ava@stackbeacon.test", password: "demo1234" },
  { id: "user-admin-2", name: "Noah Ops", email: "noah@stackbeacon.test", password: "demo1234" },
  { id: "user-agent", name: "Sam Support", email: "sam@stackbeacon.test", password: "demo1234" },
  { id: "user-agent-2", name: "Mia Billing", email: "mia@stackbeacon.test", password: "demo1234" },
  { id: "user-agent-3", name: "Leo Success", email: "leo@stackbeacon.test", password: "demo1234" },
  { id: "user-viewer", name: "Vera Viewer", email: "vera@stackbeacon.test", password: "demo1234" }
];

export const seedMemberships: OrganisationMember[] = [
  { id: "member-admin", organisationId, userId: "user-admin", role: "ADMIN", active: true },
  { id: "member-admin-2", organisationId, userId: "user-admin-2", role: "ADMIN", active: true },
  { id: "member-agent", organisationId, userId: "user-agent", role: "SUPPORT_AGENT", active: true },
  { id: "member-agent-2", organisationId, userId: "user-agent-2", role: "SUPPORT_AGENT", active: true },
  { id: "member-agent-3", organisationId, userId: "user-agent-3", role: "SUPPORT_AGENT", active: true },
  { id: "member-viewer", organisationId, userId: "user-viewer", role: "VIEWER", active: true }
];

export const seedSettings: OrganisationSettings = {
  id: "settings-1",
  organisationId,
  companyName: "StackBeacon",
  supportTone: "PROFESSIONAL",
  defaultAiModel: "gpt-4.1-mini",
  monthlyAiUsageLimit: 120,
  businessHours: "Mon-Fri, 09:00-17:00 GMT",
  escalationMessage:
    "If we need more time to investigate, we will escalate this to a specialist and reply within one business day."
};

const articleSeedRows: [string, string, string, string, string, KnowledgeBaseArticle["state"]][] = [
  ["kb-1", "Billing", "Billing upgrades take up to 15 minutes", "Explains the short sync delay after subscription changes.", "Subscription upgrades can take up to 15 minutes to appear. Ask the customer to sign out and back in before escalating.", "ACTIVE"],
  ["kb-2", "Billing", "Invoice copy requests", "How to verify account ownership before sending billing documents.", "Confirm the billing email, the invoice number, and the last four digits of the payment method before sharing invoice details.", "ACTIVE"],
  ["kb-3", "Billing", "Refund review process", "Explains what agents must collect before escalation.", "Refunds are reviewed within one business day. Collect the receipt number, reason, and whether the service was used.", "ACTIVE"],
  ["kb-4", "Subscriptions", "Subscription activation troubleshooting", "Covers plan upgrades that do not appear immediately.", "If the paid plan is still missing after sign-out and sign-in, verify the payment event and ask the customer for the receipt number.", "ACTIVE"],
  ["kb-5", "Subscriptions", "Cancel and downgrade policy", "Describes when a downgrade takes effect.", "Downgrades take effect at the next renewal date unless finance approves an immediate exception.", "ACTIVE"],
  ["kb-6", "Accounts", "Account lock recovery", "Explains how to verify identity before unlocking access.", "Agents should verify the billing email or recent login IP summary before requesting an admin unlock.", "ACTIVE"],
  ["kb-7", "Authentication", "Password reset delivery issues", "Used when reset emails are delayed or blocked.", "Ask the customer to search spam, promotions, and security quarantine folders, then confirm the email address on file.", "ACTIVE"],
  ["kb-8", "Authentication", "Two-factor authentication reset", "When an admin can clear a lost authenticator device.", "Admins may reset 2FA after ownership verification through billing email and recent successful login history.", "ACTIVE"],
  ["kb-9", "Teams", "Team invitation troubleshooting", "Common reasons an invite never arrives.", "Have the customer confirm the invite email, ask the sender to revoke and resend, and check whether the address already belongs to another workspace.", "ACTIVE"],
  ["kb-10", "Teams", "Role permissions matrix", "Summarizes what admins, agents, and viewers can do.", "Only admins can manage users, billing settings, and knowledge-base updates. Agents can manage conversations. Viewers have read-only access.", "ACTIVE"],
  ["kb-11", "Integrations", "Export job delays", "What to do when CSV exports remain queued.", "If an export remains queued for longer than 20 minutes, collect the workspace id and escalate to platform support.", "ACTIVE"],
  ["kb-12", "Integrations", "Webhook retry guidance", "Explains the automatic retry window for failed outbound events.", "Outbound webhooks retry for up to 24 hours with exponential backoff before they are marked failed.", "ACTIVE"],
  ["kb-13", "Mobile", "Mobile app sync troubleshooting", "Steps for stale inbox data in the mobile app.", "Ask the customer to refresh manually, sign out and back in, and confirm they are running the latest app build.", "ACTIVE"],
  ["kb-14", "Email", "Missing notification email checks", "Delivery guidance for confirmation and invite emails.", "Check spam folders, suppression status, and whether the recipient domain is blocking noreply mail before escalating.", "ACTIVE"],
  ["kb-15", "Billing", "Failed payment follow-up", "How to guide customers through retrying a payment.", "Advise the customer to retry the invoice from the billing portal, confirm card support for international payments, and capture the failure timestamp.", "ACTIVE"],
  ["kb-16", "Accounts", "Profile verification mismatch", "Handles name or company-name discrepancies on accounts.", "If the workspace owner and billing owner differ, collect a confirmation reply from the billing contact before updating account details.", "ACTIVE"],
  ["kb-17", "Integrations", "Slack integration reconnect", "Steps to restore a disconnected Slack app.", "Reconnect the Slack integration from workspace settings and confirm the installer still has permission in the Slack workspace.", "INACTIVE"],
  ["kb-18", "Migrations", "Legacy import guidance", "Deprecated internal guide kept for historical reference.", "Legacy import guidance for a retired onboarding flow.", "INACTIVE"]
];

export const seedArticles: KnowledgeBaseArticle[] = articleSeedRows.map(([id, category, title, summary, body, state], index) => ({
  id,
  organisationId,
  category,
  title,
  summary,
  body,
  state: state as KnowledgeBaseArticle["state"],
  createdAt: new Date(Date.UTC(2026, 4, 10 + index, 9, 0, 0)).toISOString(),
  updatedAt: new Date(Date.UTC(2026, 5, 1 + (index % 9), 10, 0, 0)).toISOString()
}));

const cannedResponseSeedRows: [string, string, string, string, number][] = [
  ["can-1", "Billing", "Upgrade Delay", "Thanks for checking in. Subscription changes can take up to 15 minutes to appear. Please sign out and back in, then let us know if the issue continues.", 14],
  ["can-2", "Billing", "Invoice Request", "Happy to help with the invoice. Please confirm the billing email on the account and the invoice number so we can send the correct copy.", 10],
  ["can-3", "Billing", "Refund Processing", "We have submitted your refund request for review. We will update you within one business day as soon as billing confirms the outcome.", 9],
  ["can-4", "Authentication", "Password Reset", "Please use the reset link again and check spam or security folders if the email does not arrive within a few minutes.", 11],
  ["can-5", "Accounts", "Account Verification", "For security, please confirm the billing email on the account and the company name associated with the workspace.", 6],
  ["can-6", "Teams", "Team Invite Troubleshooting", "Please ask the workspace admin to revoke the pending invite and send a new one to the exact email address you want to use.", 8],
  ["can-7", "Billing", "Payment Retry Guidance", "Please retry the payment from the billing portal and share the exact failure time if the error appears again.", 7],
  ["can-8", "Integrations", "Export Delay", "Your export is still processing. If it has been queued for more than 20 minutes, reply and we will escalate it for investigation.", 5],
  ["can-9", "Mobile", "Mobile Sync Steps", "Please refresh the app, sign out and back in, and confirm you are using the latest mobile version.", 4],
  ["can-10", "Accounts", "Ownership Confirmation", "Before we make this change, please confirm you are the workspace owner or ask the billing contact to reply from their email address.", 5],
  ["can-11", "Subscriptions", "Downgrade Timing", "Your current plan remains active until the end of the billing period. The downgrade will apply automatically on the renewal date.", 3],
  ["can-12", "Escalations", "Specialist Follow-up", "We have escalated this to a specialist. We will reply with an update within one business day.", 6]
];

export const seedCannedResponses: CannedResponse[] = cannedResponseSeedRows.map(([id, category, title, body, usageCount], index) => ({
  id,
  organisationId,
  category,
  title,
  body,
  usageCount,
  createdAt: new Date(Date.UTC(2026, 4, 12 + index, 11, 0, 0)).toISOString(),
  updatedAt: new Date(Date.UTC(2026, 5, 2 + (index % 8), 9, 30, 0)).toISOString()
}));

const conversationConfigs: SeedConversationConfig[] = [
  {
    id: "conv-1024",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    subject: "Subscription not activated",
    channel: "EMAIL",
    status: "OPEN",
    priority: "High",
    assignedToId: "user-agent",
    createdAt: "2026-06-10T08:05:00.000Z",
    thread: [
      { authorType: "customer", body: "I upgraded yesterday and my workspace still shows the Free plan." },
      { authorType: "agent", authorId: "user-agent", body: "Thanks for contacting us. Please sign out and back in once, then confirm whether the paid plan appears." },
      { authorType: "customer", body: "I tried that twice and it still says Free." },
      { authorType: "agent", authorId: "user-agent", body: "Please send the receipt number and I will verify the payment event for you." }
    ],
    note: {
      authorId: "user-admin",
      body: "Enterprise prospect. Escalate to billing quickly if the Stripe event is missing.",
      createdAtOffsetMinutes: 9
    }
  },
  {
    id: "conv-1025",
    customerName: "Ella Nguyen",
    customerEmail: "ella@example.com",
    subject: "Password reset issue",
    channel: "WEBSITE",
    status: "OPEN",
    priority: "Medium",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-10T07:42:00.000Z",
    thread: [
      { authorType: "customer", body: "I never receive the password reset email." },
      { authorType: "agent", authorId: "user-agent-3", body: "Please check spam and any security quarantine folder, then tell me whether the account email is ella@example.com." },
      { authorType: "customer", body: "Yes, that is the right email and nothing is in spam." }
    ]
  },
  {
    id: "conv-1026",
    customerName: "Mateo Ruiz",
    customerEmail: "mateo@example.com",
    subject: "Invoice request",
    channel: "EMAIL",
    status: "OPEN",
    priority: "Low",
    assignedToId: "user-admin",
    createdAt: "2026-06-10T07:10:00.000Z",
    thread: [
      { authorType: "customer", body: "Can you send invoice INV-2033 for our May payment?" },
      { authorType: "agent", authorId: "user-admin", body: "Yes. Please confirm the billing email tied to that invoice so I can attach the correct copy." }
    ]
  },
  {
    id: "conv-1027",
    customerName: "Nina Foster",
    customerEmail: "nina@example.com",
    subject: "Account locked",
    channel: "LIVE_CHAT",
    status: "OPEN",
    priority: "High",
    assignedToId: "user-agent-2",
    createdAt: "2026-06-10T06:55:00.000Z",
    thread: [
      { authorType: "customer", body: "My account was locked after too many login attempts and I cannot get back in." },
      { authorType: "agent", authorId: "user-agent-2", body: "I can help. Please confirm the billing email on the workspace so I can verify ownership." },
      { authorType: "customer", body: "The billing email is ops@northbridge.io." },
      { authorType: "agent", authorId: "user-agent-2", body: "Thanks. I have asked an admin to review the unlock and will update you shortly." }
    ]
  },
  {
    id: "conv-1028",
    customerName: "Dylan Price",
    customerEmail: "dylan@example.com",
    subject: "Failed payment",
    channel: "EMAIL",
    status: "OPEN",
    priority: "High",
    assignedToId: "user-agent-2",
    createdAt: "2026-06-10T06:20:00.000Z",
    thread: [
      { authorType: "customer", body: "Our renewal payment failed three times even though the card works elsewhere." },
      { authorType: "agent", authorId: "user-agent-2", body: "Please retry once more from the billing portal and share the exact failure time if it happens again." },
      { authorType: "customer", body: "It failed again at 06:36 UTC with a generic decline." },
      { authorType: "agent", authorId: "user-agent-2", body: "Thanks. I am checking whether the issuer is blocking international payments on that card." },
      { authorType: "customer", body: "This is impacting our renewal today." },
      { authorType: "agent", authorId: "user-agent-2", body: "Understood. I have marked this high priority and will escalate if the next check fails." }
    ]
  },
  {
    id: "conv-1029",
    customerName: "Sara Ibrahim",
    customerEmail: "sara@example.com",
    subject: "Refund request",
    channel: "WEBSITE",
    status: "OPEN",
    priority: "Medium",
    assignedToId: "user-agent",
    createdAt: "2026-06-10T05:45:00.000Z",
    thread: [
      { authorType: "customer", body: "We renewed by mistake and need a refund for the annual plan." },
      { authorType: "agent", authorId: "user-agent", body: "I can submit that for review. Please send the receipt number and confirm whether the workspace was used after renewal." },
      { authorType: "customer", body: "Receipt is ch_2399 and we did not use the account after it renewed." }
    ]
  },
  {
    id: "conv-1030",
    customerName: "Ben Carter",
    customerEmail: "ben@example.com",
    subject: "Feature question",
    channel: "EMAIL",
    status: "OPEN",
    priority: "Low",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-10T05:15:00.000Z",
    thread: [
      { authorType: "customer", body: "Does your dashboard support tagging conversations by product area?" },
      { authorType: "agent", authorId: "user-agent-3", body: "Not yet in the current release. Could you share how you want the tags to be used so I can log product feedback?" }
    ]
  },
  {
    id: "conv-1031",
    customerName: "Olivia Hart",
    customerEmail: "olivia@example.com",
    subject: "Missing email",
    channel: "EMAIL",
    status: "OPEN",
    priority: "Medium",
    assignedToId: "user-admin",
    createdAt: "2026-06-09T16:40:00.000Z",
    thread: [
      { authorType: "customer", body: "Our invitation email never arrived for one teammate." },
      { authorType: "agent", authorId: "user-admin", body: "Please confirm the exact recipient address and whether the company mail filter quarantines external invites." },
      { authorType: "customer", body: "The address is hannah@copperlane.co and the filter is pretty strict." },
      { authorType: "agent", authorId: "user-admin", body: "Thanks. Ask your admin to allow mail from noreply@stackbeacon.test and resend the invite once that is done." }
    ]
  },
  {
    id: "conv-1032",
    customerName: "Victor Chen",
    customerEmail: "victor@example.com",
    subject: "Export problem",
    channel: "WEBSITE",
    status: "OPEN",
    priority: "Medium",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-09T15:35:00.000Z",
    thread: [
      { authorType: "customer", body: "CSV export has been stuck on queued for half an hour." },
      { authorType: "agent", authorId: "user-agent-3", body: "Thanks for flagging that. Please share the workspace name and roughly when you started the export." },
      { authorType: "customer", body: "Workspace is Beacon Labs and I started it around 15:02 UTC." },
      { authorType: "agent", authorId: "user-agent-3", body: "I have enough to escalate it if the export does not clear shortly." }
    ]
  },
  {
    id: "conv-1033",
    customerName: "Holly Grant",
    customerEmail: "holly@example.com",
    subject: "Mobile app issue",
    channel: "LIVE_CHAT",
    status: "OPEN",
    priority: "Medium",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-09T14:55:00.000Z",
    thread: [
      { authorType: "customer", body: "The mobile app still shows yesterday's inbox and never refreshes." },
      { authorType: "agent", authorId: "user-agent-3", body: "Please pull to refresh, sign out and back in, and tell me the app version if it still looks stale." },
      { authorType: "customer", body: "It is version 2.7.1 and still stale after signing back in." }
    ]
  },
  {
    id: "conv-1034",
    customerName: "Ryan Bell",
    customerEmail: "ryan@example.com",
    subject: "Team invitation issue",
    channel: "EMAIL",
    status: "OPEN",
    priority: "Medium",
    assignedToId: "user-agent",
    createdAt: "2026-06-09T13:25:00.000Z",
    thread: [
      { authorType: "customer", body: "Our new hire clicks the invite link and lands on an error page." },
      { authorType: "agent", authorId: "user-agent", body: "Please ask the admin to revoke the pending invite and send a new one to the exact email your teammate will use." },
      { authorType: "customer", body: "We retried with a new invite and it still failed." },
      { authorType: "agent", authorId: "user-agent", body: "I am checking whether that email is already tied to another workspace." }
    ]
  },
  {
    id: "conv-1035",
    customerName: "Grace Lee",
    customerEmail: "grace@example.com",
    subject: "Billing query",
    channel: "WEBSITE",
    status: "OPEN",
    priority: "Low",
    assignedToId: "user-admin-2",
    createdAt: "2026-06-09T12:10:00.000Z",
    thread: [
      { authorType: "customer", body: "If we downgrade mid-cycle, do we keep the current plan until renewal?" },
      { authorType: "agent", authorId: "user-admin-2", body: "Yes. Downgrades take effect on the next renewal date unless billing grants an exception." }
    ]
  },
  {
    id: "conv-1036",
    customerName: "Aiden Brooks",
    customerEmail: "aiden@example.com",
    subject: "Waiting for receipt",
    channel: "EMAIL",
    status: "PENDING",
    priority: "Medium",
    assignedToId: "user-agent-2",
    createdAt: "2026-06-09T11:00:00.000Z",
    thread: [
      { authorType: "customer", body: "The plan is wrong after payment and I cannot find the receipt." },
      { authorType: "agent", authorId: "user-agent-2", body: "Please send the receipt number when you have it and I will verify the charge." }
    ]
  },
  {
    id: "conv-1037",
    customerName: "Lucy Shaw",
    customerEmail: "lucy@example.com",
    subject: "Waiting for screenshots",
    channel: "WEBSITE",
    status: "PENDING",
    priority: "Low",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-09T10:25:00.000Z",
    thread: [
      { authorType: "customer", body: "The export screen keeps freezing after I click generate." },
      { authorType: "agent", authorId: "user-agent-3", body: "Could you send a screenshot of the screen state right after the freeze happens?" },
      { authorType: "customer", body: "Yes, I can send that this afternoon." }
    ]
  },
  {
    id: "conv-1038",
    customerName: "Kieran Moss",
    customerEmail: "kieran@example.com",
    subject: "Waiting for confirmation",
    channel: "EMAIL",
    status: "PENDING",
    priority: "Medium",
    assignedToId: "user-agent",
    createdAt: "2026-06-09T09:55:00.000Z",
    thread: [
      { authorType: "customer", body: "Please cancel the extra seat we accidentally added." },
      { authorType: "agent", authorId: "user-agent", body: "I can handle that. Please confirm whether you want the cancellation effective immediately or at renewal." },
      { authorType: "customer", body: "Let me check with finance and get back to you." }
    ]
  },
  {
    id: "conv-1039",
    customerName: "Isla Pope",
    customerEmail: "isla@example.com",
    subject: "Waiting for account details",
    channel: "EMAIL",
    status: "PENDING",
    priority: "High",
    assignedToId: "user-admin",
    createdAt: "2026-06-09T09:20:00.000Z",
    thread: [
      { authorType: "customer", body: "I need access to an old workspace but I do not remember which email was used." },
      { authorType: "agent", authorId: "user-admin", body: "Please send any billing email or company domain tied to the workspace so I can locate the correct account." }
    ]
  },
  {
    id: "conv-1040",
    customerName: "Caleb Stone",
    customerEmail: "caleb@example.com",
    subject: "Pending invoice validation",
    channel: "EMAIL",
    status: "PENDING",
    priority: "Low",
    assignedToId: "user-admin-2",
    createdAt: "2026-06-08T15:05:00.000Z",
    thread: [
      { authorType: "customer", body: "I need a corrected company name on our invoice." },
      { authorType: "agent", authorId: "user-admin-2", body: "Please confirm the exact legal company name that should appear on the invoice." },
      { authorType: "customer", body: "Checking with legal now." }
    ]
  },
  {
    id: "conv-1041",
    customerName: "Tara Walsh",
    customerEmail: "tara@example.com",
    subject: "Pending refund receipt",
    channel: "WEBSITE",
    status: "PENDING",
    priority: "Medium",
    assignedToId: "user-agent-2",
    createdAt: "2026-06-08T14:15:00.000Z",
    thread: [
      { authorType: "customer", body: "We were charged twice this month and need a refund." },
      { authorType: "agent", authorId: "user-agent-2", body: "Please send both receipt numbers so I can confirm the duplicate charge." }
    ]
  },
  {
    id: "conv-1042",
    customerName: "Omar Ali",
    customerEmail: "omar@example.com",
    subject: "Pending security review",
    channel: "EMAIL",
    status: "PENDING",
    priority: "High",
    assignedToId: "user-admin",
    createdAt: "2026-06-08T12:35:00.000Z",
    thread: [
      { authorType: "customer", body: "Please remove 2FA from the owner account because the phone was lost." },
      { authorType: "agent", authorId: "user-admin", body: "For security, I need the billing email and the company name before I can route that request to an admin." },
      { authorType: "customer", body: "I sent that in a separate email from finance." },
      { authorType: "agent", authorId: "user-admin", body: "I have the request and I am waiting for the admin verification reply before processing it." }
    ]
  },
  {
    id: "conv-1043",
    customerName: "Jade Cooper",
    customerEmail: "jade@example.com",
    subject: "Pending export logs",
    channel: "WEBSITE",
    status: "PENDING",
    priority: "Low",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-08T11:40:00.000Z",
    thread: [
      { authorType: "customer", body: "The export completed but the file is empty." },
      { authorType: "agent", authorId: "user-agent-3", body: "Please attach the export ID from the confirmation email so I can inspect the job details." }
    ]
  },
  {
    id: "conv-1044",
    customerName: "Priya Patel",
    customerEmail: "priya@example.com",
    subject: "Upgrade completed",
    channel: "WEBSITE",
    status: "RESOLVED",
    priority: "Medium",
    assignedToId: "user-admin",
    createdAt: "2026-06-10T08:20:00.000Z",
    resolvedAt: "2026-06-10T09:48:00.000Z",
    thread: [
      { authorType: "customer", body: "My upgraded plan was not visible right after payment." },
      { authorType: "agent", authorId: "user-admin", body: "Please sign out and back in, then tell me whether the upgraded plan appears." },
      { authorType: "customer", body: "It now shows correctly after I signed back in." },
      { authorType: "agent", authorId: "user-admin", body: "Great. I have confirmed the plan is active and I am marking this resolved." }
    ]
  },
  {
    id: "conv-1045",
    customerName: "Marco Green",
    customerEmail: "marco@example.com",
    subject: "Refund processed",
    channel: "LIVE_CHAT",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-agent",
    createdAt: "2026-06-10T07:55:00.000Z",
    resolvedAt: "2026-06-10T10:25:00.000Z",
    thread: [
      { authorType: "customer", body: "What is the status of my refund request?" },
      { authorType: "agent", authorId: "user-agent", body: "I checked billing and the refund is still in review. I will update you as soon as it posts." },
      { authorType: "customer", body: "Thanks, I just need to know whether it was approved." },
      { authorType: "agent", authorId: "user-agent", body: "Billing has now confirmed the refund was approved and processed today." }
    ]
  },
  {
    id: "conv-1046",
    customerName: "Hannah Cole",
    customerEmail: "hannah@example.com",
    subject: "Password reset completed",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-10T07:25:00.000Z",
    resolvedAt: "2026-06-10T08:18:00.000Z",
    thread: [
      { authorType: "customer", body: "I was locked out because the reset email never arrived." },
      { authorType: "agent", authorId: "user-agent-3", body: "Please check spam and tell me whether the account uses this email address." },
      { authorType: "customer", body: "Found it in quarantine, thanks." },
      { authorType: "agent", authorId: "user-agent-3", body: "Perfect. I am marking this resolved." }
    ]
  },
  {
    id: "conv-1047",
    customerName: "Vikram Das",
    customerEmail: "vikram@example.com",
    subject: "Invoice supplied",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-admin-2",
    createdAt: "2026-06-10T06:45:00.000Z",
    resolvedAt: "2026-06-10T07:42:00.000Z",
    thread: [
      { authorType: "customer", body: "Can you send our invoice for April?" },
      { authorType: "agent", authorId: "user-admin-2", body: "Please confirm the billing email and invoice number so I can attach the correct copy." },
      { authorType: "customer", body: "Confirmed." },
      { authorType: "agent", authorId: "user-admin-2", body: "I have sent the invoice copy to your billing email." }
    ]
  },
  {
    id: "conv-1048",
    customerName: "Emily Stone",
    customerEmail: "emily@example.com",
    subject: "Team invite fixed",
    channel: "WEBSITE",
    status: "RESOLVED",
    priority: "Medium",
    assignedToId: "user-agent",
    createdAt: "2026-06-10T05:55:00.000Z",
    resolvedAt: "2026-06-10T07:05:00.000Z",
    thread: [
      { authorType: "customer", body: "My teammate keeps getting an expired-invite message." },
      { authorType: "agent", authorId: "user-agent", body: "Please ask your admin to revoke the old invite and send a new one to the exact address your teammate will use." },
      { authorType: "customer", body: "That worked, they can log in now." },
      { authorType: "agent", authorId: "user-agent", body: "Excellent. I am marking this resolved." }
    ]
  },
  {
    id: "conv-1049",
    customerName: "Chris Noble",
    customerEmail: "chris@example.com",
    subject: "Billing question answered",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-admin",
    createdAt: "2026-06-10T05:20:00.000Z",
    resolvedAt: "2026-06-10T06:10:00.000Z",
    thread: [
      { authorType: "customer", body: "Do downgrades apply immediately?" },
      { authorType: "agent", authorId: "user-admin", body: "Downgrades normally apply on the next renewal date, so your current plan stays active until then." },
      { authorType: "customer", body: "That answers it, thanks." },
      { authorType: "agent", authorId: "user-admin", body: "You’re welcome. Marking this resolved." }
    ]
  },
  {
    id: "conv-1050",
    customerName: "Megan Fox",
    customerEmail: "megan@example.com",
    subject: "Export delivered",
    channel: "WEBSITE",
    status: "RESOLVED",
    priority: "Medium",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-10T04:35:00.000Z",
    resolvedAt: "2026-06-10T05:42:00.000Z",
    thread: [
      { authorType: "customer", body: "My export took a long time and I wanted to know whether it failed." },
      { authorType: "agent", authorId: "user-agent-3", body: "I checked the job queue. The export is still processing and I will confirm when it finishes." },
      { authorType: "customer", body: "Thanks, I can wait a bit longer." },
      { authorType: "agent", authorId: "user-agent-3", body: "The export finished successfully and the download link is now ready." }
    ]
  },
  {
    id: "conv-1051",
    customerName: "Anya Reed",
    customerEmail: "anya@example.com",
    subject: "Mobile sync restored",
    channel: "LIVE_CHAT",
    status: "RESOLVED",
    priority: "Medium",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-09T18:40:00.000Z",
    resolvedAt: "2026-06-09T19:55:00.000Z",
    thread: [
      { authorType: "customer", body: "The mobile inbox is not refreshing." },
      { authorType: "agent", authorId: "user-agent-3", body: "Please refresh manually, sign out and back in, and tell me whether the app still looks stale." },
      { authorType: "customer", body: "That fixed it." },
      { authorType: "agent", authorId: "user-agent-3", body: "Great. I am marking this resolved." }
    ]
  },
  {
    id: "conv-1052",
    customerName: "Paul Quinn",
    customerEmail: "paul@example.com",
    subject: "Duplicate charge confirmed",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "High",
    assignedToId: "user-agent-2",
    createdAt: "2026-06-09T17:05:00.000Z",
    resolvedAt: "2026-06-09T18:42:00.000Z",
    thread: [
      { authorType: "customer", body: "We were charged twice for the same renewal." },
      { authorType: "agent", authorId: "user-agent-2", body: "Please send both receipt numbers so I can confirm the duplicate charge." },
      { authorType: "customer", body: "Sent." },
      { authorType: "agent", authorId: "user-agent-2", body: "Thanks. Billing confirmed the duplicate and processed the reversal." }
    ]
  },
  {
    id: "conv-1053",
    customerName: "Rosa Diaz",
    customerEmail: "rosa@example.com",
    subject: "Workspace unlocked",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "High",
    assignedToId: "user-admin",
    createdAt: "2026-06-09T15:00:00.000Z",
    resolvedAt: "2026-06-09T16:08:00.000Z",
    thread: [
      { authorType: "customer", body: "Our owner account is locked after repeated logins." },
      { authorType: "agent", authorId: "user-admin", body: "Please confirm the billing email on the workspace so I can verify ownership." },
      { authorType: "customer", body: "Confirmed." },
      { authorType: "agent", authorId: "user-admin", body: "Ownership checks passed and the account has been unlocked." }
    ]
  },
  {
    id: "conv-1054",
    customerName: "Tom Hall",
    customerEmail: "tom@example.com",
    subject: "Receipt found",
    channel: "WEBSITE",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-agent-2",
    createdAt: "2026-06-09T13:50:00.000Z",
    resolvedAt: "2026-06-09T14:36:00.000Z",
    thread: [
      { authorType: "customer", body: "I thought my upgrade failed because I could not find the receipt." },
      { authorType: "agent", authorId: "user-agent-2", body: "Please look for the payment email and share the receipt number when you find it." },
      { authorType: "customer", body: "Found it. The plan is active now." },
      { authorType: "agent", authorId: "user-agent-2", body: "Perfect. I am closing this out." }
    ]
  },
  {
    id: "conv-1055",
    customerName: "Lena Murphy",
    customerEmail: "lena@example.com",
    subject: "Webhook reconnect guidance",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-agent-3",
    createdAt: "2026-06-09T12:30:00.000Z",
    resolvedAt: "2026-06-09T13:55:00.000Z",
    thread: [
      { authorType: "customer", body: "Our Slack integration stopped posting updates." },
      { authorType: "agent", authorId: "user-agent-3", body: "Please reconnect the integration from workspace settings and confirm the installer still has Slack permissions." },
      { authorType: "customer", body: "Reconnect worked." },
      { authorType: "agent", authorId: "user-agent-3", body: "Great. Marking this resolved." }
    ]
  },
  {
    id: "conv-1056",
    customerName: "Ivan Petrov",
    customerEmail: "ivan@example.com",
    subject: "Seat reduction clarified",
    channel: "WEBSITE",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-admin-2",
    createdAt: "2026-06-09T11:05:00.000Z",
    resolvedAt: "2026-06-09T12:02:00.000Z",
    thread: [
      { authorType: "customer", body: "Can I remove seats immediately?" },
      { authorType: "agent", authorId: "user-admin-2", body: "Seat reductions take effect at renewal unless billing approves an exception." },
      { authorType: "customer", body: "Understood." },
      { authorType: "agent", authorId: "user-admin-2", body: "Happy to help. Closing this thread." }
    ]
  },
  {
    id: "conv-1057",
    customerName: "Mila Torres",
    customerEmail: "mila@example.com",
    subject: "Invite email delivered",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "Low",
    assignedToId: "user-admin",
    createdAt: "2026-06-08T16:40:00.000Z",
    resolvedAt: "2026-06-08T18:12:00.000Z",
    thread: [
      { authorType: "customer", body: "Our teammate never received the invite email." },
      { authorType: "agent", authorId: "user-admin", body: "Please allow our sender address and resend the invite once your filter has been updated." },
      { authorType: "customer", body: "That worked." },
      { authorType: "agent", authorId: "user-admin", body: "Excellent. Marking resolved." }
    ]
  },
  {
    id: "conv-1058",
    customerName: "Ethan Young",
    customerEmail: "ethan@example.com",
    subject: "Ownership verified",
    channel: "EMAIL",
    status: "RESOLVED",
    priority: "Medium",
    assignedToId: "user-admin",
    createdAt: "2026-06-08T14:45:00.000Z",
    resolvedAt: "2026-06-08T15:52:00.000Z",
    thread: [
      { authorType: "customer", body: "Can you change the workspace owner email?" },
      { authorType: "agent", authorId: "user-admin", body: "Please have the billing contact reply from their email so we can approve the ownership change." },
      { authorType: "customer", body: "They replied." },
      { authorType: "agent", authorId: "user-admin", body: "Thanks. Ownership verification is complete and the request has been processed." }
    ]
  }
];

function addMinutes(value: string, minutes: number) {
  return new Date(new Date(value).getTime() + minutes * 60_000).toISOString();
}

function buildConversationsAndMessages() {
  const conversations: Conversation[] = [];
  const messages: Message[] = [];
  const notes = [];

  for (const config of conversationConfigs) {
    const createdAt = config.createdAt;
    const messageTimes = config.thread.map((_, index) => {
      if (index === 0) return createdAt;
      if (index === 1) return addMinutes(createdAt, 14);
      return addMinutes(createdAt, 14 + (index - 1) * 11);
    });

    const latestAgentMessage = [...config.thread].reverse().find((item) => item.authorType === "agent");
    const updatedAt = config.resolvedAt ?? messageTimes.at(-1) ?? createdAt;

    conversations.push({
      id: config.id,
      organisationId,
      customerName: config.customerName,
      customerEmail: config.customerEmail,
      subject: config.subject,
      channel: config.channel,
      status: config.status,
      priority: config.priority,
      assignedToId: config.assignedToId,
      latestDraft: latestAgentMessage?.body,
      createdAt,
      updatedAt,
      resolvedAt: config.resolvedAt
    });

    config.thread.forEach((entry, index) => {
      messages.push({
        id: `msg-${config.id}-${index + 1}`,
        conversationId: config.id,
        authorType: entry.authorType,
        authorId: entry.authorId,
        body: entry.body,
        createdAt: messageTimes[index]
      });
    });

    if (config.note) {
      notes.push({
        id: `note-${config.id}`,
        conversationId: config.id,
        authorId: config.note.authorId,
        body: config.note.body,
        createdAt: addMinutes(createdAt, config.note.createdAtOffsetMinutes)
      });
    }
  }

  return { conversations, messages, notes };
}

const { conversations: seedConversations, messages: seedMessages, notes: seedNotes } =
  buildConversationsAndMessages();

export { seedConversations, seedMessages, seedNotes };

const aiOutcomePlan = [
  ...Array.from({ length: 39 }, () => "accepted_unchanged" as const),
  ...Array.from({ length: 9 }, () => "edited_and_used" as const),
  ...Array.from({ length: 2 }, () => "rejected" as const)
];

const trendBucketCounts = [1, 2, 3, 4, 5, 7, 9, 11];
const recentAiDates = trendBucketCounts.flatMap((count, bucketIndex) =>
  Array.from({ length: count }, (_, index) =>
    new Date(Date.UTC(2026, 5, 1 + bucketIndex, 9 + (index % 5), (index * 7) % 60, 0)).toISOString()
  )
);
const historicalAiDates = Array.from({ length: 8 }, (_, index) =>
  new Date(Date.UTC(2026, 3, 3 + index * 2, 10, 15, 0)).toISOString()
);
const aiDates = [...recentAiDates, ...historicalAiDates];

export const seedAiGenerations: AiReplyGeneration[] = aiOutcomePlan.map((outcome, index) => {
  const conversation = seedConversations[index % seedConversations.length];
  const articleA = seedArticles[index % seedArticles.length];
  const articleB = seedArticles[(index + 3) % seedArticles.length];
  const cannedResponse = seedCannedResponses[index % seedCannedResponses.length];
  const createdAt = aiDates[index];
  const isRejected = outcome === "rejected";

  return {
    id: `ai-${index + 1}`,
    organisationId,
    conversationId: conversation.id,
    draft: `${cannedResponse.body}${isRejected ? " I need a bit more detail before sending this." : ""}`,
    confidenceLabel: index % 6 === 0 ? "Medium" : "High",
    sourceArticleIds: [articleA.id, articleB.id],
    sourceSnippetTitles: [articleA.title, articleB.title],
    outcome,
    tokenEstimate: 280 + (index % 6) * 35,
    estimatedCostUsd: Number((0.006 + (index % 5) * 0.0018).toFixed(4)),
    warning: isRejected ? "Customer identity needs confirmation." : undefined,
    createdAt,
    updatedAt: createdAt
  };
});

export const seedUsageEvents: UsageEvent[] = [
  ...seedAiGenerations.map((generation, index) => ({
    id: `usage-ai-${index + 1}`,
    organisationId,
    type: "AI_GENERATION" as const,
    referenceId: generation.conversationId,
    tokenEstimate: generation.tokenEstimate,
    estimatedCostUsd: generation.estimatedCostUsd,
    metadata: { outcome: generation.outcome, warning: generation.warning ?? null },
    createdAt: generation.createdAt
  })),
  ...seedCannedResponses.map((response, index) => ({
    id: `usage-can-${index + 1}`,
    organisationId,
    type: "CANNED_RESPONSE_INSERTED" as const,
    referenceId: response.id,
    metadata: { title: response.title },
    createdAt: new Date(Date.UTC(2026, 5, 2 + (index % 7), 12, 0, 0)).toISOString()
  })),
  ...seedConversations
    .filter((conversation) => conversation.resolvedAt)
    .map((conversation, index) => ({
      id: `usage-res-${index + 1}`,
      organisationId,
      type: "CONVERSATION_RESOLVED" as const,
      referenceId: conversation.id,
      metadata: { status: conversation.status },
      createdAt: conversation.resolvedAt as string
    }))
];

export function buildDemoState(): AppState {
  return {
    organisations: [seedOrganisation],
    users: seedUsers,
    memberships: seedMemberships,
    conversations: seedConversations,
    messages: seedMessages,
    notes: seedNotes,
    articles: seedArticles,
    cannedResponses: seedCannedResponses,
    settings: [seedSettings],
    aiGenerations: seedAiGenerations,
    usageEvents: seedUsageEvents
  };
}

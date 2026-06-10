export type MemberRole = "ADMIN" | "SUPPORT_AGENT" | "VIEWER";
export type ConversationStatus = "OPEN" | "PENDING" | "RESOLVED" | "ESCALATED";
export type SupportChannel = "EMAIL" | "WEBSITE" | "LIVE_CHAT" | "FACEBOOK" | "X";
export type ArticleState = "ACTIVE" | "INACTIVE";
export type AiApprovalOutcome =
  | "generated"
  | "accepted_unchanged"
  | "edited_and_used"
  | "rejected";
export type SupportTone = "FRIENDLY" | "PROFESSIONAL" | "CONCISE";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Organisation {
  id: string;
  name: string;
}

export interface OrganisationMember {
  id: string;
  organisationId: string;
  userId: string;
  role: MemberRole;
  active: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  authorType: "customer" | "agent";
  authorId?: string;
  body: string;
  createdAt: string;
}

export interface InternalNote {
  id: string;
  conversationId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  organisationId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  channel: SupportChannel;
  status: ConversationStatus;
  priority: "Low" | "Medium" | "High";
  assignedToId?: string;
  latestDraft?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  organisationId: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  state: ArticleState;
  createdAt: string;
  updatedAt: string;
}

export interface CannedResponse {
  id: string;
  organisationId: string;
  title: string;
  category: string;
  body: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrganisationSettings {
  id: string;
  organisationId: string;
  companyName: string;
  supportTone: SupportTone;
  defaultAiModel: string;
  monthlyAiUsageLimit: number;
  businessHours: string;
  escalationMessage: string;
}

export interface AiReplyGeneration {
  id: string;
  organisationId: string;
  conversationId: string;
  draft: string;
  confidenceLabel: "High" | "Medium" | "Low";
  sourceArticleIds: string[];
  sourceSnippetTitles: string[];
  outcome: AiApprovalOutcome;
  warning?: string;
  tokenEstimate?: number;
  estimatedCostUsd?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsageEvent {
  id: string;
  organisationId: string;
  type: "AI_GENERATION" | "CANNED_RESPONSE_INSERTED" | "CONVERSATION_RESOLVED";
  referenceId?: string;
  tokenEstimate?: number;
  estimatedCostUsd?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AppState {
  organisations: Organisation[];
  users: User[];
  memberships: OrganisationMember[];
  conversations: Conversation[];
  messages: Message[];
  notes: InternalNote[];
  articles: KnowledgeBaseArticle[];
  cannedResponses: CannedResponse[];
  settings: OrganisationSettings[];
  aiGenerations: AiReplyGeneration[];
  usageEvents: UsageEvent[];
}

export interface AuthSession {
  userId: string;
  organisationId: string;
}

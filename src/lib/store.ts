import bcrypt from "bcryptjs";
import {
  AiApprovalOutcome as PrismaAiApprovalOutcome,
  Prisma,
  type OrganisationSettings as PrismaOrganisationSettings
} from "@prisma/client";

import { demoState } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import { createId } from "@/lib/utils";
import type {
  AiApprovalOutcome,
  AiReplyGeneration,
  AppState,
  CannedResponse,
  Conversation,
  ConversationStatus,
  InternalNote,
  KnowledgeBaseArticle,
  MemberRole,
  Message,
  Organisation,
  OrganisationMember,
  OrganisationSettings,
  UsageEvent,
  User,
  WorkspaceUser
} from "@/lib/types";

function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

let state: AppState = cloneState(demoState);

function useDemoStore() {
  return !process.env.DATABASE_URL;
}

function mapUser(
  user: {
    id: string;
    name: string;
    email: string;
    passwordHash?: string;
  },
  password = ""
): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: password || user.passwordHash || ""
  };
}

function mapOrganisation(organisation: { id: string; name: string }): Organisation {
  return {
    id: organisation.id,
    name: organisation.name
  };
}

function mapMembership(membership: {
  id: string;
  organisationId: string;
  userId: string;
  role: string;
  active: boolean;
}): OrganisationMember {
  return {
    id: membership.id,
    organisationId: membership.organisationId,
    userId: membership.userId,
    role: membership.role as MemberRole,
    active: membership.active
  };
}

function mapConversation(conversation: {
  id: string;
  organisationId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  channel: string;
  status: string;
  priority: string;
  assignedToId: string | null;
  latestDraft: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
}): Conversation {
  return {
    id: conversation.id,
    organisationId: conversation.organisationId,
    customerName: conversation.customerName,
    customerEmail: conversation.customerEmail,
    subject: conversation.subject,
    channel: conversation.channel as Conversation["channel"],
    status: conversation.status as ConversationStatus,
    priority: conversation.priority as Conversation["priority"],
    assignedToId: conversation.assignedToId ?? undefined,
    latestDraft: conversation.latestDraft ?? undefined,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    resolvedAt: conversation.resolvedAt?.toISOString()
  };
}

function mapMessage(message: {
  id: string;
  conversationId: string;
  authorId: string | null;
  authorType: string;
  body: string;
  createdAt: Date;
}): Message {
  return {
    id: message.id,
    conversationId: message.conversationId,
    authorId: message.authorId ?? undefined,
    authorType: message.authorType as Message["authorType"],
    body: message.body,
    createdAt: message.createdAt.toISOString()
  };
}

function mapInternalNote(note: {
  id: string;
  conversationId: string;
  authorId: string;
  body: string;
  createdAt: Date;
}): InternalNote {
  return {
    id: note.id,
    conversationId: note.conversationId,
    authorId: note.authorId,
    body: note.body,
    createdAt: note.createdAt.toISOString()
  };
}

function mapArticle(article: {
  id: string;
  organisationId: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}): KnowledgeBaseArticle {
  return {
    id: article.id,
    organisationId: article.organisationId,
    title: article.title,
    category: article.category,
    summary: article.summary,
    body: article.body,
    state: article.state as KnowledgeBaseArticle["state"],
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString()
  };
}

function mapCannedResponse(response: {
  id: string;
  organisationId: string;
  title: string;
  category: string;
  body: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}): CannedResponse {
  return {
    id: response.id,
    organisationId: response.organisationId,
    title: response.title,
    category: response.category,
    body: response.body,
    usageCount: response.usageCount,
    createdAt: response.createdAt.toISOString(),
    updatedAt: response.updatedAt.toISOString()
  };
}

function mapSettings(settings: PrismaOrganisationSettings): OrganisationSettings {
  return {
    id: settings.id,
    organisationId: settings.organisationId,
    companyName: settings.companyName,
    supportTone: settings.supportTone,
    defaultAiModel: settings.defaultAiModel,
    monthlyAiUsageLimit: settings.monthlyAiUsageLimit,
    businessHours: settings.businessHours,
    escalationMessage: settings.escalationMessage
  };
}

function fromPrismaOutcome(outcome: PrismaAiApprovalOutcome): AiApprovalOutcome {
  switch (outcome) {
    case "ACCEPTED_UNCHANGED":
      return "accepted_unchanged";
    case "EDITED_AND_USED":
      return "edited_and_used";
    case "REJECTED":
      return "rejected";
    default:
      return "generated";
  }
}

function toPrismaOutcome(outcome: AiApprovalOutcome): PrismaAiApprovalOutcome {
  switch (outcome) {
    case "accepted_unchanged":
      return "ACCEPTED_UNCHANGED";
    case "edited_and_used":
      return "EDITED_AND_USED";
    case "rejected":
      return "REJECTED";
    default:
      return "GENERATED";
  }
}

function mapGeneration(generation: {
  id: string;
  organisationId: string;
  conversationId: string;
  draft: string;
  confidenceLabel: string;
  sourceArticleIds: string[];
  sourceSnippetTitles: string[];
  outcome: PrismaAiApprovalOutcome;
  warning: string | null;
  tokenEstimate: number | null;
  estimatedCostUsd: number | null;
  createdAt: Date;
  updatedAt: Date;
}): AiReplyGeneration {
  return {
    id: generation.id,
    organisationId: generation.organisationId,
    conversationId: generation.conversationId,
    draft: generation.draft,
    confidenceLabel: generation.confidenceLabel as AiReplyGeneration["confidenceLabel"],
    sourceArticleIds: generation.sourceArticleIds,
    sourceSnippetTitles: generation.sourceSnippetTitles,
    outcome: fromPrismaOutcome(generation.outcome),
    warning: generation.warning ?? undefined,
    tokenEstimate: generation.tokenEstimate ?? undefined,
    estimatedCostUsd: generation.estimatedCostUsd ?? undefined,
    createdAt: generation.createdAt.toISOString(),
    updatedAt: generation.updatedAt.toISOString()
  };
}

function mapUsageEvent(event: {
  id: string;
  organisationId: string;
  type: string;
  referenceId: string | null;
  tokenEstimate: number | null;
  estimatedCostUsd: number | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
}): UsageEvent {
  return {
    id: event.id,
    organisationId: event.organisationId,
    type: event.type as UsageEvent["type"],
    referenceId: event.referenceId ?? undefined,
    tokenEstimate: event.tokenEstimate ?? undefined,
    estimatedCostUsd: event.estimatedCostUsd ?? undefined,
    metadata: (event.metadata as Record<string, unknown> | null) ?? undefined,
    createdAt: event.createdAt.toISOString()
  };
}

export function resetStore() {
  state = cloneState(demoState);
}

export function getState() {
  return state;
}

export function isDemoStoreEnabled() {
  return useDemoStore();
}

export async function getOrganisation(organisationId: string): Promise<Organisation> {
  if (useDemoStore()) {
    const organisation = state.organisations.find((item) => item.id === organisationId);
    if (!organisation) {
      throw new Error("Organisation not found.");
    }
    return organisation;
  }

  const organisation = await prisma.organisation.findUnique({
    where: { id: organisationId }
  });
  if (!organisation) {
    throw new Error("Organisation not found.");
  }
  return mapOrganisation(organisation);
}

export async function getMembership(
  userId: string,
  organisationId: string
): Promise<OrganisationMember | undefined> {
  if (useDemoStore()) {
    return state.memberships.find(
      (item) => item.userId === userId && item.organisationId === organisationId && item.active
    );
  }

  const membership = await prisma.organisationMember.findFirst({
    where: {
      userId,
      organisationId,
      active: true
    }
  });
  return membership ? mapMembership(membership) : undefined;
}

export async function getPrimaryMembership(userId: string): Promise<OrganisationMember | undefined> {
  if (useDemoStore()) {
    return state.memberships.find((item) => item.userId === userId && item.active);
  }

  const membership = await prisma.organisationMember.findFirst({
    where: {
      userId,
      active: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return membership ? mapMembership(membership) : undefined;
}

export async function getRole(userId: string, organisationId: string): Promise<MemberRole | undefined> {
  return (await getMembership(userId, organisationId))?.role;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  if (useDemoStore()) {
    return state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase()
    }
  });
  return user ? mapUser(user) : undefined;
}

export async function getUser(userId: string): Promise<User | undefined> {
  if (useDemoStore()) {
    return state.users.find((user) => user.id === userId);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  return user ? mapUser(user) : undefined;
}

export async function registerWorkspaceAdmin(input: {
  name: string;
  email: string;
  password: string;
  organisationName: string;
}) {
  const existing = await getUserByEmail(input.email);
  if (existing) {
    throw new Error("An account with that email already exists.");
  }

  if (useDemoStore()) {
    const user: User = {
      id: createId("user"),
      name: input.name,
      email: input.email,
      password: input.password
    };
    const organisation: Organisation = {
      id: createId("org"),
      name: input.organisationName
    };
    const membership: OrganisationMember = {
      id: createId("member"),
      organisationId: organisation.id,
      userId: user.id,
      role: "ADMIN",
      active: true
    };
    const settings: OrganisationSettings = {
      id: createId("settings"),
      organisationId: organisation.id,
      companyName: input.organisationName,
      supportTone: "PROFESSIONAL",
      defaultAiModel: "gpt-4.1-mini",
      monthlyAiUsageLimit: 100,
      businessHours: "Mon-Fri, 09:00-17:00 GMT",
      escalationMessage:
        "If we need more time to investigate, we will escalate this to a specialist and reply within one business day."
    };

    state.users.push(user);
    state.organisations.push(organisation);
    state.memberships.push(membership);
    state.settings.push(settings);

    return { user, organisation };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const organisation = await prisma.organisation.create({
    data: {
      name: input.organisationName,
      settings: {
        create: {
          companyName: input.organisationName,
          supportTone: "PROFESSIONAL",
          defaultAiModel: "gpt-4.1-mini",
          monthlyAiUsageLimit: 100,
          businessHours: "Mon-Fri, 09:00-17:00 GMT",
          escalationMessage:
            "If we need more time to investigate, we will escalate this to a specialist and reply within one business day."
        }
      }
    }
  });
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      memberships: {
        create: {
          organisationId: organisation.id,
          role: "ADMIN",
          active: true
        }
      }
    }
  });

  return {
    user: mapUser(user),
    organisation: mapOrganisation(organisation)
  };
}

export async function getWorkspaceUsers(organisationId: string): Promise<WorkspaceUser[]> {
  if (useDemoStore()) {
    return state.memberships
      .filter((membership) => membership.organisationId === organisationId && membership.active)
      .map((membership) => ({
        membershipId: membership.id,
        ...state.users.find((user) => user.id === membership.userId)!,
        role: membership.role,
        active: membership.active
      }));
  }

  const memberships = await prisma.organisationMember.findMany({
    where: {
      organisationId,
      active: true
    },
    include: {
      user: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return memberships.map((membership) => ({
    membershipId: membership.id,
    ...mapUser(membership.user),
    role: membership.role as MemberRole,
    active: membership.active
  }));
}

async function getWorkspaceAdminCount(organisationId: string) {
  const members = await getWorkspaceUsers(organisationId);
  return members.filter((member) => member.role === "ADMIN" && member.active).length;
}

export async function createWorkspaceUser(
  organisationId: string,
  input: { name: string; email: string; password: string; role: MemberRole }
) {
  const normalizedEmail = input.email.toLowerCase();
  const existingUser = await getUserByEmail(normalizedEmail);

  if (useDemoStore()) {
    if (existingUser) {
      const existingMembership = state.memberships.find(
        (membership) =>
          membership.organisationId === organisationId && membership.userId === existingUser.id
      );
      if (existingMembership?.active) {
        throw new Error("That user already has access to this workspace.");
      }
      if (existingMembership) {
        existingMembership.role = input.role;
        existingMembership.active = true;
        return {
          membershipId: existingMembership.id,
          ...existingUser,
          role: existingMembership.role,
          active: existingMembership.active
        };
      }
    }

    const user = existingUser ?? {
      id: createId("user"),
      name: input.name,
      email: normalizedEmail,
      password: input.password
    };

    if (!existingUser) {
      state.users.push(user);
    }

    const membership: OrganisationMember = {
      id: createId("member"),
      organisationId,
      userId: user.id,
      role: input.role,
      active: true
    };
    state.memberships.push(membership);
    return { membershipId: membership.id, ...user, role: membership.role, active: membership.active };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const member = await prisma.$transaction(async (tx) => {
    const user =
      existingUser
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: { name: input.name }
          })
        : await tx.user.create({
            data: {
              name: input.name,
              email: normalizedEmail,
              passwordHash
            }
          });

    const existingMembership = await tx.organisationMember.findFirst({
      where: {
        organisationId,
        userId: user.id
      }
    });

    if (existingMembership?.active) {
      throw new Error("That user already has access to this workspace.");
    }

    const membership = existingMembership
      ? await tx.organisationMember.update({
          where: { id: existingMembership.id },
          data: {
            role: input.role,
            active: true
          }
        })
      : await tx.organisationMember.create({
          data: {
            organisationId,
            userId: user.id,
            role: input.role,
            active: true
          }
        });

    return { user, membership };
  });

  return {
    membershipId: member.membership.id,
    ...mapUser(member.user),
    role: member.membership.role as MemberRole,
    active: member.membership.active
  };
}

export async function updateWorkspaceUserRole(
  organisationId: string,
  membershipId: string,
  role: MemberRole
) {
  const members = await getWorkspaceUsers(organisationId);
  const existingMember = members.find((member) => member.membershipId === membershipId);
  if (!existingMember) {
    throw new Error("User access record not found.");
  }
  if (existingMember.role === "ADMIN" && role !== "ADMIN") {
    const adminCount = await getWorkspaceAdminCount(organisationId);
    if (adminCount <= 1) {
      throw new Error("At least one admin must remain in the workspace.");
    }
  }

  if (useDemoStore()) {
    const membership = state.memberships.find((item) => item.id === membershipId);
    if (!membership) {
      throw new Error("User access record not found.");
    }
    membership.role = role;
    return membership;
  }

  return prisma.organisationMember.update({
    where: { id: membershipId },
    data: { role }
  });
}

export async function removeWorkspaceUser(organisationId: string, membershipId: string) {
  const members = await getWorkspaceUsers(organisationId);
  const existingMember = members.find((member) => member.membershipId === membershipId);
  if (!existingMember) {
    throw new Error("User access record not found.");
  }
  if (existingMember.role === "ADMIN") {
    const adminCount = await getWorkspaceAdminCount(organisationId);
    if (adminCount <= 1) {
      throw new Error("At least one admin must remain in the workspace.");
    }
  }

  if (useDemoStore()) {
    const membership = state.memberships.find((item) => item.id === membershipId);
    if (!membership) {
      throw new Error("User access record not found.");
    }
    membership.active = false;
    return membership;
  }

  return prisma.organisationMember.update({
    where: { id: membershipId },
    data: { active: false }
  });
}

export async function getWorkspaceSettings(organisationId: string): Promise<OrganisationSettings> {
  if (useDemoStore()) {
    const settings = state.settings.find((item) => item.organisationId === organisationId);
    if (!settings) {
      throw new Error("Settings not found.");
    }
    return settings;
  }

  const settings = await prisma.organisationSettings.findUnique({
    where: {
      organisationId
    }
  });
  if (!settings) {
    throw new Error("Settings not found.");
  }
  return mapSettings(settings);
}

export async function updateWorkspaceSettings(
  organisationId: string,
  patch: Partial<OrganisationSettings>
) {
  if (useDemoStore()) {
    const settings = await getWorkspaceSettings(organisationId);
    Object.assign(settings, patch);
    return settings;
  }

  const settings = await prisma.organisationSettings.update({
    where: {
      organisationId
    },
    data: {
      companyName: patch.companyName,
      supportTone: patch.supportTone,
      defaultAiModel: patch.defaultAiModel,
      monthlyAiUsageLimit: patch.monthlyAiUsageLimit,
      businessHours: patch.businessHours,
      escalationMessage: patch.escalationMessage
    }
  });
  return mapSettings(settings);
}

export async function getWorkspaceArticles(organisationId: string) {
  if (useDemoStore()) {
    return state.articles.filter((article) => article.organisationId === organisationId);
  }

  const articles = await prisma.knowledgeBaseArticle.findMany({
    where: { organisationId },
    orderBy: {
      updatedAt: "desc"
    }
  });
  return articles.map(mapArticle);
}

export async function createArticle(
  organisationId: string,
  input: Pick<KnowledgeBaseArticle, "title" | "category" | "summary" | "body" | "state">
) {
  if (useDemoStore()) {
    const article: KnowledgeBaseArticle = {
      id: createId("kb"),
      organisationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input
    };
    state.articles.unshift(article);
    return article;
  }

  const article = await prisma.knowledgeBaseArticle.create({
    data: {
      organisationId,
      title: input.title,
      category: input.category,
      summary: input.summary,
      body: input.body,
      state: input.state
    }
  });
  return mapArticle(article);
}

export async function updateArticle(id: string, patch: Partial<KnowledgeBaseArticle>) {
  if (useDemoStore()) {
    const article = state.articles.find((item) => item.id === id);
    if (!article) {
      throw new Error("Article not found.");
    }
    Object.assign(article, patch, { updatedAt: new Date().toISOString() });
    return article;
  }

  const article = await prisma.knowledgeBaseArticle.update({
    where: { id },
    data: {
      title: patch.title,
      category: patch.category,
      summary: patch.summary,
      body: patch.body,
      state: patch.state
    }
  });
  return mapArticle(article);
}

export async function deleteArticle(id: string) {
  if (useDemoStore()) {
    state.articles = state.articles.filter((item) => item.id !== id);
    return;
  }

  await prisma.knowledgeBaseArticle.delete({
    where: { id }
  });
}

export async function getWorkspaceCannedResponses(organisationId: string) {
  if (useDemoStore()) {
    return state.cannedResponses.filter((item) => item.organisationId === organisationId);
  }

  const responses = await prisma.cannedResponse.findMany({
    where: { organisationId },
    orderBy: {
      updatedAt: "desc"
    }
  });
  return responses.map(mapCannedResponse);
}

export async function getCannedResponse(id: string) {
  if (useDemoStore()) {
    return state.cannedResponses.find((item) => item.id === id);
  }

  const response = await prisma.cannedResponse.findUnique({
    where: { id }
  });
  return response ? mapCannedResponse(response) : undefined;
}

export async function createCannedResponse(
  organisationId: string,
  input: Pick<CannedResponse, "title" | "category" | "body">
) {
  if (useDemoStore()) {
    const response: CannedResponse = {
      id: createId("can"),
      organisationId,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input
    };
    state.cannedResponses.unshift(response);
    return response;
  }

  const response = await prisma.cannedResponse.create({
    data: {
      organisationId,
      title: input.title,
      category: input.category,
      body: input.body
    }
  });
  return mapCannedResponse(response);
}

export async function updateCannedResponse(id: string, patch: Partial<CannedResponse>) {
  if (useDemoStore()) {
    const response = state.cannedResponses.find((item) => item.id === id);
    if (!response) {
      throw new Error("Canned response not found.");
    }
    Object.assign(response, patch, { updatedAt: new Date().toISOString() });
    return response;
  }

  const response = await prisma.cannedResponse.update({
    where: { id },
    data: {
      title: patch.title,
      category: patch.category,
      body: patch.body
    }
  });
  return mapCannedResponse(response);
}

export async function deleteCannedResponse(id: string) {
  if (useDemoStore()) {
    state.cannedResponses = state.cannedResponses.filter((item) => item.id !== id);
    return;
  }

  await prisma.cannedResponse.delete({
    where: { id }
  });
}

export async function getWorkspaceConversations(organisationId: string) {
  if (useDemoStore()) {
    return state.conversations.filter((conversation) => conversation.organisationId === organisationId);
  }

  const conversations = await prisma.conversation.findMany({
    where: { organisationId },
    orderBy: {
      updatedAt: "desc"
    }
  });
  return conversations.map(mapConversation);
}

export async function getConversation(organisationId: string, conversationId: string) {
  if (useDemoStore()) {
    const conversation = state.conversations.find(
      (item) => item.id === conversationId && item.organisationId === organisationId
    );
    if (!conversation) {
      throw new Error("Conversation not found.");
    }
    return conversation;
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      organisationId
    }
  });
  if (!conversation) {
    throw new Error("Conversation not found.");
  }
  return mapConversation(conversation);
}

export async function updateConversation(id: string, patch: Partial<Conversation>) {
  if (useDemoStore()) {
    const conversation = state.conversations.find((item) => item.id === id);
    if (!conversation) {
      throw new Error("Conversation not found.");
    }
    Object.assign(conversation, patch, { updatedAt: new Date().toISOString() });
    return conversation;
  }

  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      subject: patch.subject,
      status: patch.status,
      assignedToId: patch.assignedToId,
      latestDraft: patch.latestDraft,
      resolvedAt: patch.resolvedAt ? new Date(patch.resolvedAt) : patch.resolvedAt === undefined ? undefined : null
    }
  });
  return mapConversation(conversation);
}

export async function getConversationMessages(conversationId: string) {
  if (useDemoStore()) {
    return state.messages.filter((message) => message.conversationId === conversationId);
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: {
      createdAt: "asc"
    }
  });
  return messages.map(mapMessage);
}

export async function addMessage(input: {
  conversationId: string;
  authorType: "customer" | "agent";
  authorId?: string;
  body: string;
}) {
  if (useDemoStore()) {
    const message = {
      id: createId("msg"),
      conversationId: input.conversationId,
      authorType: input.authorType,
      authorId: input.authorId,
      body: input.body,
      createdAt: new Date().toISOString()
    };
    state.messages.push(message);
    return message;
  }

  const message = await prisma.message.create({
    data: {
      conversationId: input.conversationId,
      authorType: input.authorType,
      authorId: input.authorId,
      body: input.body
    }
  });
  return mapMessage(message);
}

export async function getConversationNotes(conversationId: string) {
  if (useDemoStore()) {
    return state.notes.filter((note) => note.conversationId === conversationId);
  }

  const notes = await prisma.internalNote.findMany({
    where: { conversationId },
    orderBy: {
      createdAt: "desc"
    }
  });
  return notes.map(mapInternalNote);
}

export async function addNote(
  conversationId: string,
  authorId: string,
  body: string
): Promise<InternalNote> {
  if (useDemoStore()) {
    const note: InternalNote = {
      id: createId("note"),
      conversationId,
      authorId,
      body,
      createdAt: new Date().toISOString()
    };
    state.notes.unshift(note);
    return note;
  }

  const note = await prisma.internalNote.create({
    data: {
      conversationId,
      authorId,
      body
    }
  });
  return mapInternalNote(note);
}

export async function addUsageEvent(
  organisationId: string,
  event: Omit<UsageEvent, "id" | "organisationId" | "createdAt">
) {
  if (useDemoStore()) {
    const usageEvent: UsageEvent = {
      id: createId("usage"),
      organisationId,
      createdAt: new Date().toISOString(),
      ...event
    };
    state.usageEvents.unshift(usageEvent);
    return usageEvent;
  }

  const usageEvent = await prisma.usageEvent.create({
    data: {
      organisationId,
      type: event.type,
      referenceId: event.referenceId,
      tokenEstimate: event.tokenEstimate,
      estimatedCostUsd: event.estimatedCostUsd,
      metadata: (event.metadata as Prisma.InputJsonValue | undefined) ?? Prisma.JsonNull
    }
  });
  return mapUsageEvent(usageEvent);
}

export async function insertCannedResponseInDraft(
  organisationId: string,
  conversationId: string,
  cannedResponseId: string
) {
  if (useDemoStore()) {
    const cannedResponse = state.cannedResponses.find((item) => item.id === cannedResponseId);
    if (!cannedResponse) {
      throw new Error("Canned response not found.");
    }
    cannedResponse.usageCount += 1;
    cannedResponse.updatedAt = new Date().toISOString();
    const conversation = await getConversation(organisationId, conversationId);
    conversation.latestDraft = cannedResponse.body;
    conversation.updatedAt = new Date().toISOString();
    await addUsageEvent(organisationId, {
      type: "CANNED_RESPONSE_INSERTED",
      referenceId: cannedResponseId,
      metadata: { conversationId }
    });
    return conversation;
  }

  const result = await prisma.$transaction(async (tx) => {
    const cannedResponse = await tx.cannedResponse.update({
      where: { id: cannedResponseId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    });
    const conversation = await tx.conversation.update({
      where: { id: conversationId },
      data: {
        latestDraft: cannedResponse.body
      }
    });
    await tx.usageEvent.create({
      data: {
        organisationId,
        type: "CANNED_RESPONSE_INSERTED",
        referenceId: cannedResponseId,
        metadata: {
          conversationId
        }
      }
    });
    return conversation;
  });

  return mapConversation(result);
}

export async function addAiGeneration(input: Omit<AiReplyGeneration, "id" | "createdAt" | "updatedAt">) {
  if (useDemoStore()) {
    const generation: AiReplyGeneration = {
      id: createId("ai"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input
    };
    state.aiGenerations.unshift(generation);
    await addUsageEvent(input.organisationId, {
      type: "AI_GENERATION",
      referenceId: input.conversationId,
      tokenEstimate: input.tokenEstimate,
      estimatedCostUsd: input.estimatedCostUsd,
      metadata: { outcome: input.outcome, warning: input.warning ?? null }
    });
    return generation;
  }

  const generation = await prisma.$transaction(async (tx) => {
    const created = await tx.aiReplyGeneration.create({
      data: {
        organisationId: input.organisationId,
        conversationId: input.conversationId,
        draft: input.draft,
        confidenceLabel: input.confidenceLabel,
        sourceArticleIds: input.sourceArticleIds,
        sourceSnippetTitles: input.sourceSnippetTitles,
        outcome: toPrismaOutcome(input.outcome),
        tokenEstimate: input.tokenEstimate,
        estimatedCostUsd: input.estimatedCostUsd,
        warning: input.warning
      }
    });
    await tx.usageEvent.create({
      data: {
        organisationId: input.organisationId,
        type: "AI_GENERATION",
        referenceId: input.conversationId,
        tokenEstimate: input.tokenEstimate,
        estimatedCostUsd: input.estimatedCostUsd,
        metadata: {
          outcome: input.outcome,
          warning: input.warning ?? null
        }
      }
    });
    return created;
  });

  return mapGeneration(generation);
}

export async function updateAiGenerationOutcome(
  id: string,
  outcome: AiApprovalOutcome,
  draft?: string
) {
  if (useDemoStore()) {
    const generation = state.aiGenerations.find((item) => item.id === id);
    if (!generation) {
      throw new Error("AI generation not found.");
    }
    generation.outcome = outcome;
    generation.updatedAt = new Date().toISOString();
    if (draft) {
      generation.draft = draft;
    }
    return generation;
  }

  const generation = await prisma.aiReplyGeneration.update({
    where: { id },
    data: {
      outcome: toPrismaOutcome(outcome),
      draft
    }
  });
  return mapGeneration(generation);
}

export async function getWorkspaceAiGenerations(organisationId: string) {
  if (useDemoStore()) {
    return state.aiGenerations.filter((item) => item.organisationId === organisationId);
  }

  const generations = await prisma.aiReplyGeneration.findMany({
    where: { organisationId },
    orderBy: {
      createdAt: "desc"
    }
  });
  return generations.map(mapGeneration);
}

export async function getWorkspaceUsageEvents(organisationId: string) {
  if (useDemoStore()) {
    return state.usageEvents.filter((event) => event.organisationId === organisationId);
  }

  const usageEvents = await prisma.usageEvent.findMany({
    where: { organisationId },
    orderBy: {
      createdAt: "desc"
    }
  });
  return usageEvents.map(mapUsageEvent);
}

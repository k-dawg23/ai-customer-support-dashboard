"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authenticate, authorizeRole } from "@/lib/auth";
import { generateAiDraft } from "@/lib/ai";
import {
  addMessage,
  addNote,
  createArticle,
  createCannedResponse,
  createWorkspaceUser,
  deleteArticle,
  deleteCannedResponse,
  getCannedResponse,
  getConversation,
  getWorkspaceSettings,
  insertCannedResponseInDraft,
  registerWorkspaceAdmin,
  removeWorkspaceUser,
  updateAiGenerationOutcome,
  updateArticle,
  updateCannedResponse,
  updateConversation,
  updateWorkspaceUserRole,
  updateWorkspaceSettings
} from "@/lib/store";
import { clearSession, createSession, getSession } from "@/lib/session";
import { getMonthlyAiUsageSummary } from "@/lib/usage";
import type { ArticleState, SupportTone } from "@/lib/types";

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(formData: FormData) {
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const session = await authenticate(email, password);
  if (!session) {
    redirect("/login?error=invalid");
  }
  await createSession(session);
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const name = getField(formData, "name");
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const organisationName = getField(formData, "organisationName");
  const { user, organisation } = await registerWorkspaceAdmin({
    name,
    email,
    password,
    organisationName
  });
  await createSession({ userId: user.id, organisationId: organisation.id });
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

async function requireWorkspaceSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("You must be signed in.");
  }
  return session;
}

export async function assignConversationAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  await updateConversation(getField(formData, "conversationId"), {
    assignedToId: getField(formData, "assignedToId")
  });
  revalidatePath("/dashboard/conversations");
}

export async function saveDraftAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  await updateConversation(getField(formData, "conversationId"), {
    latestDraft: getField(formData, "latestDraft")
  });
  const generationId = getField(formData, "generationId");
  if (generationId) {
    await updateAiGenerationOutcome(
      generationId,
      getField(formData, "edited") === "true" ? "edited_and_used" : "accepted_unchanged",
      getField(formData, "latestDraft")
    );
  }
  revalidatePath("/dashboard/conversations");
}

export async function rejectDraftAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  await updateAiGenerationOutcome(getField(formData, "generationId"), "rejected");
  revalidatePath("/dashboard/conversations");
}

export async function resolveConversationAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  await updateConversation(getField(formData, "conversationId"), {
    status: "RESOLVED",
    resolvedAt: new Date().toISOString()
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/conversations");
}

export async function addNoteAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  await addNote(getField(formData, "conversationId"), session.userId, getField(formData, "body"));
  revalidatePath("/dashboard/conversations");
}

export async function createArticleAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await createArticle(session.organisationId, {
    title: getField(formData, "title"),
    category: getField(formData, "category"),
    summary: getField(formData, "summary"),
    body: getField(formData, "body"),
    state: getField(formData, "state") as ArticleState
  });
  revalidatePath("/dashboard/knowledge-base");
}

export async function updateArticleAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await updateArticle(getField(formData, "id"), {
    title: getField(formData, "title") || undefined,
    category: getField(formData, "category") || undefined,
    summary: getField(formData, "summary") || undefined,
    body: getField(formData, "body") || undefined,
    state: getField(formData, "state") as ArticleState
  });
  revalidatePath("/dashboard/knowledge-base");
}

export async function deleteArticleAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await deleteArticle(getField(formData, "id"));
  revalidatePath("/dashboard/knowledge-base");
}

export async function createCannedResponseAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await createCannedResponse(session.organisationId, {
    title: getField(formData, "title"),
    category: getField(formData, "category"),
    body: getField(formData, "body")
  });
  revalidatePath("/dashboard/canned-responses");
}

export async function updateCannedResponseAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await updateCannedResponse(getField(formData, "id"), {
    title: getField(formData, "title") || undefined,
    category: getField(formData, "category") || undefined,
    body: getField(formData, "body") || undefined
  });
  revalidatePath("/dashboard/canned-responses");
}

export async function deleteCannedResponseAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await deleteCannedResponse(getField(formData, "id"));
  revalidatePath("/dashboard/canned-responses");
}

export async function insertCannedResponseAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  await insertCannedResponseInDraft(
    session.organisationId,
    getField(formData, "conversationId"),
    getField(formData, "cannedResponseId")
  );
  revalidatePath("/dashboard/conversations");
}

export async function updateSettingsAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await updateWorkspaceSettings(session.organisationId, {
    companyName: getField(formData, "companyName"),
    supportTone: getField(formData, "supportTone") as SupportTone,
    defaultAiModel: getField(formData, "defaultAiModel"),
    monthlyAiUsageLimit: Number(getField(formData, "monthlyAiUsageLimit")),
    businessHours: getField(formData, "businessHours"),
    escalationMessage: getField(formData, "escalationMessage")
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function createWorkspaceUserAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  await createWorkspaceUser(session.organisationId, {
    name: getField(formData, "name"),
    email: getField(formData, "email"),
    password: getField(formData, "password") || "demo1234",
    role: getField(formData, "role") as "ADMIN" | "SUPPORT_AGENT" | "VIEWER"
  });
  revalidatePath("/dashboard/settings");
}

export async function updateWorkspaceUserRoleAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  if (getField(formData, "userId") === session.userId) {
    throw new Error("You cannot change your own role from this screen.");
  }
  await updateWorkspaceUserRole(
    session.organisationId,
    getField(formData, "membershipId"),
    getField(formData, "role") as "ADMIN" | "SUPPORT_AGENT" | "VIEWER"
  );
  revalidatePath("/dashboard/settings");
}

export async function removeWorkspaceUserAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN"]);
  if (getField(formData, "userId") === session.userId) {
    throw new Error("You cannot remove your own access from this screen.");
  }
  await removeWorkspaceUser(session.organisationId, getField(formData, "membershipId"));
  revalidatePath("/dashboard/settings");
}

export async function generateDraftAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  const [settings, usageSummary] = await Promise.all([
    getWorkspaceSettings(session.organisationId),
    getMonthlyAiUsageSummary(session.organisationId)
  ]);
  if (usageSummary.used >= settings.monthlyAiUsageLimit) {
    redirect(`/dashboard/conversations/${getField(formData, "conversationId")}?limitReached=1`);
  }
  const cannedResponseId = getField(formData, "cannedResponseId");
  const cannedResponse = cannedResponseId ? await getCannedResponse(cannedResponseId) : undefined;
  const generation = await generateAiDraft({
    organisationId: session.organisationId,
    conversationId: getField(formData, "conversationId"),
    cannedResponseBody: cannedResponse?.body
  });
  const conversation = await getConversation(session.organisationId, generation.conversationId);
  const previousDraft = conversation.latestDraft;
  await updateConversation(conversation.id, { latestDraft: generation.draft });
  revalidatePath(`/dashboard/conversations/${conversation.id}`);
  redirect(
    `/dashboard/conversations/${conversation.id}?generationId=${generation.id}&edited=${String(
      generation.draft !== previousDraft
    )}`
  );
}

export async function postReplyAction(formData: FormData) {
  const session = await requireWorkspaceSession();
  await authorizeRole(session, ["ADMIN", "SUPPORT_AGENT"]);
  const conversationId = getField(formData, "conversationId");
  const latestDraft = getField(formData, "latestDraft");
  await addMessage({
    conversationId,
    authorType: "agent",
    authorId: session.userId,
    body: latestDraft,
  });
  await updateConversation(conversationId, { status: "PENDING", latestDraft });
  revalidatePath(`/dashboard/conversations/${conversationId}`);
}

import type { MemberRole } from "@/lib/types";
import { getConversationNotes } from "@/lib/store";

export function canViewInternalNotes(role: MemberRole) {
  return role === "ADMIN" || role === "SUPPORT_AGENT";
}

export async function getVisibleInternalNotes(role: MemberRole, conversationId: string) {
  return canViewInternalNotes(role) ? getConversationNotes(conversationId) : [];
}

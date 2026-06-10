import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import {
  getMembership,
  getPrimaryMembership,
  getUserByEmail,
  isDemoStoreEnabled
} from "@/lib/store";
import type { AuthSession, MemberRole } from "@/lib/types";

export async function authenticate(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const passwordMatches = isDemoStoreEnabled()
    ? user.password === password
    : await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return null;
  }

  const membership = await getPrimaryMembership(user.id);
  if (!membership) {
    return null;
  }

  return {
    userId: user.id,
    organisationId: membership.organisationId
  } satisfies AuthSession;
}

export async function authorizeRole(session: AuthSession, allowedRoles: MemberRole[]) {
  const role = (await getMembership(session.userId, session.organisationId))?.role;
  if (!role || !allowedRoles.includes(role)) {
    throw new Error("You do not have permission to perform this action.");
  }
  return role;
}

export async function requireRole(session: AuthSession, allowedRoles: MemberRole[]) {
  const role = (await getMembership(session.userId, session.organisationId))?.role;
  if (!role || !allowedRoles.includes(role)) {
    redirect("/dashboard?denied=1");
  }
  return role;
}

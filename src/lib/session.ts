import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getMembership, getOrganisation, getUser } from "@/lib/store";
import type { AuthSession, MemberRole } from "@/lib/types";

const sessionCookieName = "support-dashboard-session";

export async function createSession(session: AuthSession) {
  const store = await cookies();
  store.set(sessionCookieName, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(sessionCookieName);
}

export async function getSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const raw = store.get(sessionCookieName)?.value;
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const membership = await getMembership(session.userId, session.organisationId);
  if (!membership) {
    redirect("/access-denied");
  }
  const user = await getUser(session.userId);
  const organisation = await getOrganisation(session.organisationId);
  if (!user) {
    redirect("/login");
  }
  return { session, membership, user, organisation };
}

export async function requireRole(allowedRoles: MemberRole[]) {
  const { session, membership, user, organisation } = await requireSession();
  if (!allowedRoles.includes(membership.role)) {
    redirect("/access-denied");
  }
  return { session, membership, user, organisation };
}

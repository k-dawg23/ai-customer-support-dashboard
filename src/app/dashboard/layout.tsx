import { headers } from "next/headers";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { membership, organisation } = await requireSession();
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/dashboard";

  return (
    <DashboardShell role={membership.role} organisationName={organisation.name} pathname={pathname}>
      {children}
    </DashboardShell>
  );
}

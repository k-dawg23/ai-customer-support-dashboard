import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/session";
import { getWorkspaceSettings } from "@/lib/store";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { membership, organisation } = await requireSession();
  const settings = await getWorkspaceSettings(organisation.id);

  return (
    <DashboardShell
      role={membership.role}
      organisationName={settings.companyName || organisation.name}
    >
      {children}
    </DashboardShell>
  );
}

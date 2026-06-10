import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/session";
import { getWorkspaceSettings, isDemoStoreEnabled } from "@/lib/store";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { membership, organisation } = await requireSession();
  const settings = await getWorkspaceSettings(organisation.id);
  const showDemoAccounts = isDemoStoreEnabled();

  return (
    <DashboardShell
      role={membership.role}
      organisationName={settings.companyName || organisation.name}
      showDemoAccounts={showDemoAccounts}
    >
      {children}
    </DashboardShell>
  );
}

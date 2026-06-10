"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Bot, Home, LogOut, MessageSquareMore, Settings2 } from "lucide-react";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import type { MemberRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home, exact: true },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquareMore },
  { href: "/dashboard/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/dashboard/canned-responses", label: "Canned Responses", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings2 }
];

export function DashboardShell({
  role,
  organisationName,
  showDemoAccounts,
  children
}: {
  role: MemberRole;
  organisationName: string;
  showDemoAccounts: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] gap-6 px-4 py-4 md:px-6 lg:px-8 xl:grid-cols-[260px_1fr]">
        <aside className="rounded-[28px] border border-border bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Support OS</p>
              <h1 className="mt-2 text-lg font-semibold text-foreground">{organisationName}</h1>
              <p className="text-sm text-muted">{role.replace("_", " ")}</p>
            </div>
            <BarChart3 className="size-9 rounded-2xl bg-primary/10 p-2 text-primary" />
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                    active
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-muted hover:bg-surface-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {showDemoAccounts ? (
            <div className="mt-6 space-y-3 rounded-3xl border border-border bg-surface-muted p-4">
              <p className="text-sm font-medium text-foreground">Demo accounts</p>
              <div className="space-y-1 text-sm text-muted">
                <p>`ava@stackbeacon.test` admin</p>
                <p>`noah@stackbeacon.test` admin</p>
                <p>`sam@stackbeacon.test` agent</p>
                <p>`mia@stackbeacon.test` agent</p>
                <p>`leo@stackbeacon.test` agent</p>
                <p>`vera@stackbeacon.test` viewer</p>
              </div>
              <p className="text-xs text-muted">Password: `demo1234`</p>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-muted transition hover:border-primary hover:text-primary"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="rounded-[28px] border border-border bg-surface p-4 shadow-card md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

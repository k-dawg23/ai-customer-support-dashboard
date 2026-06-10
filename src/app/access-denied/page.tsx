import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-md rounded-[28px] border border-border bg-surface p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-danger">Access denied</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">No workspace access</h1>
        <p className="mt-3 text-sm text-muted">
          Your account does not currently have an active organisation membership for this dashboard.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Return to sign in
        </Link>
      </div>
    </main>
  );
}

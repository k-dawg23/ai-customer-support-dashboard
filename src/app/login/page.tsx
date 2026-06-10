import Link from "next/link";

import { loginAction } from "@/app/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-border bg-surface p-10 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            AI Customer Support Dashboard
          </p>
          <h1 className="mt-5 max-w-xl text-5xl font-semibold tracking-tight text-foreground">
            Human-reviewed AI replies, operational visibility, and grounded support knowledge.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
            A multi-user dashboard for small teams managing customer conversations, reusable answers,
            and AI drafts that stay under human control.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Open", "12 active conversations"],
              ["Pending", "5 waiting on customers"],
              ["Resolved", "42 this week"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-border bg-surface-muted p-4">
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-border bg-surface p-8 shadow-card">
          <h2 className="text-2xl font-semibold text-foreground">Sign in</h2>
          <p className="mt-2 text-sm text-muted">Use a demo account or create a new workspace.</p>

          <form action={loginAction} className="mt-8 space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Email</span>
              <input
                name="email"
                type="email"
                defaultValue="ava@stackbeacon.test"
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Password</span>
              <input
                name="password"
                type="password"
                defaultValue="demo1234"
                className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
              />
            </label>
            {error ? (
              <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                Sign-in failed. Check the email, password, and workspace membership.
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            No workspace yet?{" "}
            <Link className="font-semibold text-primary" href="/register">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

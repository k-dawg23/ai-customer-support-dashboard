import Link from "next/link";

import { registerAction } from "@/app/actions";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <section className="w-full max-w-2xl rounded-[32px] border border-border bg-surface p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Create workspace</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Set up a support dashboard in one pass.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Registration creates a new organisation, a default settings profile, and an admin
          membership for the first user.
        </p>
        <form action={registerAction} className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm sm:col-span-2">
            <span className="font-medium text-foreground">Organisation name</span>
            <input
              name="organisationName"
              defaultValue="Northwind Support"
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Your name</span>
            <input
              name="name"
              defaultValue="Nora Lead"
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Email</span>
            <input
              name="email"
              type="email"
              defaultValue="nora@northwind.test"
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm sm:col-span-2">
            <span className="font-medium text-foreground">Password</span>
            <input
              name="password"
              type="password"
              defaultValue="demo1234"
              className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-foreground"
            />
          </label>
          <button
            type="submit"
            className="sm:col-span-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            Create workspace
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          Already have access?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

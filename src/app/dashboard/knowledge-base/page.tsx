import {
  createArticleAction,
  deleteArticleAction,
  updateArticleAction
} from "@/app/actions";
import { requireRole } from "@/lib/session";
import { getWorkspaceArticles } from "@/lib/store";

export default async function KnowledgeBasePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; state?: string }>;
}) {
  const { organisation, membership } = await requireRole(["ADMIN", "SUPPORT_AGENT", "VIEWER"]);
  const articles = await getWorkspaceArticles(organisation.id);
  const { q = "", category = "all", state = "all" } = await searchParams;
  const query = q.trim().toLowerCase();
  const categories = [...new Set(articles.map((article) => article.category))].sort();
  const filteredArticles = articles.filter((article) => {
    const matchesQuery =
      query.length === 0 ||
      [article.title, article.category, article.summary, article.body].some((value) =>
        value.toLowerCase().includes(query)
      );
    const matchesCategory = category === "all" || article.category === category;
    const matchesState = state === "all" || article.state === state;
    return matchesQuery && matchesCategory && matchesState;
  });
  const canManage = membership.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Knowledge base</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Approved business guidance for grounded AI drafts.
        </h1>
      </div>

      <form className="grid gap-3 rounded-[28px] border border-border bg-surface p-6 lg:grid-cols-[1.3fr_0.8fr_0.7fr_auto]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search articles, categories, or keywords"
          className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          name="state"
          defaultValue={state}
          className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-foreground"
        >
          <option value="all">All states</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
          Filter
        </button>
      </form>

      {canManage ? (
        <form action={createArticleAction} className="grid gap-3 rounded-[28px] border border-border bg-surface-muted p-6 lg:grid-cols-2">
          <input
            name="title"
            placeholder="Article title"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
          />
          <input
            name="category"
            placeholder="Category"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
          />
          <input
            name="summary"
            placeholder="Summary"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground lg:col-span-2"
          />
          <textarea
            name="body"
            placeholder="Article body"
            rows={4}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground lg:col-span-2"
          />
          <select
            name="state"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
            defaultValue="ACTIVE"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
            Add article
          </button>
        </form>
      ) : null}

      <div className="flex items-center justify-between text-sm text-muted">
        <p>{filteredArticles.length} matching articles</p>
        <p>{articles.length} total in library</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredArticles.map((article) => (
          <article key={article.id} className="rounded-[28px] border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">{article.category}</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">{article.title}</h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  article.state === "ACTIVE"
                    ? "bg-success/10 text-success"
                    : "bg-muted/10 text-muted"
                }`}
              >
                {article.state.toLowerCase()}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">{article.summary}</p>
            <p className="mt-4 text-sm leading-6 text-foreground">{article.body}</p>
            {canManage ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <form
                  action={updateArticleAction}
                  className="grid w-full gap-3 rounded-3xl border border-border bg-surface-muted p-4"
                >
                  <input type="hidden" name="id" value={article.id} />
                  <input
                    name="title"
                    defaultValue={article.title}
                    className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
                  />
                  <input
                    name="category"
                    defaultValue={article.category}
                    className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
                  />
                  <input
                    name="summary"
                    defaultValue={article.summary}
                    className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
                  />
                  <textarea
                    name="body"
                    rows={4}
                    defaultValue={article.body}
                    className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
                  />
                  <select
                    name="state"
                    defaultValue={article.state}
                    className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <button type="submit" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                    Update article
                  </button>
                </form>
                <form action={updateArticleAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <input
                    type="hidden"
                    name="state"
                    value={article.state === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
                  />
                  <button type="submit" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                    Mark {article.state === "ACTIVE" ? "inactive" : "active"}
                  </button>
                </form>
                <form action={deleteArticleAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-danger/20 bg-danger/10 px-4 py-2 text-sm font-medium text-danger"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

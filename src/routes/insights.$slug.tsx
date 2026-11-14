import { Button } from "@/components/ui/button";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ARTICLES } from "@/components/site/content";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const article = ARTICLES.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Activ Marine Insights` },
          { name: "description", content: loaderData.excerpt },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.excerpt },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Article unavailable | Activ Marine" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-6xl uppercase">Article not found</h1>
      <Link to="/insights" className="text-primary">Back to insights</Link>
    </div>
  ),
  component: Article,
});

function Article() {
  const a = Route.useLoaderData();
  return (
    <PageShell>
      {(open) => (
        <article className="mx-auto max-w-3xl px-6 pb-32 pt-40">
          <Link to="/insights" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />All insights</Link>
          <p className="eyebrow mt-12">{a.date} · {a.read} read</p>
          <h1 className="mt-6 text-[clamp(3rem,8vw,6.5rem)] uppercase">{a.title}</h1>
          <p className="mt-6 text-xl font-light text-muted-foreground">{a.excerpt}</p>
          <div className="mt-12 space-y-6 border-t border-border pt-12 text-lg leading-relaxed">
            {a.body.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="mt-16 border-l-2 border-primary bg-muted p-8">
            <p className="font-display text-3xl uppercase">Facing this on your vessel?</p>
            <Button onClick={open} className="h-auto rounded-none mt-4 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground">Send enquiry</Button>
          </div>
        </article>
      )}
    </PageShell>
  );
}

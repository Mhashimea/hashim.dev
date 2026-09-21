import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, getPosts, formatPostDate, headingId } from "@/lib/blog";
import { profile } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return {
    title: post.title, description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, url: `/blog/${post.slug}`, publishedTime: post.date, authors: [profile.name] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const headings = Array.from(post.content.matchAll(/^## (.+)$/gm), (match) => match[1]);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title,
    description: post.description, datePublished: post.date,
    author: { "@type": "Person", name: profile.name, url: "https://hashim.dev" },
    mainEntityOfPage: `https://hashim.dev/blog/${post.slug}`,
  };
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/blog" className="font-mono text-xs text-cream-dim hover:text-marigold">← All writing</Link>
      <article>
        <header className="mb-12 mt-10 max-w-4xl border-b border-line pb-10">
          <p className="eyebrow">AI engineering / Architecture</p>
          <h1 className="mt-5 text-balance font-display text-4xl leading-[1.12] sm:text-5xl md:text-6xl">{post.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-dim md:text-xl">{post.description}</p>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-cream-dim"><span>By Hashim</span><time dateTime={post.date}>{formatPostDate(post.date)}</time><span>{post.readingMinutes} min read</span></div>
        </header>
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0">
            <div className="mb-10 grid overflow-hidden rounded-2xl border border-line sm:grid-cols-3" aria-label="Three responsibilities in an AI workflow">
              {[{ label: "LLM", verb: "Generate", detail: "Language for people", color: "text-marigold" }, { label: "Jev", verb: "Evaluate", detail: "Typed decision signals", color: "text-teal" }, { label: "Code", verb: "Enforce", detail: "Rules and actions", color: "text-cream" }].map((item) => (
                <div key={item.label} className="border-b border-line bg-ink-card p-6 last:border-0 sm:border-r sm:border-b-0"><p className={`font-mono text-xs ${item.color}`}>{item.label}</p><p className="mt-4 font-display text-2xl">{item.verb}</p><p className="mt-2 text-sm text-cream-dim">{item.detail}</p></div>
              ))}
            </div>
            <div className="blog-prose">
              <Markdown remarkPlugins={[remarkGfm]} components={{
                h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
                table: ({ children }) => <div className="blog-table" tabIndex={0} role="region" aria-label="Model selection comparison"><table>{children}</table></div>,
                pre: ({ children }) => <pre tabIndex={0}>{children}</pre>,
              }}>{post.content}</Markdown>
            </div>
            <div className="mt-14 border-t border-line pt-8"><Link href="/blog" className="text-marigold">← Back to all writing</Link></div>
          </div>
          <aside className="lg:sticky lg:top-8">
            <nav aria-label="On this page" className="rounded-xl border border-line p-5"><p className="eyebrow mb-5">On this page</p><ol className="space-y-3 text-sm leading-relaxed text-cream-dim">{headings.map((title) => <li key={title}><a href={`#${headingId(title)}`} className="hover:text-marigold">{title}</a></li>)}</ol></nav>
          </aside>
        </div>
      </article>
    </main>
  );
}

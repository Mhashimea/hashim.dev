import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatPostDate } from "@/lib/blog";

const description = "Practical notes on AI models, agents, and the software around them.";
export const metadata: Metadata = {
  title: "Writing", description, alternates: { canonical: "/blog" },
  openGraph: { title: "Writing · Hashim", description, url: "/blog", type: "website" },
  twitter: { card: "summary_large_image", title: "Writing · Hashim", description },
};

export default function BlogIndex() {
  return (
    <main id="main-content" className="mx-auto min-h-[75vh] max-w-6xl px-6 py-16 md:py-24">
      <p className="eyebrow">Notes from the workshop</p>
      <h1 className="mt-6 font-display text-5xl md:text-7xl">Thinking out loud.<br /><span className="text-cream-dim">Building with intent.</span></h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim">{description} How they work, where they fit, and what belongs in ordinary code.</p>
      <div className="mt-16 border-t border-line">
        {getPosts().map((post) => (
          <article key={post.slug} className="border-b border-line py-10">
            <Link href={`/blog/${post.slug}`} className="group grid gap-6 md:grid-cols-[180px_1fr_40px]">
              <div className="font-mono text-xs leading-7 text-cream-dim"><time dateTime={post.date}>{formatPostDate(post.date)}</time><p>{post.readingMinutes} min read</p></div>
              <div><p className="eyebrow mb-3">AI engineering</p><h2 className="font-display text-3xl leading-tight transition-colors group-hover:text-marigold md:text-4xl">{post.title}</h2><p className="mt-4 max-w-2xl leading-relaxed text-cream-dim">{post.description}</p></div>
              <span aria-hidden="true" className="text-2xl text-marigold">↗</span>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

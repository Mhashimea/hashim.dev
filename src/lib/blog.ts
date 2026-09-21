import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const directory = path.join(process.cwd(), "content/blog");

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  content: string;
};

export function getPosts(): Post[] {
  return fs.readdirSync(directory).filter((name) => name.endsWith(".md")).flatMap((name) => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, name), "utf8"));
    if (data.status !== "ready") return [];
    if (typeof data.title !== "string" || typeof data.description !== "string" || typeof data.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      throw new Error(`Invalid blog metadata: ${name}`);
    }
    return [{
      slug: name.replace(/\.md$/, ""), title: data.title, description: data.description,
      date: data.date, content,
      readingMinutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 220)),
    }];
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

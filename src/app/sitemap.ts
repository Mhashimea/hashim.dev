import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hashim.dev/blog", changeFrequency: "weekly", priority: 0.8 },
    ...getPosts().map((post) => ({ url: `https://hashim.dev/blog/${post.slug}`, lastModified: new Date(post.date), priority: 0.7 })),
    {
      url: "https://hashim.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

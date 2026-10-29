import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { blogIndexable } from "./blog/indexing";
import { getAllPostSummaries } from "./blog/wordpress";

const staticPaths = [
  "/",
  "/projects/smoki",
  "/projects/capone",
  "/projects/marsh",
  "/projects/urda",
  "/privacy-policy",
  "/terms-of-use"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const appUrl = (process.env.APP_URL || "https://nwdagency.com").replace(/\/$/, "");

  const blogEntries: MetadataRoute.Sitemap = [];
  if (blogIndexable) {
    blogEntries.push({ url: `${appUrl}/blog` });
    try {
      const posts = await getAllPostSummaries();
      blogEntries.push(
        ...posts.map((post) => ({ url: `${appUrl}/blog/${post.slug}`, lastModified: post.updatedAt }))
      );
    } catch (error) {
      console.error("Sitemap: could not load blog posts", error);
    }
  }

  return [...staticPaths.map((path) => ({ url: `${appUrl}${path}` })), ...blogEntries];
}

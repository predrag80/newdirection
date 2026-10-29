import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getAllPostSummaries } from "./blog/wordpress";

const staticPaths = [
  "/",
  "/blog",
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

  let posts: Awaited<ReturnType<typeof getAllPostSummaries>> = [];
  try {
    posts = await getAllPostSummaries();
  } catch (error) {
    console.error("Sitemap: could not load blog posts", error);
  }

  return [
    ...staticPaths.map((path) => ({ url: `${appUrl}${path}` })),
    ...posts.map((post) => ({ url: `${appUrl}/blog/${post.slug}`, lastModified: post.updatedAt }))
  ];
}

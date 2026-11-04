import { timingSafeEqual } from "node:crypto";
import type { Metadata } from "next";
import { cookies } from "next/headers";

// The blog is closed for now: /blog shows a "coming soon" page and every post redirects to it.
// Editors still see the whole blog through the preview link, and so does `npm run dev`.
// Set to true to open it on the live site.
export const blogPublic = false;

// Kept out of search engines for now. Set to true to let them index it: that drops the noindex tag
// from /blog and the posts and lists them in sitemap.xml. It only takes effect once the blog is public.
export const blogIndexable = false;

export const blogInSearch = blogPublic && blogIndexable;

export const blogRobots: Metadata["robots"] = blogInSearch ? undefined : { index: false, follow: false };

// The preview link (/api/blog-preview?key=<BLOG_PREVIEW_KEY>) stores the key in this cookie.
export const BLOG_PREVIEW_COOKIE = "nwd_blog_preview";

export function isBlogPreviewKey(value: string | null | undefined) {
  const key = process.env.BLOG_PREVIEW_KEY;
  if (!key || !value) return false;

  const expected = Buffer.from(key);
  const received = Buffer.from(value);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function canViewBlog() {
  if (blogPublic || process.env.NODE_ENV === "development") return true;
  return isBlogPreviewKey((await cookies()).get(BLOG_PREVIEW_COOKIE)?.value);
}

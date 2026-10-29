import type { Metadata } from "next";

// The blog is live but kept out of search engines for now. Set to true to let them index it:
// that drops the noindex tag from /blog and the posts and lists them in sitemap.xml.
export const blogIndexable = false;

export const blogRobots: Metadata["robots"] = blogIndexable ? undefined : { index: false, follow: false };

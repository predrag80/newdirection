import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { after, NextResponse } from "next/server";
import { BLOG_CACHE_TAG } from "../../blog/wordpress";

export const runtime = "nodejs";

// Called by WordPress (ops/wordpress/mu-plugins/nwd-headless.php) whenever blog content changes,
// with the slugs of the changed posts.
function isAuthorized(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { slugs?: unknown };
  const slugs = (Array.isArray(body.slugs) ? body.slugs : [])
    .filter((slug): slug is string => typeof slug === "string" && /^[a-z0-9-]+$/.test(slug))
    .slice(0, 20);

  // Stale-while-revalidate: cached pages keep working if WordPress is down. The first request
  // after this still gets the old page and refreshes it in the background, so make those
  // requests now; editors and visitors then see the change within a second.
  revalidateTag(BLOG_CACHE_TAG, "max");

  const origin = new URL(request.url).origin;
  after(async () => {
    const paths = ["/blog", ...slugs.map((slug) => `/blog/${slug}`)];
    await Promise.allSettled(paths.map((path) => fetch(new URL(path, origin), { cache: "no-store" })));
  });

  return NextResponse.json({ revalidated: true, slugs });
}

import { NextResponse } from "next/server";
import { BLOG_PREVIEW_COOKIE, isBlogPreviewKey } from "../../blog/visibility";

export const runtime = "nodejs";

// Secret link for editors while the blog is closed: /api/blog-preview?key=<BLOG_PREVIEW_KEY>
// shows them the whole blog in that browser for 90 days. /api/blog-preview?exit ends the preview.
// A wrong key just lands on /blog, so the link does not reveal whether a key exists.
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const key = params.get("key");
  const response = new NextResponse(null, { status: 307, headers: { Location: "/blog" } });

  if (params.has("exit")) {
    response.cookies.delete(BLOG_PREVIEW_COOKIE);
  } else if (isBlogPreviewKey(key)) {
    response.cookies.set(BLOG_PREVIEW_COOKIE, key!, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
  }

  return response;
}

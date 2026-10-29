import sanitizeHtml from "sanitize-html";

// WordPress (cms.nwdagency.com) is the CMS for the blog. On the server Next.js reads the REST API
// on 127.0.0.1:8081; see docs/blog-cms.md. Responses are cached until WordPress calls
// /api/revalidate, with an hourly refresh as a fallback.
const apiUrl = process.env.WORDPRESS_API_URL?.replace(/\/$/, "");

export const BLOG_CACHE_TAG = "wordpress";

export type BlogImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  // May contain <em> for the serif italic words in the design.
  titleHtml: string;
  title: string;
  excerpt: string;
  // Hand-written excerpt only, shown under the title on the post page.
  lead: string;
  // Site-local time, for WordPress date queries.
  date: string;
  publishedAt: string;
  updatedAt: string;
  category: { id: number; slug: string; name: string } | null;
  tags: string[];
  image: BlogImage | null;
  credits: string[];
  contentHtml: string;
};

type WpMediaSize = { source_url: string; width: number; height: number };

type WpMedia = {
  source_url: string;
  alt_text: string;
  media_details?: { width: number; height: number; sizes?: Record<string, WpMediaSize> };
};

type WpTerm = { id: number; slug: string; name: string; taxonomy: string };

type WpPost = {
  id: number;
  slug: string;
  date: string;
  date_gmt: string;
  modified_gmt: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  meta?: { nwd_credits?: string };
  nwd_lead?: string;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
};

const postFields = "id,slug,date,date_gmt,modified_gmt,title,excerpt,content,meta,nwd_lead,_links,_embedded";

async function wpFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!apiUrl) {
    throw new Error("Missing environment variable: WORDPRESS_API_URL");
  }

  const url = new URL(`${apiUrl}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    cache: "force-cache",
    next: { revalidate: 3600, tags: [BLOG_CACHE_TAG] }
  });

  if (!response.ok) {
    throw new Error(`WordPress ${url.pathname} responded ${response.status}`);
  }

  return (await response.json()) as T;
}

const namedEntities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—"
};

function decodeEntities(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return namedEntities[entity.toLowerCase()] ?? match;
  });
}

function toPlainText(html: string) {
  return decodeEntities(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }))
    .replace(/\s*\[…\]\s*$/, "…")
    .replace(/\s+/g, " ")
    .trim();
}

const contentSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "a", "ul", "ol", "li",
    "blockquote", "cite", "figure", "figcaption", "img", "hr"
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "srcset", "sizes", "width", "height", "alt", "loading", "decoding"],
    "*": ["class"]
  },
  allowedClasses: {
    "*": ["is-style-intro", "wp-block-gallery", "wp-block-image", "alignfull", "alignwide", "wp-block-quote"]
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
    a: (tagName, attribs) =>
      attribs.target === "_blank"
        ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
        : { tagName, attribs }
  }
};

function pickImage(media: WpMedia | undefined, minWidth: number, fallbackAlt: string): BlogImage | null {
  if (!media?.source_url) return null;

  const details = media.media_details;
  const candidates = Object.values(details?.sizes ?? {})
    .filter((size) => size.width >= minWidth)
    .sort((a, b) => a.width - b.width);
  const chosen = candidates[0] ?? {
    source_url: media.source_url,
    width: details?.width ?? minWidth,
    height: details?.height ?? Math.round(minWidth * 0.66)
  };

  return {
    src: chosen.source_url,
    width: chosen.width,
    height: chosen.height,
    alt: media.alt_text || fallbackAlt
  };
}

function toBlogPost(post: WpPost, imageMinWidth = 800): BlogPost {
  const terms = post._embedded?.["wp:term"]?.flat() ?? [];
  const category = terms.find((term) => term.taxonomy === "category");
  const title = toPlainText(post.title.rendered);

  return {
    id: post.id,
    slug: post.slug,
    titleHtml: sanitizeHtml(post.title.rendered, { allowedTags: ["em"], allowedAttributes: {} }),
    title,
    excerpt: toPlainText(post.excerpt.rendered),
    lead: decodeEntities(post.nwd_lead ?? "").trim(),
    date: post.date,
    publishedAt: `${post.date_gmt}Z`,
    updatedAt: `${post.modified_gmt}Z`,
    category: category ? { id: category.id, slug: category.slug, name: decodeEntities(category.name) } : null,
    tags: terms.filter((term) => term.taxonomy === "post_tag").map((term) => decodeEntities(term.name)),
    image: pickImage(post._embedded?.["wp:featuredmedia"]?.[0], imageMinWidth, title),
    credits: (post.meta?.nwd_credits ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    contentHtml: sanitizeHtml(post.content.rendered, contentSanitizeOptions)
  };
}

async function getPosts(params: Record<string, string | number>, imageMinWidth?: number) {
  const posts = await wpFetch<WpPost[]>("/wp/v2/posts", {
    _embed: "wp:featuredmedia,wp:term",
    _fields: postFields,
    ...params
  });
  return posts.map((post) => toBlogPost(post, imageMinWidth));
}

async function getCategoryId(slug: string) {
  const categories = await wpFetch<WpTerm[]>("/wp/v2/categories", { slug, _fields: "id,slug,name" });
  return categories[0]?.id ?? null;
}

export async function getPostsInCategory(slug: string, count: number, imageMinWidth?: number) {
  const categoryId = await getCategoryId(slug);
  if (!categoryId) return [];
  return getPosts({ categories: categoryId, per_page: count }, imageMinWidth);
}

// The big story on /blog: the post stuck to the top in WordPress, otherwise the newest NWD Story.
export async function getFeaturedPost() {
  const [sticky] = await getPosts({ sticky: "true", per_page: 1 }, 1000);
  if (sticky) return sticky;
  const [latestStory] = await getPostsInCategory("nwd-stories", 1, 1000);
  return latestStory ?? null;
}

export function getLatestPosts(count: number, excludeIds: number[] = []) {
  return getPosts({ per_page: count, ...(excludeIds.length ? { exclude: excludeIds.join(",") } : {}) });
}

export async function getPostBySlug(slug: string) {
  const [post] = await getPosts({ slug, per_page: 1 }, 1600);
  return post ?? null;
}

// The next older post in the same category, wrapping around to the newest one.
export async function getNextPost(post: BlogPost) {
  if (!post.category) return null;

  const params = { categories: post.category.id, per_page: 1, exclude: post.id };
  const [older] = await getPosts({ ...params, before: post.date });
  if (older) return older;
  const [newest] = await getPosts(params);
  return newest ?? null;
}

export function getFooterStories() {
  return getPostsInCategory("nwd-stories", 3, 180);
}

export async function getAllPostSummaries() {
  const posts = await wpFetch<Pick<WpPost, "slug" | "modified_gmt">[]>("/wp/v2/posts", {
    per_page: 100,
    _fields: "slug,modified_gmt"
  });
  return posts.map((post) => ({ slug: post.slug, updatedAt: `${post.modified_gmt}Z` }));
}

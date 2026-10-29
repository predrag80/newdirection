import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { GlobalFooter, GlobalHeader } from "../../components/global-sections";
import { toFooterStories } from "../blog-card";
import { blogRobots } from "../indexing";
import { getFooterStories, getNextPost, getPostBySlug } from "../wordpress";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { robots: blogRobots };

  const images = post.image
    ? [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }]
    : [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NWD Agency logo" }];

  return {
    title: post.title,
    description: post.lead || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: blogRobots,
    openGraph: {
      title: post.title,
      description: post.lead || post.excerpt,
      url: `/blog/${post.slug}`,
      siteName: "NWD Agency",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.lead || post.excerpt,
      images: images.map((image) => image.url)
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connection();
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [nextPost, footerStories] = await Promise.all([getNextPost(post), getFooterStories()]);

  const appUrl = (process.env.APP_URL || "https://nwdagency.com").replace(/\/$/, "");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.lead || post.excerpt,
    image: post.image ? [post.image.src] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", ") || undefined,
    mainEntityOfPage: `${appUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "NWD Agency", url: `${appUrl}/` },
    publisher: { "@type": "Organization", name: "NWD Agency", logo: `${appUrl}/assets/logo.svg` }
  };

  return (
    <main className="blog-page">
      <GlobalHeader />

      <article className="blog-article shell">
        <header className="blog-article-header">
          {post.category ? <p className="kicker">{post.category.name}</p> : null}
          {post.image ? (
            <Image
              className="blog-article-image"
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              sizes="(max-width: 1100px) 100vw, 974px"
              priority
            />
          ) : null}
          <h1 dangerouslySetInnerHTML={{ __html: post.titleHtml }} />
          {post.lead ? <p className="blog-article-lead">{post.lead}</p> : null}
        </header>

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {post.credits.length || post.tags.length ? (
          <div className="blog-article-meta">
            {post.credits.length ? (
              <div>
                <p className="kicker">Credits</p>
                <ul className="blog-credits">
                  {post.credits.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {post.tags.length ? (
              <div>
                <p className="kicker">Tags</p>
                <ul className="blog-tags">
                  {post.tags.map((tag) => (
                    <li key={tag}>#{tag.replace(/\s+/g, "")}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </article>

      {nextPost ? (
        <section className="blog-next shell" aria-label="Next story">
          <div className="blog-next-inner">
            <div>
              <p className="kicker">Next NWD story</p>
              <Link href={`/blog/${nextPost.slug}`}>
                <h2>
                  {nextPost.title} <span className="blog-next-arrow" aria-hidden="true">→</span>
                </h2>
              </Link>
            </div>
            {nextPost.image ? (
              <Link href={`/blog/${nextPost.slug}`} tabIndex={-1} aria-hidden="true">
                <Image
                  className="blog-next-image"
                  src={nextPost.image.src}
                  alt=""
                  width={nextPost.image.width}
                  height={nextPost.image.height}
                  sizes="380px"
                />
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <GlobalFooter stories={toFooterStories(footerStories)} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}

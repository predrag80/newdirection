import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { GlobalFooter, GlobalHeader } from "../components/global-sections";
import { BlogCard, toFooterStories } from "./blog-card";
import { BlogTrack } from "./blog-track";
import { blogRobots } from "./indexing";
import { getFeaturedPost, getFooterStories, getLatestPosts, getPostsInCategory } from "./wordpress";

const description =
  "NWD Stories, Reflections and Leadership compass: writing on brands, clarity and the practice of seeing differently.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  robots: blogRobots,
  openGraph: {
    title: "Blog | NWD Agency",
    description,
    url: "/blog",
    siteName: "NWD Agency",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NWD Agency logo" }],
    type: "website"
  }
};

const categorySections = [
  {
    slug: "reflections",
    title: "Reflections",
    subtitle: "Our writing on the art and practise of seeing differently."
  },
  {
    slug: "leadership-compass",
    title: "Leadership compass",
    subtitle: "Thoughts about how you see, decide and lead"
  }
];

export default async function BlogPage() {
  await connection();

  const featured = await getFeaturedPost();
  const [latest, sectionPosts, footerStories] = await Promise.all([
    getLatestPosts(6, featured ? [featured.id] : []),
    Promise.all(categorySections.map((section) => getPostsInCategory(section.slug, 8))),
    getFooterStories()
  ]);

  return (
    <main className="blog-page">
      <GlobalHeader />

      {featured ? (
        <section className="blog-featured shell">
          <div className="blog-featured-copy">
            {featured.category ? <p className="kicker">{featured.category.name}</p> : null}
            <h1 dangerouslySetInnerHTML={{ __html: featured.titleHtml }} />
            {featured.excerpt ? <p className="blog-featured-excerpt">{featured.excerpt}</p> : null}
            <Link className="blog-featured-link" href={`/blog/${featured.slug}`}>
              Read the full story
            </Link>
          </div>
          {featured.image ? (
            <Link className="blog-featured-image" href={`/blog/${featured.slug}`} tabIndex={-1} aria-hidden="true">
              <Image
                src={featured.image.src}
                alt=""
                width={featured.image.width}
                height={featured.image.height}
                sizes="(max-width: 900px) 100vw, 479px"
                priority
              />
            </Link>
          ) : null}
        </section>
      ) : (
        <section className="blog-featured blog-empty shell">
          <div className="blog-featured-copy">
            <p className="kicker">NWD Stories</p>
            <h1>Stories are on their way.</h1>
          </div>
        </section>
      )}

      {latest.length ? (
        <section className="blog-grid shell" aria-label="Latest stories">
          {latest.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </section>
      ) : null}

      {categorySections.map((section, index) =>
        sectionPosts[index].length ? (
          <section className="blog-section shell" key={section.slug} aria-labelledby={`blog-${section.slug}`}>
            <header className="blog-section-header">
              <h2 id={`blog-${section.slug}`}>{section.title}</h2>
              <p>{section.subtitle}</p>
            </header>
            <BlogTrack label={section.title}>
              {sectionPosts[index].map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </BlogTrack>
          </section>
        ) : null
      )}

      <GlobalFooter stories={toFooterStories(footerStories)} />
    </main>
  );
}

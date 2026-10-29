import Image from "next/image";
import Link from "next/link";
import type { FooterStory } from "../components/global-sections";
import type { BlogPost } from "./wordpress";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`}>
        <span className="blog-card-image">
          {post.image ? (
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              sizes="(max-width: 600px) 100vw, 380px"
            />
          ) : null}
        </span>
        <span className="blog-card-title">
          {post.title} <span className="blog-card-arrow" aria-hidden="true">→</span>
        </span>
        {post.excerpt ? <span className="blog-card-excerpt">{post.excerpt}</span> : null}
      </Link>
    </article>
  );
}

export function toFooterStories(posts: BlogPost[]): FooterStory[] {
  return posts.map((post) => ({
    href: `/blog/${post.slug}`,
    label: post.category?.name ?? "NWD Stories",
    title: post.title,
    image: post.image
  }));
}

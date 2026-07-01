"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { GlobalContact, GlobalFooter, GlobalHeader } from "../../components/global-sections";
import { useMobileCarouselAutoplay } from "../use-mobile-carousel-autoplay";

const programs = [
  "01 Strategic Clarity Audit",
  "02 Brand Direction Lock",
  "04 Brand Identity Build",
  "05 Brand Activation"
];

const impactCards = [
  {
    value: "10M+",
    label: "Brand Impressions",
    meta: "Campaign Performance Report",
    description:
      "Capone gained strong campaign visibility across Meta and YouTube, supporting the brand's move into a broader food culture space."
  },
  {
    value: "2.2M+",
    label: "Audience Reach",
    meta: "Campaign Performance Report",
    description:
      "The campaign reached a broad audience across awareness, retargeting and promoted content activities."
  },
  {
    value: "16%",
    label: "Growth Achieved",
    meta: "Client Sales Data",
    description:
      "Capone strengthened its market performance while building stronger relevance around premium dairy, food culture and everyday inspiration."
  }
];

type ShowcaseItem =
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      variant: "portrait" | "wide";
    }
  | {
      type: "video";
      src: string;
      label: string;
      variant: "video" | "video-portrait";
    };

const showcaseItems: ShowcaseItem[] = [
  {
    type: "image",
    src: "/assets/video/capone/capone cover w 1.png",
    alt: "Capone premium dairy brand visual",
    width: 346,
    height: 451,
    variant: "portrait"
  },
  {
    type: "video",
    src: "/assets/video/capone/Capone video 1.mp4",
    label: "Capone brand experience video 01",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/capone/Capone video 2.mp4",
    label: "Capone brand experience video 02",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/capone/VideoCapone03.mp4",
    label: "Capone brand experience video 03",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/capone/VideoCapone04.mp4",
    label: "Capone brand experience video 04",
    variant: "video-portrait"
  },
  {
    type: "video",
    src: "/assets/video/capone/VideoCapone05.mp4",
    label: "Capone brand experience video 05",
    variant: "video"
  }
];

const resetProjectScroll = () => {
  window.scrollTo(0, 0);
};

export default function CaponeProjectPage() {
  const showcaseTrackRef = useRef<HTMLDivElement>(null);
  const impactGridRef = useRef<HTMLDivElement>(null);

  useMobileCarouselAutoplay(impactGridRef, 4000);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const track = showcaseTrackRef.current;
    if (!track) return;

    let startX = 0;
    let startScrollLeft = 0;
    let activePointerId: number | null = null;
    let isDragging = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      activePointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;

      const dragDistance = event.clientX - startX;
      if (!isDragging && Math.abs(dragDistance) < 8) return;

      if (!isDragging) {
        isDragging = true;
        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      track.scrollLeft = startScrollLeft - dragDistance;
    };

    const endDrag = (event: PointerEvent) => {
      isDragging = false;
      activePointerId = null;
      track.classList.remove("is-dragging");
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("lostpointercapture", endDrag);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("lostpointercapture", endDrag);
    };
  }, []);

  useEffect(() => {
    const track = showcaseTrackRef.current;
    if (!track) return;

    const interval = window.setInterval(() => {
      if (document.hidden || track.classList.contains("is-dragging")) return;

      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      const isAtEnd = track.scrollLeft >= maxScrollLeft - 12;

      track.scrollTo({
        left: isAtEnd ? 0 : Math.min(track.scrollLeft + track.clientWidth * 0.78, maxScrollLeft),
        behavior: "smooth"
      });
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="project-page capone-project">
      <GlobalHeader />

      <section className="project-hero shell">
        <div className="project-hero-copy">
          <p className="kicker">Case Study 001</p>
          <h1>
            Italian craft and local
            <br />
            <em>freshness</em> at the table
          </h1>
          <p>
            What started as a premium dairy product became a lifestyle-led brand built around
            creativity, food culture and the joy of gathering around the table.
          </p>
          <span className="project-hero-mark" aria-hidden="true" />
        </div>
      </section>

      <section className="project-showcase shell" aria-label="Capone brand showcase">
        <div
          className="project-showcase-track"
          aria-label="Capone media carousel"
          ref={showcaseTrackRef}
        >
          {showcaseItems.map((item, index) => (
            <figure
              className={`project-showcase-card project-showcase-card-${item.variant}`}
              key={item.type === "image" ? item.src : item.label}
            >
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  priority={index === 0}
                />
              ) : (
                <video
                  className="project-showcase-video"
                  aria-label={item.label}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              )}
            </figure>
          ))}
        </div>
      </section>

      <section className="project-story shell">
        <aside className="project-details" aria-label="Project details">
          <div>
            <span>Programs</span>
            <ul>
              {programs.map((program) => (
                <li key={program}>{program}</li>
              ))}
            </ul>
          </div>
          <div>
            <span>Industry</span>
            <strong>Food / Dairy</strong>
          </div>
          <div>
            <span>Client</span>
            <strong>eKOFIL</strong>
          </div>
        </aside>

        <div className="project-story-copy">
          <p className="project-quote">
            Capone connects Italian mozzarella craft with fresh local ingredients. The opportunity
            was to build a brand that goes beyond product quality and becomes part of modern food
            culture, hosting and everyday inspiration.
          </p>
          <div className="project-body">
            <p>
              The mozzarella category was mostly shaped by functional messages, ingredients and
              price. For Capone, the challenge was not to prove quality alone, but to create
              relevance. The product needed a bigger role in people&apos;s lives and a clearer place
              around the table.
            </p>
            <p>
              Our work defined the strategic foundation for that shift. Positioning, identity,
              packaging direction, communication, website, campaigns and content were aligned around
              one idea: combining Italian craft and local freshness to inspire better meals, richer
              occasions and more meaningful food moments.
            </p>
          </div>
        </div>
      </section>

      <section className="project-impact shell" aria-label="Impact">
        <p className="kicker">Impact</p>
        <h2 className="project-impact-title">Metrics</h2>
        <div
          className={`project-impact-grid project-impact-grid-${impactCards.length}`}
          ref={impactGridRef}
        >
          {impactCards.map((item) => (
            <article key={item.label}>
              <div className="project-impact-stat">
                <strong>{item.value}</strong>
              </div>
              <h2>{item.label}</h2>
              <small className="project-impact-meta">
                {item.meta.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </small>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="project-next shell">
        <div>
          <p className="kicker">Next case study</p>
          <Link href="/projects/urda" aria-label="Open Urda case study" onClick={resetProjectScroll}>
            <h2>
              Urda
              <Image
                className="project-heading-arrow"
                src="/assets/arrow-vector.svg"
                alt=""
                width={34}
                height={26}
              />
            </h2>
          </Link>
        </div>
        <Link href="/projects/urda" aria-label="Open Urda case study" onClick={resetProjectScroll}>
          <Image
            className="project-next-brand"
            key="urda-cover"
            src="/assets/urda-cover.svg"
            alt="Urda"
            width={380}
            height={228}
          />
        </Link>
      </section>

      <GlobalContact />
      <GlobalFooter />
    </main>
  );
}

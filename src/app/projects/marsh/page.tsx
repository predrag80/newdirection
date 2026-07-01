"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { GlobalContact, GlobalFooter, GlobalHeader } from "../../components/global-sections";
import { ProjectCaseLink } from "../project-case-link";
import { useDeferredProjectNext, useProjectRouteTransition } from "../use-project-route-transition";
import { useMobileCarouselAutoplay } from "../use-mobile-carousel-autoplay";

const programs = [
  "01 Strategic Clarity Audit",
  "02 Brand Direction Lock",
  "06 Campaign Architecture",
  "07 Brand Activation"
];

const impactCards = [
  {
    value: "200+",
    label: "Business Leaders & Partners",
    meta: "Event Attendance / Client List",
    description:
      "A curated audience experienced a strategic journey designed to make Marsh's relevance clearer, more tangible and more engaging."
  },
  {
    value: "3",
    label: "Strategic Pillars Activated",
    meta: "Strategic Framework",
    description:
      "Risk, Strategy and People became the structure of the experience and the lens through which Marsh's value was presented."
  },
  {
    value: "1",
    label: "Unified Narrative System",
    meta: "Concept / Event Content",
    description:
      "Client voices, speeches, LED storytelling, stage flow and performance were connected through one strategic narrative."
  }
];

type ShowcaseItem =
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      variant: "portrait" | "wide" | "brand";
    }
  | {
      type: "video";
      src: string;
      label: string;
      variant: "video";
    };

const showcaseItems: ShowcaseItem[] = [
  {
    type: "image",
    src: "/assets/video/marsh/Rectangle 70.png",
    alt: "Marsh brand experience cover",
    width: 346,
    height: 450,
    variant: "portrait"
  },
  {
    type: "video",
    src: "/assets/video/marsh/MarshVideo01.mp4",
    label: "Marsh brand experience video 01",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/marsh/MarshVideo02.mp4",
    label: "Marsh brand experience video 02",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/marsh/MarshVideo03.mp4",
    label: "Marsh brand experience video 03",
    variant: "video"
  }
];

export default function MarshProjectPage() {
  const showcaseTrackRef = useRef<HTMLDivElement>(null);
  const impactGridRef = useRef<HTMLDivElement>(null);

  useMobileCarouselAutoplay(impactGridRef, 4000);
  useProjectRouteTransition();
  const { isDeferredProjectNext, projectNextRef } = useDeferredProjectNext();

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
    <main className="project-page marsh-project">
      <GlobalHeader />

      <section className="project-hero shell">
        <div className="project-hero-copy">
          <p className="kicker">Case Study 003</p>
          <h1>
            A promise people
            <br />
            <em>could</em> feel
          </h1>
          <p>
            Marsh had the expertise. The challenge was making its promise something people could
            understand, experience and believe in.
          </p>
          <span className="project-hero-mark" aria-hidden="true" />
        </div>
      </section>

      <section className="project-showcase shell" aria-label="Marsh brand experience showcase">
        <div
          className="project-showcase-track"
          aria-label="Marsh media carousel"
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
            <strong>Risk Advisory / Professional Services</strong>
          </div>
          <div>
            <span>Client</span>
            <strong>Marsh Adria</strong>
          </div>
        </aside>

        <div className="project-story-copy">
          <p className="project-quote">
            The event needed one clear strategic spine. Risk, Strategy and People had to guide how
            people understood Marsh, felt its relevance and connected it to their own decisions.
          </p>
          <div className="project-body">
            <p>
              The experience was built around Know More. Grow More. Instead of a standard corporate
              agenda, the goal was to turn the Marsh platform into a clear and meaningful journey.
              Risk, Strategy and People became the structure that guided the audience through the
              value Marsh brings to clients.
            </p>
            <p>
              Our work connected the strategic framework before, during and after the event. Client
              voices, keynote stories, speeches, LED content, stage flow and performance were shaped
              to make Marsh&apos;s relevance clear and keep the audience engaged. The result was a
              brand experience that turned the Marsh story into something people could understand,
              feel and apply.
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
                {item.meta.split(" / ").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </small>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`project-next shell${isDeferredProjectNext ? " project-next-deferred" : ""}`}
        ref={projectNextRef}
      >
        <div>
          <p className="kicker">Next case study</p>
          <ProjectCaseLink href="/projects/capone" aria-label="Open Capone case study">
            <h2>
              Capone
              <Image
                className="project-heading-arrow"
                src="/assets/arrow-vector.svg"
                alt=""
                width={34}
                height={26}
              />
            </h2>
          </ProjectCaseLink>
        </div>
        <ProjectCaseLink href="/projects/capone" aria-label="Open Capone case study" navigateDelayMs={220}>
          <Image
            className="project-next-brand"
            key="capone-vector"
            src="/assets/capone-vector.png"
            alt="Capone"
            width={380}
            height={220}
          />
        </ProjectCaseLink>
      </section>

      <GlobalContact />
      <GlobalFooter />
    </main>
  );
}

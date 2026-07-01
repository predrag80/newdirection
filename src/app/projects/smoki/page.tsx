"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { GlobalContact, GlobalFooter, GlobalHeader } from "../../components/global-sections";
import { ProjectCaseLink } from "../project-case-link";
import { useDeferredProjectNext, useProjectRouteTransition } from "../use-project-route-transition";
import { useMobileCarouselAutoplay } from "../use-mobile-carousel-autoplay";

const programs = [
  "01 Strategic Clarity Audit",
  "06 Campaign Architecture",
  "07 Brand Activation"
];

const impactCards = [
  {
    value: "11",
    label: "Markets connected",
    meta: "Project Rollout Scope / Client Confirmation",
    description:
      "One activation structure designed to connect packaging, retail, digital participation and campaign communication across markets."
  },
  {
    value: "1",
    label: "Participation system",
    meta: "Campaign Architecture / Production Files",
    description:
      "One system linking pack, QR entry, avatar creation, team choice, rewards and social sharing into a single participation flow."
  },
  {
    value: "3",
    label: "Pack entry points",
    meta: "Packaging Development / Production Files",
    description:
      "Three pack formats turned into entry points between physical attention and digital participation."
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
      variant: "video";
    };

const showcaseItems: ShowcaseItem[] = [
  {
    type: "image",
    src: "/assets/video/smoki/Rectangle 70.png",
    alt: "Smoki football activation key visual",
    width: 346,
    height: 450,
    variant: "portrait"
  },
  {
    type: "video",
    src: "/assets/video/smoki/SmokiCard.mp4",
    label: "Smoki campaign card video",
    variant: "video"
  },
  {
    type: "image",
    src: "/assets/video/smoki/SmokiPackaging.png",
    alt: "Smoki packaging activation formats",
    width: 534,
    height: 450,
    variant: "wide"
  },
  {
    type: "video",
    src: "/assets/video/smoki/SmokiScreens.mp4",
    label: "Smoki digital participation screens video",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/smoki/SmokiMobile.mp4",
    label: "Smoki mobile participation video",
    variant: "video"
  }
];

export default function SmokiProjectPage() {
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
    <main className="project-page smoki-project">
      <GlobalHeader />

      <section className="project-hero shell">
        <div className="project-hero-copy">
          <p className="kicker">Case Study 001</p>
          <h1>
            Turning attention
            <br />
            <em>into</em> participation
          </h1>
          <p>
            What started as a football activation became a connected participation system linking
            packaging, retail, digital play and social behavior.
          </p>
          <span className="project-hero-mark" aria-hidden="true" />
        </div>
      </section>

      <section className="project-showcase shell" aria-label="Smoki campaign showcase">
        <div
          className="project-showcase-track"
          aria-label="Smoki media carousel"
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
            <strong>Snacks / FMCG</strong>
          </div>
          <div>
            <span>Client</span>
            <strong>
              Stark, Atlantic Group
              <br />
              East Adriatic Region
            </strong>
          </div>
        </aside>

        <div className="project-story-copy">
          <p className="project-quote">
            Smoki wanted to stand out during football season by connecting packaging, retail,
            digital participation and social engagement into one clear participation system people
            could enter, understand and repeat.
          </p>
          <div className="project-body">
            <p>
              Major football events create a flood of campaigns competing for the same attention.
              For Smoki, the challenge was not only visibility, but participation. Packaging, retail
              communication, digital experiences and campaign mechanics needed one clear role inside
              one connected flow. The opportunity was to turn a football moment into a recognizable
              Smoki cheering ritual.
            </p>
            <p>
              Our work connected activation logic, user journey, messaging hierarchy and rollout
              structure around one participation flow. Packaging became the entry point. Digital
              experiences continued the journey. Retail, social and product communication started
              reinforcing one another across markets.
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
          <ProjectCaseLink href="/projects/marsh" aria-label="Open Marsh case study">
            <h2>
              Marsh
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
        <ProjectCaseLink href="/projects/marsh" aria-label="Open Marsh case study" navigateDelayMs={220}>
          <Image
            className="project-next-brand"
            key="marsh-vector"
            src="/assets/march.svg"
            alt="Marsh"
            width={400}
            height={230}
          />
        </ProjectCaseLink>
      </section>

      <GlobalContact />
      <GlobalFooter />
    </main>
  );
}

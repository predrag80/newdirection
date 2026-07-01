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
  "04 Brand Identity Build",
  "07 Brand Activation"
];

const impactCards = [
  {
    value: "35%",
    label: "Sales growth",
    meta: "Client Sales Data",
    description:
      "Growth continued while Urda gained a clearer role in healthy routines and modern food culture."
  },
  {
    value: "4M+",
    label: "Content Views",
    meta: "Digital Analytics",
    description:
      "Educational, recipe and creator-led content expanded Urda beyond its traditional audience."
  },
  {
    value: "130+",
    label: "Creators Activated",
    meta: "Influencer / UGC Ecosystem",
    description:
      "Nutritionists, trainers and lifestyle creators helped place Urda inside contemporary healthy food culture."
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
      mimeType?: string;
    };

const showcaseItems: ShowcaseItem[] = [
  {
    type: "image",
    src: "/assets/video/urda/cover.png",
    alt: "Urda healthy food culture campaign cover",
    width: 346,
    height: 450,
    variant: "portrait"
  },
  {
    type: "video",
    src: "/assets/video/urda/03_URDA_KV_VIDEO_c0bc5b9d42.mp4",
    label: "Urda key visual video",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/urda/UrdaVideo01.mp4",
    label: "Urda brand system video 01",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/urda/UrdaVideo03.mp4",
    label: "Urda brand system video 03",
    variant: "video"
  },
  {
    type: "video",
    src: "/assets/video/urda/UrdaVideo02.mp4",
    label: "Urda brand system video 02",
    variant: "video"
  }
];

export default function UrdaProjectPage() {
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
    <main className="project-page urda-project">
      <GlobalHeader />

      <section className="project-hero shell">
        <div className="project-hero-copy">
          <p className="kicker">Case Study 001</p>
          <h1>
            Urda claimed
            <br />
            <em>healthy</em> food culture
          </h1>
          <p>
            A traditional dairy product found a new role in modern food culture through strategy,
            education, community and participation.
          </p>
          <span className="project-hero-mark" aria-hidden="true" />
        </div>
      </section>

      <section className="project-showcase shell" aria-label="Urda brand showcase">
        <div
          className="project-showcase-track"
          aria-label="Urda media carousel"
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
                  <source src={item.src} type={item.mimeType ?? "video/mp4"} />
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
            <strong>Mlekara Homolje, Ekofil</strong>
          </div>
        </aside>

        <div className="project-story-copy">
          <p className="project-quote">
            Urda was familiar, but underused. As healthy eating and protein-rich routines grew, the
            opportunity was not to explain the product. It was to make it part of daily choice.
          </p>
          <div className="project-body">
            <p>
              Consumers did not need to discover Urda. They needed a reason to choose it more often.
              Despite its tradition and nutritional value, the product lacked a clear role in modern
              food habits, protein-rich meals and healthy routines.
            </p>
            <p>
              NWD built the growth system around that shift. Strategy, positioning, identity,
              packaging, content, creators and community activation made Urda relevant to modern
              food culture. The result was not just visibility, but new reasons to use, share and
              choose it.
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
          <ProjectCaseLink href="/projects/smoki" aria-label="Open Smoki case study">
            <h2>
              Smoki
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
        <ProjectCaseLink href="/projects/smoki" aria-label="Open Smoki case study" navigateDelayMs={220}>
          <Image
            className="project-next-brand"
            key="smoki-vector"
            src="/assets/smoki-vector.svg"
            alt="Smoki"
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

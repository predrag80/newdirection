"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ContactForm } from "./components/contact-form";
import { GlobalFooter, GlobalHeader } from "./components/global-sections";

const methods = [
  {
    number: "01",
    title: "Lock",
    description: "Define what matters and remove what doesn't. Decisions become clear.",
    services: ["Strategic Clarity Audit", "Brand Direction Lock"],
    cta: "Start with clarity",
    programIndex: 0
  },
  {
    number: "02",
    title: "Build",
    description: "Direction turns into systems that hold. Teams stop relying on interpretation.",
    services: ["Growth System", "Brand Identity Build", "Portfolio Structure"],
    cta: "Build your growth system",
    programIndex: 2
  },
  {
    number: "03",
    title: "Scale",
    description: "The system becomes visible, consistent and scalable. Growth starts moving as one.",
    services: ["Campaign Architecture", "Brand Activation"],
    cta: "Create your campaign",
    programIndex: 5
  }
];

const programs = [
  {
    title: "Strategic Clarity Audit",
    description: "A structured first step before larger strategic brand and growth decisions.",
    includes: ["Brand & Market Review", "Growth & Perception Review", "Next Phase Mapping"],
    solves: ["Unclear market position", "Limited audience insight", "Misaligned brand direction", "Unclear next priorities"]
  },
  {
    title: "Brand Direction Lock",
    description: "Creates clearer positioning, stronger differentiation and consistent communication.",
    includes: ["Positioning framework", "Brand narrative", "Decision principles"],
    solves: ["Weak differentiation", "Inconsistent messaging", "Unclear brand choices"],
    cta: "Define your direction"
  },
  {
    title: "Growth System",
    description: "Turns fragmented growth efforts into one connected system.",
    includes: ["Growth architecture", "Channel roles", "Measurement framework"],
    solves: ["Disconnected initiatives", "Competing priorities", "Unclear growth logic"],
    cta: "Build your growth system"
  },
  {
    title: "Brand Identity Build",
    description: "Makes brands easier to recognize, remember and align around.",
    includes: ["Identity system", "Visual principles", "Application toolkit"],
    solves: ["Low recognition", "Visual inconsistency", "Unclear expression"],
    cta: "Build your identity"
  },
  {
    title: "Portfolio Structure",
    description: "Clarifies product architecture, portfolio logic and brand structure.",
    includes: ["Portfolio audit", "Architecture model", "Naming logic"],
    solves: ["Product overlap", "Confusing hierarchy", "Unclear portfolio roles"],
    cta: "Structure your portfolio"
  },
  {
    title: "Campaign Architecture",
    description: "Creates campaigns designed to scale with consistency.",
    includes: ["Campaign platform", "Content system", "Channel framework"],
    solves: ["One-off campaigns", "Inconsistent execution", "Limited scalability"],
    cta: "Create your campaign"
  },
  {
    title: "Brand Activation",
    description: "Turns strategy into visible brand behavior.",
    includes: ["Activation roadmap", "Experience principles", "Launch system"],
    solves: ["Strategy without action", "Fragmented experiences", "Weak internal adoption"],
    cta: "Move into activation"
  }
];

const trustedBrands = [
  { name: "Finish", src: "/assets/brands/finish 2.svg", width: 61, height: 30 },
  { name: "Vanish", src: "/assets/brands/vanish 2.svg", width: 59, height: 46 },
  { name: "Air Wick", src: "/assets/brands/airwick 2.svg", width: 50, height: 50 },
  { name: "Durex", src: "/assets/brands/durex 2.svg", width: 74, height: 21 },
  { name: "Duck", src: "/assets/brands/duck 2.svg", width: 48, height: 49 },
  { name: "Raid", src: "/assets/brands/raid 2.svg", width: 34, height: 35 },
  { name: "Autan", src: "/assets/brands/autan 2.svg", width: 50, height: 29 },
  { name: "Pronto", src: "/assets/brands/pronto 3.svg", width: 39, height: 48 },
  { name: "Ekofil", src: "/assets/brands/ekofil 2.svg", width: 83, height: 23, scale: 0.76 },
  { name: "URDA", src: "/assets/brands/urda 2.svg", width: 53, height: 26, scale: 0.82 },
  { name: "Mlekara Homolje", src: "/assets/brands/homolje 2.svg", width: 63, height: 31 },
  { name: "Capone", src: "/assets/brands/capone 2.svg", width: 62, height: 28 },
  { name: "Smoki", src: "/assets/brands/smoki 2.svg", width: 71, height: 31 },
  { name: "Štark", src: "/assets/brands/stark 2.svg", width: 60, height: 33 },
  { name: "Marsh McLennan", src: "/assets/brands/marsh 2.svg", width: 81, height: 18, scale: 0.76 }
];

const heroWords = ["growing", "scaling", "evolving", "ambitious", "emerging"];

const resetProjectScroll = () => {
  window.scrollTo(0, 0);
};

const work = [
  {
    src: "/assets/SmokiCover01a.jpg",
    alt: "Smoki football campaign artwork",
    href: "/projects/smoki",
    index: "001",
    title: "SMOKI",
    summary: "Every brand wanted attention. Smoki built participation.",
    meta: "Snacks / FMCG"
  },
  {
    src: "/assets/MarshCover01a.jpg",
    alt: "Marsh brand experience cover",
    href: "/projects/marsh",
    index: "002",
    title: "MARSH",
    summary: "A promise people could understand and feel.",
    meta: "Risk Advisory / Professional Services"
  },
  {
    src: "/assets/CaponeCoverImage01.jpg",
    alt: "Capone premium dairy brand visual",
    href: "/projects/capone",
    index: "003",
    title: "CAPONE",
    summary: "Italian craft and local freshness became a lifestyle-led brand.",
    meta: "Food / Dairy"
  },
  {
    src: "/assets/video/urda/cover.png",
    alt: "Urda healthy food culture campaign cover",
    href: "/projects/urda",
    index: "004",
    title: "URDA",
    summary: "A traditional product claimed a new role in healthy food culture.",
    meta: "Food / Dairy"
  }
];

const team = [
  {
    src: "/assets/team-marjan.webp",
    name: "Marjan Stanišić",
    role: "Co-Founder\nBrand Direction & Growth",
    bio: "Defines strategic brand direction and connects positioning, growth logic, communication systems and business integration into clear long-term frameworks.",
    experience: "Finish / Vanish / Air Wick / Durex / Strepsils / Nurofen / Gaviscon / Pepsi / Opel / Iveco / Smoki / Štark / Marsh"
  },
  {
    src: "/assets/team-bojan.webp",
    name: "Bojan Šašić",
    role: "Co-Founder\nStrategic Delivery & Operations",
    bio: "Leads project structure, campaign coordination and delivery flow across multidisciplinary brand, media and communication projects.",
    experience: "Reckitt / Atlantic grupa / Siemens / SC Johnson / Comtrade Distribution / Marsh / Dunav osiguranje / Nivea / Molson Coors / Ekofil / Belgrade Fashion Week"
  },
  {
    src: "/assets/team-srdjana.webp",
    name: "Srđana Stanišić",
    role: "Creative Strategy\n& Narratives",
    bio: "Develops creative strategy, brand narratives, and communication systems that help growing brands scale with clarity and turn strategic direction into meaningful brand expression.",
    experience: "Metalac / Pampers / Ariel / Lenor / Gillette / Venus / Pantene / Old Spice / Urda Homolje / Capone / Marsh / Smoki / Štark"
  },
  {
    src: "/assets/team-dejan.webp",
    name: "Dejan Ćirović",
    role: "Design Systems\n& Art Direction",
    bio: "Shapes visual identity systems and turns strategic direction into distinctive, scalable and consistent brand communication.",
    experience: "Reckitt / Coca-Cola / Mars / Nestlé / P&G / Mondelēz International / Štark / PepsiCo / Ferrero / Hyundai / Chery / Toyota / Siemens / Epson / Marsh / Delhaize / McDonald’s / Mercator / EnergyPact"
  },
  {
    src: "/assets/team-milica.webp",
    name: "Milica Aleksić",
    role: "Digital Campaign Strategy\n& Performance",
    bio: "Leads digital campaign systems, paid media strategy, lead generation, CRM automation and full-funnel performance across B2B and B2C growth initiatives.",
    experience: "QORE / Altitude Pay / Oblak Tehnologije / PIA Media / HelloSmile / WWF"
  },
  {
    src: "/assets/team-predrag.webp",
    name: "Predrag Vučković",
    role: "Technology Systems\n& Digital Experience",
    bio: "Builds scalable digital systems, front-end architecture and technical execution frameworks across modern web platforms.",
    experience: "ICATREX / TwogNation / Dav El / BostonCoach / GroundLink / LimoAnywhere"
  }
];

export default function Home() {
  const [activeProgram, setActiveProgram] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeDirectionLine, setActiveDirectionLine] = useState(0);
  const [isHeroVideoMuted, setIsHeroVideoMuted] = useState(true);
  const [workScrollState, setWorkScrollState] = useState({ canGoBack: false, canGoForward: false });
  const [teamScrollState, setTeamScrollState] = useState({ canGoBack: false, canGoForward: false });
  const clarityRef = useRef<HTMLElement>(null);
  const directionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const workTrackRef = useRef<HTMLDivElement>(null);
  const teamTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      setActiveDirectionLine((index) => (index + 1) % 3);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let currentProgress = 0;
    let targetProgress = 0;

    const getTargetProgress = () => Math.min(1, Math.max(0, (window.scrollY - 20) / 760));

    const applyMotion = (progress: number) => {
      const root = document.documentElement;
      root.style.setProperty("--scroll-progress", progress.toFixed(3));
      root.style.setProperty("--stage-scale", (1.12 - progress * 0.12).toFixed(3));
      root.style.setProperty("--stage-rotate", "0deg");
      root.style.setProperty("--stage-radius", "18px");

      const isMobile = window.innerWidth <= 900;
      const stageWidth = isMobile ? 76 + progress * 22 : 42 + progress * 52;
      root.style.setProperty("--stage-width", `${stageWidth}vw`);
      root.style.setProperty("--stage-y", `${progress * 120}px`);

      const direction = directionRef.current;
      if (direction) {
        const shouldDisableKeyParallax = window.innerWidth <= 600;
        if (shouldDisableKeyParallax) {
          root.style.setProperty("--key-one-y", "0px");
          root.style.setProperty("--key-two-y", "0px");
          root.style.setProperty("--key-three-y", "0px");
          root.style.setProperty("--key-four-y", "0px");
          return;
        }

        const rect = direction.getBoundingClientRect();
        const travel = window.innerHeight * 0.7 + rect.height * 0.75;
        const sectionProgress = Math.min(
          1,
          Math.max(0, (window.innerHeight * 1.15 - rect.top) / travel)
        );
        const offset = sectionProgress - 0.5;
        const motionScale = isMobile ? 0.36 : 1;

        root.style.setProperty("--key-one-y", `${offset * -245 * motionScale}px`);
        root.style.setProperty("--key-two-y", `${offset * 185 * motionScale}px`);
        root.style.setProperty("--key-three-y", `${offset * 300 * motionScale}px`);
        root.style.setProperty("--key-four-y", `${offset * -210 * motionScale}px`);
      }
    };

    const animateMotion = () => {
      currentProgress += (targetProgress - currentProgress) * 0.12;

      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
      }

      applyMotion(currentProgress);

      if (currentProgress !== targetProgress) {
        animationFrame = window.requestAnimationFrame(animateMotion);
      } else {
        animationFrame = 0;
      }
    };

    const updateMotion = () => {
      targetProgress = getTargetProgress();

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateMotion);
      }
    };

    const onScroll = () => {
      updateMotion();
    };

    targetProgress = getTargetProgress();
    currentProgress = targetProgress;
    applyMotion(currentProgress);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const clarity = clarityRef.current;
    const direction = directionRef.current;
    const downLine = direction?.querySelector<HTMLElement>(".down-line");
    if (!clarity || !direction || !downLine) return;

    const clarityObserver = new IntersectionObserver(
      ([entry]) => {
        clarity.classList.toggle("is-visible", entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    const directionObserver = new IntersectionObserver(
      ([entry]) => {
        direction.classList.toggle("is-visible", entry.isIntersecting);
      },
      { threshold: 0.02 }
    );

    const downLineObserver = new IntersectionObserver(
      ([entry]) => {
        downLine.classList.toggle("is-visible", entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    clarityObserver.observe(clarity);
    directionObserver.observe(direction);
    downLineObserver.observe(downLine);
    return () => {
      clarityObserver.disconnect();
      directionObserver.disconnect();
      downLineObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-revealed", entry.isIntersecting);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.18
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 200);

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTop);
  }, []);

  useEffect(() => {
    const getScrollOffset = (targetId: string) =>
      targetId === "team-track" || targetId === "contact" ? 150 : 0;
    const scrollToTarget = (targetId: string) => {
      const target = document.getElementById(targetId);
      if (!target) return false;

      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - getScrollOffset(targetId),
        behavior: "smooth"
      });
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      return true;
    };

    const storedTarget = window.sessionStorage.getItem("nwd-scroll-target");
    if (storedTarget) {
      window.sessionStorage.removeItem("nwd-scroll-target");
      window.setTimeout(() => scrollToTarget(storedTarget), 80);
    }

    const handleInternalLink = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const targetId = anchor?.getAttribute("href")?.slice(1);
      if (!anchor || !targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      scrollToTarget(targetId);
    };

    document.addEventListener("click", handleInternalLink);
    return () => document.removeEventListener("click", handleInternalLink);
  }, []);

  useEffect(() => {
    const tracks = [workTrackRef.current, teamTrackRef.current].filter(
      (track): track is HTMLDivElement => Boolean(track)
    );
    const cleanups = tracks.map((track) => {
      let startX = 0;
      let startScrollLeft = 0;
      let activePointerId: number | null = null;
      let isDragging = false;
      let didDrag = false;

      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;

        activePointerId = event.pointerId;
        didDrag = false;
        startX = event.clientX;
        startScrollLeft = track.scrollLeft;
      };

      const onPointerMove = (event: PointerEvent) => {
        if (activePointerId !== event.pointerId) return;

        const dragDistance = event.clientX - startX;
        if (!isDragging && Math.abs(dragDistance) < 8) return;

        if (!isDragging) {
          isDragging = true;
          didDrag = true;
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

      const onClick = (event: MouseEvent) => {
        if (!didDrag) return;

        event.preventDefault();
        event.stopPropagation();
        window.setTimeout(() => {
          didDrag = false;
        }, 0);
      };

      track.addEventListener("pointerdown", onPointerDown);
      track.addEventListener("pointermove", onPointerMove);
      track.addEventListener("pointerup", endDrag);
      track.addEventListener("pointercancel", endDrag);
      track.addEventListener("lostpointercapture", endDrag);
      track.addEventListener("click", onClick, true);

      return () => {
        track.removeEventListener("pointerdown", onPointerDown);
        track.removeEventListener("pointermove", onPointerMove);
        track.removeEventListener("pointerup", endDrag);
        track.removeEventListener("pointercancel", endDrag);
        track.removeEventListener("lostpointercapture", endDrag);
        track.removeEventListener("click", onClick, true);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const track = workTrackRef.current;
    if (!track) return;

    const updateWorkControls = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      setWorkScrollState({
        canGoBack: track.scrollLeft > 2,
        canGoForward: track.scrollLeft < maxScroll - 2
      });
    };

    updateWorkControls();
    const timeout = window.setTimeout(updateWorkControls, 300);
    const resizeObserver = new ResizeObserver(updateWorkControls);

    track.addEventListener("scroll", updateWorkControls, { passive: true });
    window.addEventListener("resize", updateWorkControls);
    resizeObserver.observe(track);

    return () => {
      window.clearTimeout(timeout);
      track.removeEventListener("scroll", updateWorkControls);
      window.removeEventListener("resize", updateWorkControls);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const track = workTrackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      if (document.hidden || track.classList.contains("is-dragging")) return;

      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      if (maxScrollLeft <= 2) return;

      const isAtEnd = track.scrollLeft >= maxScrollLeft - 12;
      track.scrollTo({
        left: isAtEnd ? 0 : Math.min(track.scrollLeft + track.clientWidth * 0.72, maxScrollLeft),
        behavior: "smooth"
      });
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const track = teamTrackRef.current;
    if (!track) return;

    const updateTeamControls = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      setTeamScrollState({
        canGoBack: track.scrollLeft > 2,
        canGoForward: track.scrollLeft < maxScroll - 2
      });
    };

    updateTeamControls();
    const timeout = window.setTimeout(updateTeamControls, 300);
    const resizeObserver = new ResizeObserver(updateTeamControls);

    track.addEventListener("scroll", updateTeamControls, { passive: true });
    window.addEventListener("resize", updateTeamControls);
    resizeObserver.observe(track);

    return () => {
      window.clearTimeout(timeout);
      track.removeEventListener("scroll", updateTeamControls);
      window.removeEventListener("resize", updateTeamControls);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollTrack = (track: HTMLDivElement | null, direction: number) => {
    track?.scrollBy({ left: direction * track.clientWidth * 0.72, behavior: "smooth" });
  };

  const toggleHeroVideoSound = () => {
    const video = heroVideoRef.current;
    if (!video) return;

    const shouldMute = !video.muted;
    video.muted = shouldMute;
    video.volume = shouldMute ? 0 : 0.8;
    setIsHeroVideoMuted(shouldMute);

    if (!shouldMute && video.paused) {
      void video.play();
    }
  };

  const openProgram = (programIndex: number) => {
    setSelectedProgram(programIndex);
    setActiveProgram(programIndex);

    window.setTimeout(() => {
      const title = document.getElementById(`program-title-${programIndex}`);
      if (!title) return;

      window.scrollTo({
        top: window.scrollY + title.getBoundingClientRect().top - 32,
        behavior: "smooth"
      });
    }, 460);
  };

  return (
    <main>
      <GlobalHeader />

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="kicker">NWD Brand Growth System</p>
          <h1>
            Strategic clarity <em>for</em>
            <br />
            <span className="hero-word-line">
              <span className="hero-rotating-word">{heroWords[0]}</span>
              <span>brands.</span>
            </span>
          </h1>
          <p className="hero-intro">
            New Direction partners with growing brands to define direction, build systems, and make
            growth simpler.
          </p>
          <a className="pill-button" href="#programs">
            <span>See how it works</span>
            <Image src="/assets/arrow.svg" alt="" width={29} height={23} />
          </a>
        </div>
        <a className="this-way" href="#hero-video">
          <span>&#8601;</span> This way
        </a>
        <div className="hero-stage" id="hero-video" aria-label="New Direction showreel">
          <video
            autoPlay
            muted={isHeroVideoMuted}
            loop
            playsInline
            preload="metadata"
            ref={heroVideoRef}
            onVolumeChange={(event) => setIsHeroVideoMuted(event.currentTarget.muted)}
          >
            <source src="/assets/INTRO.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-controls" aria-label="Video controls">
            <button
              className="hero-video-control"
              type="button"
              aria-label={isHeroVideoMuted ? "Turn sound on" : "Turn sound off"}
              onClick={toggleHeroVideoSound}
            >
              <span
                className={`hero-video-icon ${
                  isHeroVideoMuted ? "hero-video-icon-muted" : "hero-video-icon-sound"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </section>

      <section className="trusted-brands" aria-labelledby="trusted-brands-title" data-reveal="brands">
        <p className="kicker" id="trusted-brands-title">
          Trusted by
        </p>
        <div className="trusted-brands-track">
          {[...trustedBrands, ...trustedBrands].map((brand, index) => (
            <div
              className="trusted-brand"
              key={`${brand.name}-${index}`}
              style={
                {
                  "--brand-width": `${brand.width * 2.9 * (brand.scale ?? 1)}px`
                } as CSSProperties
              }
              aria-hidden={index >= trustedBrands.length}
            >
              <Image
                src={brand.src}
                alt={index < trustedBrands.length ? `${brand.name} logo` : ""}
                width={brand.width}
                height={brand.height}
              />
            </div>
          ))}
        </div>
      </section>

      <section
        className="direction shell"
        id="direction"
        ref={directionRef}
        data-reveal="stack"
      >
        <p className="kicker">Define the direction</p>
        <h2>Complexity is usually a lack of direction.</h2>
        <div className="direction-content">
          <div className="keycap key-one" aria-hidden="true">
            <Image src="/assets/Arrow_angle (black).png" alt="" width={156} height={156} />
          </div>
          <div className="keycap key-two" aria-hidden="true">
            <Image src="/assets/Arrow_angle (color).png" alt="" width={116} height={104} />
          </div>
          <div className="keycap key-three" aria-hidden="true">
            <Image src="/assets/Arrow_angle (white).png" alt="" width={160} height={144} />
          </div>
          <div className="keycap key-four" aria-hidden="true">
            <Image
              src="/assets/Stuck out tongue_angle (black).png"
              alt=""
              width={188}
              height={177}
            />
          </div>
          <p>
            Things don&apos;t break all at once.
            <br />
            They start to break when direction is unclear.
            <br />
            <br />
            As brands grow, decisions multiply.
            <br />
            Teams move in different directions.
            <br />
            Ideas compete. Execution fragments.
            <br />
            <br />
            What once felt clear begins to blur.
          </p>
        </div>
        <a
          className="down-line"
          href="#clarity"
          aria-label="Continue to Clarity changes how everything moves"
        >
          <span />
        </a>
      </section>

      <section className="clarity-band" id="clarity" ref={clarityRef}>
        <h2>Clarity changes how everything moves.</h2>
        <a className="start-keys" href="#method" aria-label="Start with the method">
          <span className="clarity-key clarity-arrow">
            <Image src="/assets/clarity-arrow.png" alt="" width={83} height={83} />
          </span>
          <span className="clarity-key clarity-start">
            <Image
              className="clarity-start-default"
              src="/assets/clarity-start-default.png"
              alt=""
              width={330}
              height={330}
            />
            <Image
              className="clarity-start-hover"
              src="/assets/clarity-start-hover.png"
              alt=""
              width={330}
              height={330}
            />
          </span>
        </a>
      </section>

      <section className="method shell" id="method" data-reveal="stack">
        <p className="kicker">The method</p>
        <h2>
          Defined,
          <br />
          <em>not</em> decorated.
        </h2>
        <p className="section-lead">Once direction is clear, everything else can follow.</p>
        <div className="method-grid">
          {methods.map((item) => (
            <article className="method-card" key={item.number}>
              <span className="corner-arrow" aria-hidden="true">
                <Image src="/assets/arrow-method.svg" alt="" width={30} height={30} />
              </span>
              <span className="method-number">
                <span className="slashed-zero">0</span>
                {item.number.slice(1)}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>
                {item.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              <a
                href={`#program-title-${item.programIndex}`}
                onClick={(event) => {
                  event.preventDefault();
                  openProgram(item.programIndex);
                }}
              >
                <Image
                  className="explore-clarity-icon"
                  src="/assets/explore-clarity.svg"
                  alt=""
                  width={12}
                  height={12}
                />
                {item.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="programs shell" id="programs">
        <div className="programs-intro" data-reveal="split">
          <div>
            <p className="kicker">NWD Programs</p>
            <h2>7 Programs designed to build modern brands.</h2>
          </div>
          <div className="programs-copy">
            <p>The NWD programs are designed to solve different stages of brand growth.</p>
            <p>
              Some brands need clarity. Some need stronger systems. Some need better alignment
              between strategy, identity and execution.
            </p>
            <p>Each program can work independently or as part of the NWD Brand Growth System.</p>
          </div>
        </div>
        <ol className="program-list">
          {programs.map((program, index) => (
            <li
              className={activeProgram === index ? "is-active" : ""}
              id={`program-${index}`}
              key={program.title}
              onMouseEnter={() => {
                if (selectedProgram === null) setActiveProgram(index);
              }}
              onMouseLeave={() => {
                if (selectedProgram === null) setActiveProgram(null);
              }}
            >
              <span className="program-number">
                <span className="program-zero">0</span>
                {index + 1}
              </span>
              <h3 id={`program-title-${index}`}>{program.title}</h3>
              <p className="program-summary">{program.description}</p>
              <button
                type="button"
                aria-expanded={activeProgram === index}
                aria-label={`Show details for ${program.title}`}
                onClick={() => {
                  if (activeProgram === index) {
                    setSelectedProgram(null);
                    setActiveProgram(null);
                    return;
                  }

                  setSelectedProgram(index);
                  setActiveProgram(index);
                }}
              >
                <Image src="/assets/arrow-vector.svg" alt="" width={30} height={30} />
              </button>
              <div className="program-details">
                <div>
                  <p>{program.description}</p>
                  <ul>
                    {program.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Solves</strong>
                  <ul>
                    {program.solves.map((item) => (
                      <li key={item}>
                        <Image
                          className="program-solves-arrow"
                          src="/assets/program-orange-arrow.svg"
                          alt=""
                          width={12}
                          height={12}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact">
                    <span>{program.cta ?? "Start with clarity"}</span>
                    <Image
                      className="program-cta-arrow"
                      src="/assets/arrow-vector.svg"
                      alt=""
                      width={34}
                      height={26}
                    />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="work" id="work">
        <div className="shell" data-reveal="stack">
          <p className="kicker">What we do</p>
          <h2>Selected Work</h2>
          <div className="carousel-shell">
            <div className="work-track" ref={workTrackRef}>
              {work.map((item) => {
                const content = (
                  <>
                    <Image src={item.src} alt={item.alt} width={380} height={590} />
                    <div className="work-info">
                      <span>Case Study {item.index}</span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <small>{item.meta}</small>
                      <Image
                        className="work-info-arrow"
                        src="/assets/arrow-projects.svg"
                        alt=""
                        width={34}
                        height={26}
                      />
                    </div>
                  </>
                );

                return item.href ? (
                  <Link
                    aria-label={`Open ${item.title} case study`}
                    className="work-card"
                    href={item.href}
                    key={item.index}
                    onClick={resetProjectScroll}
                  >
                    {content}
                  </Link>
                ) : (
                  <article className="work-card" key={item.index} tabIndex={0}>
                    {content}
                  </article>
                );
              })}
            </div>
            <div className="carousel-controls work-controls">
              {workScrollState.canGoBack ? (
                <button
                  type="button"
                  onClick={() => scrollTrack(workTrackRef.current, -1)}
                  aria-label="Previous work"
                >
                  <Image src="/assets/Union.svg" alt="" width={25} height={43} />
                </button>
              ) : (
                <span aria-hidden="true" />
              )}
              {workScrollState.canGoForward ? (
                <button
                  type="button"
                  onClick={() => scrollTrack(workTrackRef.current, 1)}
                  aria-label="Next work"
                >
                  <Image src="/assets/Union.svg" alt="" width={25} height={43} />
                </button>
              ) : (
                <span aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="operating shell" id="team">
        <div className="operating-grid">
          <div className="team-diagram" data-reveal="diagram" aria-hidden="true">
            <svg viewBox="0 0 595 842" role="presentation">
              <g className="team-grid">
                {[130, 197, 264, 331, 398, 465].map((x) => (
                  <line key={`grid-x-${x}`} x1={x} y1="109" x2={x} y2="733" />
                ))}
                {[178, 247, 317, 386, 456, 525, 595, 664].map((y) => (
                  <line key={`grid-y-${y}`} x1="64" y1={y} x2="532" y2={y} />
                ))}
              </g>

              <g className="team-links">
                <line x1="298" y1="281" x2="231" y2="421" />
                <line x1="298" y1="281" x2="365" y2="421" />
                <line x1="298" y1="281" x2="298" y2="561" />
                <line x1="231" y1="421" x2="164" y2="561" />
                <line x1="231" y1="421" x2="298" y2="561" />
                <line x1="231" y1="421" x2="432" y2="561" />
                <line x1="365" y1="421" x2="164" y2="561" />
                <line x1="365" y1="421" x2="298" y2="561" />
                <line x1="365" y1="421" x2="432" y2="561" />
                <line x1="164" y1="561" x2="432" y2="561" />
                <line x1="231" y1="421" x2="365" y2="421" />
              </g>

              <g className="team-arrows">
                {[164, 231, 298, 365, 432].map((x, index) => {
                  const startY = index === 2 ? 282 : index % 2 === 0 ? 353 : 282;
                  const endY = index === 2 ? 207 : 205;

                  return (
                    <g key={`team-arrow-${x}`} style={{ "--arrow-delay": `${index * 70}ms` } as CSSProperties}>
                      <line x1={x} y1={startY} x2={x} y2={endY} />
                      <polyline points={`${x - 8},${endY + 12} ${x},${endY} ${x + 8},${endY + 12}`} />
                    </g>
                  );
                })}
              </g>

              <g className="team-nodes">
                {[
                  { x: 298, y: 281, label: "01", main: true, delay: 360 },
                  { x: 231, y: 421, label: "02", delay: 240 },
                  { x: 365, y: 421, label: "AD", delay: 300 },
                  { x: 298, y: 467, label: "", small: true, delay: 180 },
                  { x: 164, y: 561, label: "CD", delay: 0 },
                  { x: 298, y: 561, label: "05", delay: 60 },
                  { x: 432, y: 561, label: "CW", delay: 120 }
                ].map((node) => (
                  <g
                    className={`team-node${node.main ? " team-node-main" : ""}${node.small ? " team-node-small" : ""}`}
                    key={`${node.x}-${node.y}`}
                    style={{ "--node-delay": `${node.delay}ms` } as CSSProperties}
                  >
                    <circle cx={node.x} cy={node.y} r={node.small ? 13 : 28} />
                    {node.label && (
                      <text x={node.x} y={node.y}>
                        {node.label}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            </svg>
          </div>
          <div data-reveal="stack">
            <p className="kicker">Operating model</p>
            <h2 className="operating-title">
              <span>Senior team.</span>
              <span>Clear responsibility.</span>
            </h2>
            <p className="bold-copy">
              Direct collaboration.
              <br />
              Clear ownership.
              <br />
              Decisions stay intact.
            </p>
            <p>
              You work directly with people who define the direction and stand behind it.
              <br />
              <br />
              Designers who define systems.
              <br />
              Writers who sharpen ideas.
              <br />
              Digital specialists who make things scale.
              <br />
              <br />
              They&apos;re not added to the process. They&apos;re brought in because the direction
              demands it. Everything runs inside a system we define and lead.
            </p>
          </div>
        </div>

        <div className="carousel-shell team-carousel">
          <div className="team-track" id="team-track" ref={teamTrackRef}>
          {team.map((person) => (
            <article className="team-member" key={person.name}>
              <div className="team-photo">
                <Image src={person.src} alt={person.name} width={280} height={340} />
              </div>
              <h3>{person.name}</h3>
              <span>{person.role}</span>
              <p>{person.bio}</p>
              <small>Selected brand experience</small>
              <p className="team-experience">{person.experience}</p>
            </article>
          ))}
          </div>
          <div className="carousel-controls team-controls">
            {teamScrollState.canGoBack ? (
              <button
                type="button"
                onClick={() => scrollTrack(teamTrackRef.current, -1)}
                aria-label="Previous team member"
              >
                <Image src="/assets/Union.svg" alt="" width={25} height={43} />
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
            {teamScrollState.canGoForward ? (
              <button
                type="button"
                onClick={() => scrollTrack(teamTrackRef.current, 1)}
                aria-label="Next team member"
              >
                <Image src="/assets/Union.svg" alt="" width={25} height={43} />
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="expertise" data-reveal="split">
          <div>
            <p className="kicker">Hybrid expertise</p>
            <h2>Hybrid expertise. Built around direction.</h2>
          </div>
          <div>
            <p>
              Depending on the project, NWD brings in senior specialists across strategy, design,
              production, content, digital, retail, packaging and technology.
            </p>
            <p>Specialists enter the system only when the direction demands it.</p>
            <p>
              Every collaboration stays connected through one strategic framework and one
              operational direction.
            </p>
          </div>
        </div>
      </section>

      <section className="direction-first" data-reveal="blur">
        <p className="kicker">Clear decisions and aligned execution</p>
        <h2>
          <strong className={`direction-line${activeDirectionLine === 0 ? " is-active" : ""}`}>
            Direction first.
          </strong>
          <span className={`direction-line${activeDirectionLine === 1 ? " is-active" : ""}`}>
            Then the right system.
          </span>
          <span className={`direction-line${activeDirectionLine === 2 ? " is-active" : ""}`}>
            Then the right people.
          </span>
        </h2>
      </section>

      <section className="outcomes" data-reveal="rows">
        <p className="kicker">What clients actually get?</p>
        <div className="outcomes-list">
          {[
            ["Not more layers.", "More clarity."],
            ["Not more meetings.", "Better decisions."],
            ["Not bigger teams.", "Stronger alignment."]
          ].map(([before, after], index) => (
            <div
              className="outcome-row"
              key={before}
              style={{ "--outcome-delay": `${index * 140}ms` } as CSSProperties}
            >
              <span className="outcome-before">{before}</span>
              <span className="outcome-arrow" aria-hidden="true" />
              <strong>{after}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="contact shell" id="contact" data-reveal="split">
        <div>
          <p className="kicker">Contact</p>
          <h2>Let&apos;s build a stronger brand system</h2>
          <p>
            Whether you need strategic clarity, stronger positioning or a scalable growth system,
            every engagement starts with understanding the business challenge and growth
            opportunity.
          </p>
          <div className="socials">
            <a href="#" aria-label="Instagram" onClick={(event) => event.preventDefault()}>
              <Image src="/assets/social-instagram.svg" alt="" width={24} height={24} />
            </a>
            <a href="#" aria-label="LinkedIn" onClick={(event) => event.preventDefault()}>
              <Image src="/assets/social-linkedin.svg" alt="" width={24} height={24} />
            </a>
          </div>
        </div>
        <ContactForm />
      </section>

      <GlobalFooter />

      <button
        className={`back-to-top${showBackToTop ? " is-visible" : ""}`}
        type="button"
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Image src="/assets/Union.svg" alt="" width={25} height={43} />
      </button>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, useEffect, useState } from "react";
import { ContactForm } from "./contact-form";

const primaryNavItems = [
  { label: "NWD Programs", targetId: "programs" },
  { label: "Selected Work", targetId: "work" },
  { label: "Contact", targetId: "contact" }
];

function getScrollOffset(targetId: string) {
  return targetId === "team-track" || targetId === "contact" ? 150 : 0;
}

function scrollToTarget(targetId: string) {
  const target = document.getElementById(targetId);
  if (!target) return false;

  const offset = getScrollOffset(targetId);
  window.scrollTo({
    top: window.scrollY + target.getBoundingClientRect().top - offset,
    behavior: "smooth"
  });
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  return true;
}

function handleTargetNavigation(event: MouseEvent<HTMLElement>, targetId: string) {
  if (scrollToTarget(targetId)) {
    event.preventDefault();
    return;
  }

  window.sessionStorage.setItem("nwd-scroll-target", targetId);
}

async function copyEmail() {
  const email = "bojan.sasic@nwdagency.com";

  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = email;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

export function GlobalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePrimaryNav, setActivePrimaryNav] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"work" | "team" | "careers">("work");
  const [careersCopied, setCareersCopied] = useState(false);

  const copyCareersEmail = async () => {
    setActiveAction("careers");
    await copyEmail();
    setCareersCopied(true);
    window.setTimeout(() => setCareersCopied(false), 2200);
  };

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-is-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header${menuOpen ? " menu-open" : ""}`}>
        <Link
          className="brand"
          href="/"
          aria-label="New Direction home"
          onClick={(event) => {
            handleTargetNavigation(event, "top");
            setMenuOpen(false);
          }}
        >
          <Image src="/assets/logo.svg" alt="New Direction" width={180} height={47} priority />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>

      <div
        className={`menu-panel${menuOpen ? " is-open" : ""}`}
        id="site-menu"
        aria-hidden={!menuOpen}
      >
        <div className="menu-panel-inner">
          <nav className="menu-primary" aria-label="Primary navigation">
            {primaryNavItems.map((item) => (
              <Link
                className={activePrimaryNav === item.targetId ? "is-active" : ""}
                href="/"
                key={item.label}
                onClick={(event) => {
                  handleTargetNavigation(event, item.targetId);
                  setActivePrimaryNav(item.targetId);
                  setMenuOpen(false);
                }}
              >
                <Image
                  className="menu-primary-arrow"
                  src="/assets/menu-primary-arrow.svg"
                  alt=""
                  width={54}
                  height={53}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="menu-actions">
            <a
              className={activeAction === "work" ? "light-pill" : ""}
              href="#contact"
              onClick={(event) => {
                handleTargetNavigation(event, "contact");
                setActiveAction("work");
                setMenuOpen(false);
              }}
            >
              Work With Us
            </a>
            <Link
              className={activeAction === "team" ? "light-pill" : ""}
              href="/"
              onClick={(event) => {
                handleTargetNavigation(event, "team-track");
                setActiveAction("team");
                setMenuOpen(false);
              }}
            >
              Our Team
            </Link>
            <span className="menu-action-tooltip">
              <button
                className={activeAction === "careers" ? "light-pill" : ""}
                type="button"
                onClick={() => void copyCareersEmail()}
              >
                Careers
              </button>
              <span className={careersCopied ? "is-visible" : ""} role="status">
                Copied
              </span>
            </span>
          </div>

          <div className="menu-panel-bottom">
            <div className="socials">
              <a href="#" aria-label="Instagram" onClick={(event) => event.preventDefault()}>
                <Image src="/assets/social-instagram.svg" alt="" width={24} height={24} />
              </a>
              <a href="#" aria-label="LinkedIn" onClick={(event) => event.preventDefault()}>
                <Image src="/assets/social-linkedin.svg" alt="" width={24} height={24} />
              </a>
            </div>
            <Image
              className="menu-panel-logo"
              src="/assets/footer-logo.svg"
              alt="NWD"
              width={1061}
              height={349}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function GlobalContact() {
  return (
    <section className="contact shell" id="contact">
      <div>
        <p className="kicker">Contact</p>
        <h2>Let&apos;s build a stronger brand system</h2>
        <p>
          Whether you need strategic clarity, stronger positioning or a scalable growth system,
          every engagement starts with understanding the business challenge and growth opportunity.
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
  );
}

export function GlobalFooter() {
  const [activePrimaryNav, setActivePrimaryNav] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"work" | "team" | "careers">("work");
  const [careersCopied, setCareersCopied] = useState(false);

  const copyCareersEmail = async () => {
    setActiveAction("careers");
    await copyEmail();
    setCareersCopied(true);
    window.setTimeout(() => setCareersCopied(false), 2200);
  };

  return (
    <footer>
      <nav className="footer-links" aria-label="Footer navigation">
        {primaryNavItems.map((item) => (
          <Link
            className={activePrimaryNav === item.targetId ? "is-active" : ""}
            href="/"
            key={item.label}
            onClick={(event) => {
              handleTargetNavigation(event, item.targetId);
              setActivePrimaryNav(item.targetId);
            }}
          >
            <Image
              className="footer-links-arrow"
              src="/assets/menu-primary-arrow.svg"
              alt=""
              width={54}
              height={53}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="footer-actions">
        <a
          className={activeAction === "work" ? "light-pill" : ""}
          href="#contact"
          onClick={(event) => {
            handleTargetNavigation(event, "contact");
            setActiveAction("work");
          }}
        >
          Work With Us
        </a>
        <Link
          className={activeAction === "team" ? "light-pill" : ""}
          href="/"
          onClick={(event) => {
            handleTargetNavigation(event, "team-track");
            setActiveAction("team");
          }}
        >
          Our Team
        </Link>
        <span className="menu-action-tooltip footer-action-tooltip">
          <button
            className={activeAction === "careers" ? "light-pill" : ""}
            type="button"
            onClick={() => void copyCareersEmail()}
          >
            Careers
          </button>
          <span className={careersCopied ? "is-visible" : ""} role="status">
            Copied
          </span>
        </span>
      </div>
      <div className="footer-bottom">
        <div className="footer-meta">
          <div className="socials">
            <a href="#" aria-label="Instagram" onClick={(event) => event.preventDefault()}>
              <Image src="/assets/social-instagram.svg" alt="" width={24} height={24} />
            </a>
            <a href="#" aria-label="LinkedIn" onClick={(event) => event.preventDefault()}>
              <Image src="/assets/social-linkedin.svg" alt="" width={24} height={24} />
            </a>
          </div>
          <p>&copy; 2026 NWD</p>
        </div>
        <Image
          className="footer-logo"
          src="/assets/footer-logo.svg"
          alt="NWD"
          width={1061}
          height={349}
        />
      </div>
    </footer>
  );
}

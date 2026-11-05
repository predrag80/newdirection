"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { type FormEvent, useEffect, useRef, useState } from "react";

type SubmitStatus =
  | { state: "idle" | "sending" | "error"; message: string }
  | { state: "sent"; firstName: string };

type TurnstileWidgetOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: () => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (element: HTMLElement, options: TurnstileWidgetOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle", message: "" });
  const [isTurnstileLoaded, setIsTurnstileLoaded] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !turnstileSiteKey ||
      !isTurnstileLoaded ||
      !turnstileContainerRef.current ||
      turnstileWidgetIdRef.current ||
      !window.turnstile
    ) {
      return;
    }

    // The widget stays mounted (hidden) while the confirmation shows, and its token can expire
    // or re-verify in the background, so none of these callbacks may replace the confirmation.
    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      theme: "light",
      callback: () => {
        setStatus((current) =>
          current.state === "error" ? { state: "idle", message: "" } : current
        );
      },
      "expired-callback": () => {
        setStatus((current) =>
          current.state === "sent"
            ? current
            : { state: "error", message: "Verification expired. Please try again." }
        );
      },
      "error-callback": () => {
        setStatus((current) =>
          current.state === "sent"
            ? current
            : {
                state: "error",
                message: "Verification could not be completed. Please refresh and try again."
              }
        );
      }
    });

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [isTurnstileLoaded]);

  // The submit button the visitor was on disappears, so move focus (and the viewport) to the
  // confirmation instead of leaving it on nothing.
  useEffect(() => {
    if (status.state !== "sent") {
      return;
    }

    confirmationHeadingRef.current?.focus({ preventScroll: true });
    confirmationRef.current?.scrollIntoView({ block: "nearest" });
  }, [status.state]);

  const resetTurnstile = () => {
    if (turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (turnstileSiteKey && !formData.get("cf-turnstile-response")) {
      setStatus({ state: "error", message: "Please complete the verification." });
      resetTurnstile();
      return;
    }

    setStatus({ state: "sending", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Message could not be sent.");
      }

      form.reset();
      setStatus({
        state: "sent",
        firstName: getText(formData, "firstName")
      });
    } catch (error) {
      resetTurnstile();
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Message could not be sent."
      });
    }
  };

  return (
    <>
      {/* Hidden rather than unmounted after sending, so the Turnstile widget survives. */}
      <form onSubmit={handleSubmit} hidden={status.state === "sent"}>
        {turnstileSiteKey ? (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onLoad={() => setIsTurnstileLoaded(true)}
          />
        ) : null}
        <input name="firstName" placeholder="First name" aria-label="First name" />
        <input name="lastName" placeholder="Last name" aria-label="Last name" />
        <input type="email" name="email" placeholder="E-mail" aria-label="Email" required />
        <input name="company" placeholder="Company/Brand" aria-label="Company or brand" />
        <input
          name="challenge"
          placeholder="What challenge are you trying to solve?"
          aria-label="Challenge"
        />
        <select
          name="engagement"
          aria-label="How would you like to work with NWD?"
          required
          defaultValue=""
        >
          <option value="" disabled>
            How would you like to work with NWD?
          </option>
          <option value="I need strategic clarity">I need strategic clarity</option>
          <option value="I need a campaign or activation">I need a campaign or activation</option>
          <option value="I need a stronger brand system">I need a stronger brand system</option>
          <option value="I need support scaling the brand">I need support scaling the brand</option>
          <option value="I'm exploring a larger partnership">
            I&apos;m exploring a larger partnership
          </option>
          <option value="I'm not sure yet">I&apos;m not sure yet</option>
        </select>
        <textarea name="message" placeholder="Tell us more ..." aria-label="Message" />
        {turnstileSiteKey ? (
          <div
            ref={turnstileContainerRef}
            className="contact-turnstile"
            aria-label="Cloudflare Turnstile verification"
          />
        ) : null}
        <button type="submit" disabled={status.state === "sending"}>
          <span>{status.state === "sending" ? "Sending" : "Send"}</span>
          <Image src="/assets/arrow.svg" alt="" width={29} height={23} />
        </button>
        <p className={`contact-form-status ${status.state}`} role="status" aria-live="polite">
          {status.state === "sent" ? "" : status.message}
        </p>
      </form>
      {status.state === "sent" ? (
        <div className="contact-confirmation" ref={confirmationRef}>
          <p className="kicker">Message received</p>
          <h3 ref={confirmationHeadingRef} tabIndex={-1}>
            Thank you{status.firstName ? `, ${status.firstName}` : ""}.
          </h3>
          <p className="contact-confirmation-lead">
            Your message is with the NWD team. We&apos;ll review it and get back to you.
          </p>
        </div>
      ) : (
        <p className="contact-form-consent">
          By submitting this form, you agree to our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/terms-of-use">Terms of Use</Link>. We treat your information responsibly.
        </p>
      )}
    </>
  );
}

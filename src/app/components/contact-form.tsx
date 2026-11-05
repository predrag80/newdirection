"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { type FormEvent, useEffect, useRef, useState } from "react";

type SubmitState = "idle" | "sending" | "sent" | "error";

type SubmitStatus = {
  state: SubmitState;
  message: string;
};

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

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle", message: "" });
  const [isTurnstileLoaded, setIsTurnstileLoaded] = useState(false);
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

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      theme: "light",
      // Also fires after the post-submit reset re-verifies, so only clear a verification error,
      // never the "sent" confirmation.
      callback: () => {
        setStatus((current) =>
          current.state === "error" ? { state: "idle", message: "" } : current
        );
      },
      "expired-callback": () => {
        setStatus({ state: "error", message: "Verification expired. Please try again." });
      },
      "error-callback": () => {
        setStatus({
          state: "error",
          message: "Verification could not be completed. Please refresh and try again."
        });
      }
    });

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [isTurnstileLoaded]);

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
      resetTurnstile();
      setStatus({ state: "sent", message: result.message ?? "Message sent." });
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
      <form onSubmit={handleSubmit}>
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
          {status.message}
        </p>
      </form>
      <p className="contact-form-consent">
        By submitting this form, you agree to our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
        <Link href="/terms-of-use">Terms of Use</Link>. We treat your information responsibly.
      </p>
    </>
  );
}

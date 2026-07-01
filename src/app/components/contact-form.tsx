"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";

type SubmitState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("sending");
    setStatusMessage("");

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
      setSubmitState("sent");
      setStatusMessage(result.message ?? "Message sent.");
    } catch (error) {
      setSubmitState("error");
      setStatusMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit" disabled={submitState === "sending"}>
        <span>{submitState === "sending" ? "Sending" : "Send"}</span>
        <Image src="/assets/arrow.svg" alt="" width={29} height={23} />
      </button>
      <p className={`contact-form-status ${submitState}`} role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}

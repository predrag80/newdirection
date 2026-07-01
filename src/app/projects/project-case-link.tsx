"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type ProjectCaseLinkProps = {
  "aria-label": string;
  children: ReactNode;
  href: string;
  navigateDelayMs?: number;
};

export function ProjectCaseLink({
  children,
  href,
  navigateDelayMs = 0,
  ...props
}: ProjectCaseLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    window.sessionStorage.setItem("defer-project-next", "1");
    const navigate = () => {
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => router.push(href));
    };

    if (navigateDelayMs > 0) {
      window.setTimeout(navigate, navigateDelayMs);
      return;
    }

    navigate();
  };

  return (
    <Link href={href} prefetch={false} scroll={false} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

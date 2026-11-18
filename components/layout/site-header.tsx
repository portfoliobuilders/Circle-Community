import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { PrimaryNav } from "@/components/layout/primary-nav";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-bg/95 transition-colors">
      <Container className="flex h-full items-center gap-4 lg:gap-8">
        <Link
          href="/"
          aria-label="CIRCLE, home"
          className="inline-flex shrink-0 items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <Image
            src="/brand/logo-white.png"
            alt="CIRCLE"
            width={120}
            height={36}
            priority
            className="hidden h-9 w-auto object-contain lg:block"
          />
          <Image
            src="/brand/emblem-white.png"
            alt="CIRCLE"
            width={32}
            height={32}
            priority
            className="size-8 object-contain lg:hidden"
          />
        </Link>

        <Suspense fallback={<div className="hidden min-w-0 flex-1 lg:block" />}>
          <PrimaryNav className="hidden min-w-0 flex-1 lg:block" />
        </Suspense>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <PillLink
            href="/login"
            variant="secondary"
            className="hidden sm:inline-flex min-h-10 px-4 text-xs font-semibold"
          >
            Sign in
          </PillLink>
          <PillLink
            href="/join"
            className="hidden sm:inline-flex min-h-10 px-4 text-xs font-semibold"
          >
            Join CIRCLE
          </PillLink>
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}

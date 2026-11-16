import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { PrimaryNav } from "@/components/layout/primary-nav";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-3 lg:h-32">
        <Link
          href="/"
          aria-label="CIRCLE, home"
          className="inline-flex shrink-0 items-center rounded-full"
        >
          <Image
            src="/brand/logo-white.png"
            alt=""
            width={300}
            height={300}
            priority
            className="hidden size-[100px] lg:block"
          />
          <Image
            src="/brand/emblem-white.png"
            alt=""
            width={309}
            height={309}
            priority
            className="size-8 lg:hidden"
          />
        </Link>
        <PrimaryNav className="hidden min-w-0 flex-1 lg:block" />
        <div className="ml-auto flex items-center gap-2">
          <PillLink href="/join" className="hidden sm:inline-flex">
            Join CIRCLE
          </PillLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

"use client";

import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { primaryNav, social, isPlaceholder } from "@/lib/site";

const activeSocials = [
  social.instagram,
  social.whatsappChannel,
  social.whatsappCommunity,
].filter((item) => !isPlaceholder(item.href));

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function handleClose() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-10 rounded-full border-border bg-surface lg:hidden hover:bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          />
        }
      >
        <Menu className="size-5 text-white" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[88vw] max-w-sm bg-bg border-l border-border p-0 flex flex-col justify-between overflow-y-auto"
      >
        {/* 1. Header */}
        <SheetHeader className="p-5 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/emblem-white.png"
              alt="CIRCLE"
              width={28}
              height={28}
              className="size-7 object-contain"
            />
            <SheetTitle className="font-display text-sm font-semibold tracking-wider uppercase text-white">
              Navigation
            </SheetTitle>
          </div>
          <button
            onClick={handleClose}
            className="size-9 rounded-full border border-border flex items-center justify-center text-silver hover:text-white"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </SheetHeader>

        {/* 2. Primary Navigation Links */}
        <div className="p-5 space-y-6 flex-1">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {primaryNav.map((item) => {
              const active =
                !item.href.includes("#") &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={cn(
                    "flex min-h-12 items-center justify-between px-3 rounded-xl font-display text-lg font-medium transition-colors",
                    active
                      ? "bg-surface text-lime font-bold"
                      : "text-silver hover:text-white hover:bg-surface/50"
                  )}
                >
                  <span>{item.label}</span>
                  {active && <span className="size-1.5 rounded-full bg-lime" />}
                </Link>
              );
            })}
          </nav>

          {/* Quick Role Direct Actions */}
          <div className="pt-4 border-t border-border">
            <span className="font-mono text-[11px] uppercase tracking-wider text-silver/70 block mb-2 px-3">
              Explore by role
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/creators"
                onClick={handleClose}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface text-silver hover:text-white"
              >
                <span>For Creators</span>
                <ArrowUpRight className="size-3 text-lime" />
              </Link>
              <Link
                href="/brands"
                onClick={handleClose}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface text-silver hover:text-white"
              >
                <span>For Brands</span>
                <ArrowUpRight className="size-3 text-lime" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Footer Strip */}
        <div className="p-5 border-t border-border bg-surface/30 space-y-3">
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              onClick={handleClose}
              className="flex-1 min-h-11 inline-flex items-center justify-center rounded-full border border-border bg-surface text-xs font-semibold text-white hover:bg-bg transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/join"
              onClick={handleClose}
              className="flex-1 min-h-11 inline-flex items-center justify-center rounded-full bg-lime text-xs font-semibold text-bg hover:bg-lime/90 transition-colors"
            >
              Join CIRCLE
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-mono text-silver">
            {activeSocials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

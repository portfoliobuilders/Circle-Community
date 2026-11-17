"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PrimaryNav } from "@/components/layout/primary-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supportNav } from "@/lib/site";
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-11 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-surface text-text border-border flex flex-col gap-0 overflow-y-auto"
      >
        <SheetHeader className="pr-14">
          <SheetTitle className="font-display text-title-sm">Menu</SheetTitle>
        </SheetHeader>
        <PrimaryNav
          className="overflow-y-auto px-2"
          listClassName="flex-col items-stretch gap-0"
          onNavigate={() => setOpen(false)}
        />
        <p className="px-5 pt-4 text-small text-silver">Also</p>
        <ul className="px-2">
          {supportNav.slice(0, 6).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center px-3 text-small text-silver"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 items-center text-small text-silver"
          >
            Sign in
          </Link>
        </div>
        <div className="mt-auto p-4">
          <Link
            href="/join"
            onClick={() => {
              window.setTimeout(() => setOpen(false), 0);
            }}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lime px-5 text-sm font-medium text-bg"
          >
            Join CIRCLE
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-surface text-text border-border gap-0"
      >
        <SheetHeader className="pr-14">
          <SheetTitle className="font-display text-title-sm">Menu</SheetTitle>
        </SheetHeader>
        <PrimaryNav
          className="px-2"
          listClassName="flex-col items-stretch gap-1"
          onNavigate={() => setOpen(false)}
        />
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

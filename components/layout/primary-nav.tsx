"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNav } from "@/lib/site";
import { cn } from "cn";

type PrimaryNavProps = {
  className?: string;
  listClassName?: string;
  onNavigate?: () => void;
};

export function PrimaryNav({
  className,
  listClassName,
  onNavigate,
}: PrimaryNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={className}>
      <ul className={cn("flex items-center gap-1", listClassName)}>
        {primaryNav.map((item) => {
          const active =
            !item.href.includes("#") &&
            (pathname === item.href || pathname.startsWith(`${item.href}/`));

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  window.setTimeout(() => onNavigate?.(), 0);
                }}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-3 text-small text-silver transition-colors hover:text-text",
                  active && "text-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

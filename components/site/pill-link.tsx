import Link from "next/link";
import { cn } from "cn";

const base =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white";

const styles = {
  primary: "bg-lime text-bg hover:bg-lime/90",
  secondary: "border border-border bg-transparent text-text hover:bg-surface",
} as const;

type PillLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
};

export function PillLink({
  href,
  children,
  variant = "primary",
  className,
}: PillLinkProps) {
  return (
    <Link href={href} className={cn(base, styles[variant], className)}>
      {children}
    </Link>
  );
}

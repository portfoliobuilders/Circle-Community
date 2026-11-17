import { isPlaceholder } from "@/lib/site";
import { cn } from "cn";

type SocialLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function SocialLink({ href, children, className }: SocialLinkProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center text-small text-silver underline-offset-4 hover:text-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white",
    className,
  );

  if (isPlaceholder(href)) {
    return (
      <span className={classes}>
        {children}
        <span className="sr-only">, not published yet</span>
      </span>
    );
  }

  const isEmail =
    href.startsWith("mailto:") ||
    (href.includes("@") && !href.startsWith("http"));
  const url = href.startsWith("mailto:") || !isEmail ? href : `mailto:${href}`;

  return (
    <a
      href={url}
      className={classes}
      {...(isEmail
        ? {}
        : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </a>
  );
}

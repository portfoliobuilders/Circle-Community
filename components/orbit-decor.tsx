import { cn } from "cn";

type OrbitDecorProps = {
  className?: string;
};

export function OrbitDecor({ className }: OrbitDecorProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 480 480"
      fill="none"
      className={cn("text-border", className)}
    >
      <circle cx="240" cy="240" r="200" stroke="currentColor" strokeWidth="1" />
      <circle cx="240" cy="240" r="140" stroke="currentColor" strokeWidth="1" />
      <circle cx="240" cy="240" r="78" stroke="currentColor" strokeWidth="1" />
      <circle cx="240" cy="40" r="7" fill="#C6FF00" />
    </svg>
  );
}

import { LEGAL_REVIEWED } from "@/lib/config";

export function LegalBanner() {
  if (LEGAL_REVIEWED) return null;
  return (
    <p
      role="status"
      className="rounded-2xl border border-border bg-surface px-4 py-3 text-small text-silver"
    >
      Draft — under legal review
    </p>
  );
}

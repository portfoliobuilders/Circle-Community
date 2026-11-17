export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const id = title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="font-display text-title-sm font-medium">{title}</h2>
      <div className="mt-3 space-y-3 text-silver">{children}</div>
    </section>
  );
}

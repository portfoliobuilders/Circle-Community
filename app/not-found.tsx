import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { noIndex } from "@/lib/seo";

export const metadata = {
  title: "Page not found",
  robots: noIndex,
};

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-silver">
        That page is not on CIRCLE yet.
      </p>
      <div className="mt-8">
        <PillLink href="/">Back to home</PillLink>
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { LegalSection } from "@/components/legal/legal-section";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Terms",
  "Draft terms for using CIRCLE, operated by Portfolix Enterprise Pvt Ltd.",
  "/legal/terms",
);

export default function TermsPage() {
  return (
    <>
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Terms of use
      </h1>
      <p className="mt-4 text-silver">
        These terms are a draft for {site.operator}, which operates CIRCLE at {site.domain}. They are not in force until a lawyer signs off.
      </p>
      <LegalSection title="Who we are">
        <p>
          CIRCLE is a free community for creators, freelancers, service providers, and brands. Portfolix.Media and Portfolix.Tech are named where a paid agency service is offered. Those paid services are quoted separately and are not part of free membership.
        </p>
      </LegalSection>
      <LegalSection title="Eligibility">
        <p>
          You can use community features if you can form a contract under Indian law, or with the consent of a parent or guardian where the law requires it. Applying to a collab, or listing a paid service, requires you to confirm that you are 18 or older and to give a date of birth. Under-18 users cannot apply to collabs in v1.
        </p>
      </LegalSection>
      <LegalSection title="Accounts and verification">
        <p>
          You must provide accurate information when registering. Follower counts remain labelled self-reported until CIRCLE verifies them. Verification uses a code in your bio; CIRCLE will never ask for your social media password. Brand accounts must represent a verified business entity. One person, one account. A member account can be both a creator and a service provider. Brand accounts are separate.
        </p>
      </LegalSection>
      <LegalSection title="Your content">
        <p>
          You keep ownership of what you upload. You give CIRCLE a licence to display that content on the platform, and on CIRCLE&apos;s own social channels with credit, for as long as the content stays on the service. You can ask for removal through <Link className="text-text underline" href="/contact">contact</Link>. You confirm you have the rights to what you post.
        </p>
      </LegalSection>
      <LegalSection title="Collabs & Video Clipping">
        <p>
          Collabs and video clipping campaigns operate on agreed deliverable scopes. CIRCLE tracks deliverable submissions and applies a transparent 10% platform fee on completed disbursements to support verification, escrow security, and infrastructure. Ad disclosure (#ad / #collab) is required on all published deliverables in compliance with ASCI guidelines.
        </p>
      </LegalSection>
      <LegalSection title="Listings and services">
        <p>
          Service listings must be your own work, with a real &quot;price from&quot;. Agency pages for Portfolix are lead forms. A quote is a separate written agreement. CIRCLE does not store social media passwords.
        </p>
      </LegalSection>
      <LegalSection title="Conduct">
        <p>
          Follow the <Link className="text-text underline" href="/guidelines">community guidelines</Link>. Fake profiles, fake collabs, harassment, and fraud can be removed.
        </p>
      </LegalSection>
      <LegalSection title="Points and badges">
        <p>
          Points and badges recognise completed collabs, attended events, and tasks an admin has approved. They have no cash value. CIRCLE can revoke them if the underlying event is reversed or the account is suspended.
        </p>
      </LegalSection>
      <LegalSection title="Paid Portfolix services">
        <p>
          Influencer marketing, negotiation, social media marketing, ads, video production, UGC, profile audits, and social media management are optional and paid. They are governed by a separate written agreement with Portfolix, not by free membership.
        </p>
      </LegalSection>
      <LegalSection title="Intellectual property">
        <p>
          The CIRCLE name, logo, and site design belong to {site.operator}. Do not copy the logo or imply a partnership that has not been agreed.
        </p>
      </LegalSection>
      <LegalSection title="Disclaimers and liability">
        <p>
          CIRCLE is provided as available. We do not warrant that a collab, a listing, or a member is suitable for you. To the extent Indian law allows, {site.operator} is not liable for indirect loss, or for a payment dispute between a brand and a creator. Nothing in these terms limits liability that cannot legally be limited.
        </p>
      </LegalSection>
      <LegalSection title="Suspension and termination">
        <p>
          We can warn, hide content, suspend, or remove an account for a breach of these terms or the guidelines. Fraud and harassment can be removed immediately. You can appeal through <Link className="text-text underline" href="/contact">contact</Link> with the topic &quot;Report a problem&quot;.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We will post changes on this page. If a change is material, we will ask you to accept the new version the next time you sign in, once accounts exist.
        </p>
      </LegalSection>
      <LegalSection title="Law and contact">
        <p>
          These terms are governed by the laws of India. The courts at [COURT, e.g. Ernakulam] have jurisdiction, subject to counsel. Write to {site.operator} via <Link className="text-text underline" href="/contact">contact</Link> or the <Link className="text-text underline" href="/legal/grievance">grievance officer</Link>.
        </p>
      </LegalSection>
    </>
  );
}

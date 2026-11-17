import type { Metadata } from "next";
import Link from "next/link";

import { LegalSection } from "@/components/legal/legal-section";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Privacy",
  "Draft privacy notice for CIRCLE, aligned to the Digital Personal Data Protection Act, 2023.",
  "/legal/privacy",
);

const rows = [
  ["Account (when sign-in exists)", "Provide the account", "[PLACEHOLDER]"],
  ["Profile, handles, follower counts", "Show your profile and collabs", "[PLACEHOLDER]"],
  ["Collab and application records", "Run the marketplace record", "[PLACEHOLDER]"],
  ["Event registration", "Run the event", "[PLACEHOLDER]"],
  ["Contact, partnership, and lead messages", "Reply to you", "[PLACEHOLDER]"],
  ["Newsletter", "Send news after you confirm", "Until you unsubscribe, then [PLACEHOLDER]"],
  ["Technical logs", "Secure the site", "[PLACEHOLDER]"],
];

export default function PrivacyPage() {
  return (
    <>
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Privacy
      </h1>
      <p className="mt-4 text-silver">
        {site.operator} decides why personal data on CIRCLE is used. This notice is a draft for India&apos;s Digital Personal Data Protection Act, 2023.
      </p>
      <LegalSection title="Data we collect">
        <p>Depending on what you use, we collect:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Account details, once sign-in exists: email and the sign-in provider.</li>
          <li>Profile details you submit: name, handle, city, bio, platforms, follower counts, and rates.</li>
          <li>Collab briefs, applications, bids, and completion notes.</li>
          <li>Event registrations.</li>
          <li>Messages you send through contact, partnership, and service forms.</li>
          <li>Newsletter email and confirmation status.</li>
          <li>No analytics product is installed in this codebase, so we do not collect a separate analytics profile.</li>
        </ul>
        <p>We never ask for or store social media passwords.</p>
      </LegalSection>
      <LegalSection title="Why and on what basis">
        <p>
          We use the data to run the community you asked to join, to reply to messages, and to send the newsletter only after you confirm. The basis is your consent, or a legitimate use under the DPDP Act where the use is for the purpose you were told about. We do not sell personal data.
        </p>
      </LegalSection>
      <LegalSection title="Who we share with">
        <p>Other members see what your visibility settings allow, once profiles exist. Processors, taken from the code in this repository:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Supabase (`@supabase/supabase-js`, `@supabase/ssr`) for the database and, when sign-in is turned on, authentication.</li>
          <li>Resend (`resend`) to email the team and to send newsletter confirmation. It sends only when `RESEND_API_KEY` is set.</li>
          <li>Vercel is the intended host for the Next.js app. `@vercel/analytics` is not installed.</li>
        </ul>
        <p>These vendors may store data outside India. The exact region list is [PLACEHOLDER] until counsel confirms the project settings.</p>
      </LegalSection>
      <LegalSection title="Retention">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-small">
            <thead>
              <tr className="border-b border-border text-text">
                <th className="py-2 pr-4 font-medium">Data</th>
                <th className="py-2 pr-4 font-medium">Purpose</th>
                <th className="py-2 font-medium">Kept for</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className="py-3 pr-4 align-top">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>
      <LegalSection title="Your rights">
        <p>
          You can ask for access, correction, erasure, and to nominate someone to exercise your rights. You can withdraw consent by writing through <Link className="text-text underline" href="/contact">contact</Link>, and, once accounts exist, from settings. Complaints go to the <Link className="text-text underline" href="/legal/grievance">grievance officer</Link>.
        </p>
      </LegalSection>
      <LegalSection title="Children">
        <p>
          Collabs are not open to anyone under 18. v1 does not collect verifiable parental consent. Do not post a child&apos;s personal data.
        </p>
      </LegalSection>
      <LegalSection title="Security">
        <p>
          Database access is restricted with row-level security. The service role key stays on the server. Forms are validated before they are stored. No method is perfect. Tell us if you think an account or a form has been misused.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          {site.operator}, {site.address}. Email through the <Link className="text-text underline" href="/contact">contact form</Link>.
        </p>
      </LegalSection>
    </>
  );
}

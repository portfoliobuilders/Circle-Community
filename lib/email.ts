import "server-only";

import { Resend } from "resend";

type EmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(input: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false as const, reason: "RESEND_API_KEY is not set" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "CIRCLE <info@circlecommunity.in>";
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });

  if (error) return { sent: false as const, reason: error.message };
  return { sent: true as const };
}

export function teamInbox() {
  return process.env.CONTACT_INBOX ?? "info@circlecommunity.in";
}

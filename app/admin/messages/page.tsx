import { Suspense } from "react";
import { AdminDenied } from "@/components/admin/admin-denied";
import { MessageStatusForm } from "@/components/admin/message-status-form";
import { Container } from "@/components/site/container";
import { requireAdmin } from "@/lib/auth/admin";
import { createSessionClient } from "@/lib/supabase/server";
import { noIndex } from "@/lib/seo";

export const metadata = {
  title: "Messages",
  robots: noIndex,
};

type MessageRow = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: "new" | "in_progress" | "closed";
  created_at: string;
};

export default function AdminMessagesPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <p className="text-silver">Loading messages...</p>
        </Container>
      }
    >
      <AdminMessagesBody />
    </Suspense>
  );
}

async function AdminMessagesBody() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return (
      <Container>
        <AdminDenied reason={gate.reason} />
      </Container>
    );
  }

  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("id, name, email, topic, message, status, created_at")
    .order("created_at", { ascending: false });
  const messages = (data ?? []) as MessageRow[];

  return (
    <Container className="py-16">
      <h1 className="font-display text-title font-medium uppercase">Messages</h1>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {messages.length === 0 ? (
          <li className="py-6 text-silver">No messages.</li>
        ) : (
          messages.map((message) => (
            <li key={message.id} className="grid gap-3 py-5">
              <p className="text-small text-silver">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata",
                }).format(new Date(message.created_at))}
                {" · "}
                {message.topic}
              </p>
              <p className="font-medium">
                {message.name} · {message.email}
              </p>
              <p className="whitespace-pre-wrap text-silver">{message.message}</p>
              <MessageStatusForm id={message.id} status={message.status} />
            </li>
          ))
        )}
      </ul>
    </Container>
  );
}

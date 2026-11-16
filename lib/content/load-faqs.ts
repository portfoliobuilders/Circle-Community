import "server-only";

import { faqSeed, type Faq } from "@/lib/content/faqs";
import { requireAdmin } from "@/lib/auth/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAnonClient, createSessionClient } from "@/lib/supabase/server";

export async function getPublishedFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured()) return faqSeed.filter((faq) => faq.published);

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, category, question, answer_md, sort, published")
    .order("sort");

  if (error || !data) return faqSeed.filter((faq) => faq.published);
  return data as Faq[];
}

export async function getAdminFaqs() {
  const gate = await requireAdmin();
  if (!gate.ok) return { gate, faqs: [] as Faq[] };

  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, category, question, answer_md, sort, published")
    .order("sort");

  return { gate, faqs: (data ?? []) as Faq[] };
}

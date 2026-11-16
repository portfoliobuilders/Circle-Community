export function AdminDenied({ reason }: { reason: "unconfigured" | "forbidden" }) {
  return (
    <div className="py-16">
      <h1 className="font-display text-title font-medium uppercase">Admin</h1>
      <p className="mt-4 max-w-xl text-silver">
        {reason === "unconfigured"
          ? "Supabase is not configured, so this queue cannot be opened."
          : "This page is only for a CIRCLE admin session."}
      </p>
    </div>
  );
}

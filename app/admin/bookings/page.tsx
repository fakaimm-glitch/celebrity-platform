"use client";
import AdminShell from "@/components/AdminShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Booking = {
  id: string;
  status: string;
  amount: number;
  type: string;
  date: string;
  created_at: string;
  profiles: { name: string; } | null;
  celebrities: { name: string; image_url: string; } | null;
};

export default function AdminBookingsPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("bookings")
      .select("id, status, amount, type, date, created_at, profiles(name), celebrities(name, image_url)")
      .order("created_at", { ascending: false });
    setBookings((data as any) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from("bookings").update({ status }).eq("id", id);
    await load();
    setUpdating(null);
  }

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  function statusColor(status: string) {
    if (status === "confirmed") return "text-green-400 bg-green-400/10 border-green-400/20";
    if (status === "pending") return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    if (status === "rejected") return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
  };

  return (
    <AdminShell title="Bookings" subtitle="Manage all bookings">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "confirmed", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition capitalize ${
              filter === f ? "bg-white text-black border-white" : "border-[var(--border)] text-[var(--accent)] hover:border-white/20"
            }`}
            style={{ backgroundColor: filter === f ? "#fff" : "#0a0a0a" }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--accent)] text-sm">No bookings found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <motion.div key={booking.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="border border-[var(--border)] rounded-2xl p-5"
              style={{ backgroundColor: "#0a0a0a" }}>
              <div className="flex items-start gap-4">
                {/* Celebrity image */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                  {(booking.celebrities as any)?.image_url && (
                    <img src={(booking.celebrities as any).image_url}
                      alt={(booking.celebrities as any)?.name}
                      className="w-full h-full object-cover object-top" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[var(--foreground)] font-semibold text-sm">
                      {(booking.profiles as any)?.name ?? "Unknown User"}
                    </p>
                    <span className="text-[var(--accent)] text-xs">→</span>
                    <p className="text-[var(--foreground)] text-sm">
                      {(booking.celebrities as any)?.name ?? "Unknown Celebrity"}
                    </p>
                  </div>
                  <p className="text-[var(--accent)] text-xs capitalize mb-1">
                    {booking.type?.replace(/_/g, " ")}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-yellow-400 text-sm font-bold">
                      ${booking.amount?.toLocaleString()}
                    </span>
                    <span className="text-[var(--accent)] text-xs">
                      {new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {booking.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(booking.id, "confirmed")}
                      disabled={updating === booking.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition disabled:opacity-50">
                      {updating === booking.id ? "..." : "✓ Confirm"}
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, "rejected")}
                      disabled={updating === booking.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition disabled:opacity-50">
                      {updating === booking.id ? "..." : "✕ Reject"}
                    </button>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(booking.id, "rejected")}
                    disabled={updating === booking.id}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition disabled:opacity-50 flex-shrink-0">
                    {updating === booking.id ? "..." : "✕ Reject"}
                  </button>
                )}

                {booking.status === "rejected" && (
                  <button
                    onClick={() => updateStatus(booking.id, "confirmed")}
                    disabled={updating === booking.id}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition disabled:opacity-50 flex-shrink-0">
                    {updating === booking.id ? "..." : "✓ Confirm"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
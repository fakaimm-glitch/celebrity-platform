"use client";
import AdminShell from "@/components/AdminShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Donation = {
  id: string;
  amount: number;
  message: string | null;
  created_at: string;
  status: string;
  profiles: { name: string } | null;
  celebrities: { name: string; image_url: string } | null;
};

export default function AdminDonationsPage() {
  const supabase = createClient();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "rejected">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  async function load() {
    const { data } = await supabase
      .from("donations")
      .select("id, amount, message, created_at, status, profiles(name), celebrities(name, image_url)")
      .order("created_at", { ascending: false });
    const list = (data as any) ?? [];
    setDonations(list);
    setTotal(list.reduce((s: number, d: any) => s + (d.amount ?? 0), 0));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from("donations").update({ status }).eq("id", id);
    await load();
    setUpdating(null);
  }

  const filtered = filter === "all" ? donations : donations.filter(d => d.status === filter);

  const counts = {
    all: donations.length,
    pending: donations.filter(d => d.status === "pending").length,
    completed: donations.filter(d => d.status === "completed").length,
    rejected: donations.filter(d => d.status === "rejected").length,
  };

  function statusColor(status: string) {
    if (status === "completed") return "text-green-400 bg-green-400/10 border-green-400/20";
    if (status === "pending") return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    if (status === "rejected") return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }

  return (
    <AdminShell title="Donations" subtitle="All fan donations">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Donations", value: donations.length, color: "text-white" },
          { label: "Pending", value: counts.pending, color: "text-orange-400" },
          { label: "Completed", value: counts.completed, color: "text-green-400" },
          { label: "Total Amount", value: `$${total.toLocaleString()}`, color: "text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
            <p className="text-[var(--accent)] text-xs mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "completed", "rejected"] as const).map((f) => (
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
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--accent)] text-sm">No donations found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((donation) => (
            <motion.div key={donation.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="border border-[var(--border)] rounded-2xl p-5"
              style={{ backgroundColor: "#0a0a0a" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                  {(donation.celebrities as any)?.image_url && (
                    <img src={(donation.celebrities as any).image_url}
                      alt={(donation.celebrities as any)?.name}
                      className="w-full h-full object-cover object-top" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[var(--foreground)] font-semibold text-sm">
                      {(donation.profiles as any)?.name ?? "Unknown User"}
                    </p>
                    <span className="text-[var(--accent)] text-xs">→</span>
                    <p className="text-[var(--foreground)] text-sm">
                      {(donation.celebrities as any)?.name ?? "Unknown Celebrity"}
                    </p>
                  </div>
                  {donation.message && (
                    <p className="text-[var(--accent)] text-xs mb-1 italic">"{donation.message}"</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                    <span className="text-yellow-400 text-sm font-bold">${donation.amount?.toLocaleString()}</span>
                    <span className="text-[var(--accent)] text-xs">
                      {new Date(donation.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  {donation.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(donation.id, "completed")}
                        disabled={updating === donation.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition disabled:opacity-50">
                        {updating === donation.id ? "..." : "✓ Confirm"}
                      </button>
                      <button onClick={() => updateStatus(donation.id, "rejected")}
                        disabled={updating === donation.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition disabled:opacity-50">
                        {updating === donation.id ? "..." : "✕ Reject"}
                      </button>
                    </>
                  )}
                  {donation.status === "completed" && (
                    <button onClick={() => updateStatus(donation.id, "rejected")}
                      disabled={updating === donation.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition disabled:opacity-50">
                      {updating === donation.id ? "..." : "✕ Reject"}
                    </button>
                  )}
                  {donation.status === "rejected" && (
                    <button onClick={() => updateStatus(donation.id, "completed")}
                      disabled={updating === donation.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition disabled:opacity-50">
                      {updating === donation.id ? "..." : "✓ Confirm"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
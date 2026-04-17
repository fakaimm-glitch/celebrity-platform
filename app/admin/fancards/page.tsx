"use client";
import AdminShell from "@/components/AdminShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const FAN_CARD_PRICE = 49.99;

type FanCard = {
  id: string;
  issued_at: string;
  card_image_url: string;
  status: string;
  profiles: { name: string } | null;
  celebrities: { name: string; image_url: string } | null;
};

export default function AdminFanCardsPage() {
  const supabase = createClient();
  const [fanCards, setFanCards] = useState<FanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "rejected">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("fan_cards")
      .select("id, issued_at, card_image_url, status, profiles(name), celebrities(name, image_url)")
      .order("issued_at", { ascending: false });
    setFanCards((data as any) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from("fan_cards").update({ status }).eq("id", id);
    await load();
    setUpdating(null);
  }

  const filtered = filter === "all" ? fanCards : fanCards.filter(c => c.status === filter);

  const counts = {
    all: fanCards.length,
    pending: fanCards.filter(c => c.status === "pending").length,
    active: fanCards.filter(c => c.status === "active").length,
    rejected: fanCards.filter(c => c.status === "rejected").length,
  };

  const totalRevenue = fanCards.filter(c => c.status === "active").length * FAN_CARD_PRICE;

  function statusColor(status: string) {
    if (status === "active") return "text-green-400 bg-green-400/10 border-green-400/20";
    if (status === "pending") return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    if (status === "rejected") return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }

  return (
    <AdminShell title="Fan Cards" subtitle="All issued fan cards">

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Cards", value: fanCards.length, color: "text-white" },
          { label: "Pending", value: counts.pending, color: "text-orange-400" },
          { label: "Active", value: counts.active, color: "text-green-400" },
          { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
            <p className="text-[var(--accent)] text-xs mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "active", "rejected"] as const).map((f) => (
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
        <div className="text-center py-20 text-[var(--accent)] text-sm">No fan cards found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((card) => (
            <motion.div key={card.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="border border-[var(--border)] rounded-2xl p-5"
              style={{ backgroundColor: "#0a0a0a" }}>
              <div className="flex items-center gap-4">

                {/* Mini fan card */}
                <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-yellow-400/30 flex-shrink-0"
                  style={{ backgroundColor: "#111" }}>
                  {(card.celebrities as any)?.image_url && (
                    <img src={(card.celebrities as any).image_url}
                      alt={(card.celebrities as any)?.name}
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-60" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5">
                    <p className="text-yellow-400 text-[5px] font-bold">★ CELEB</p>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[var(--foreground)] font-semibold text-sm">
                    {(card.profiles as any)?.name ?? "Unknown User"}
                  </p>
                  <p className="text-[var(--accent)] text-xs mt-0.5">
                    {(card.celebrities as any)?.name ?? "Unknown Celebrity"} Fan Card
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor(card.status)}`}>
                      {card.status}
                    </span>
                    <span className="text-yellow-400 text-xs font-bold">${FAN_CARD_PRICE}</span>
                    <span className="text-[var(--accent)] text-xs">
                      {new Date(card.issued_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  {card.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(card.id, "active")}
                        disabled={updating === card.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition disabled:opacity-50">
                        {updating === card.id ? "..." : "✓ Confirm"}
                      </button>
                      <button onClick={() => updateStatus(card.id, "rejected")}
                        disabled={updating === card.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition disabled:opacity-50">
                        {updating === card.id ? "..." : "✕ Reject"}
                      </button>
                    </>
                  )}
                  {card.status === "active" && (
                    <button onClick={() => updateStatus(card.id, "rejected")}
                      disabled={updating === card.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition disabled:opacity-50">
                      {updating === card.id ? "..." : "✕ Reject"}
                    </button>
                  )}
                  {card.status === "rejected" && (
                    <button onClick={() => updateStatus(card.id, "active")}
                      disabled={updating === card.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition disabled:opacity-50">
                      {updating === card.id ? "..." : "✓ Confirm"}
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
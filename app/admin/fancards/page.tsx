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
  profiles: { name: string } | null;
  celebrities: { name: string; image_url: string } | null;
};

export default function AdminFanCardsPage() {
  const supabase = createClient();
  const [fanCards, setFanCards] = useState<FanCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("fan_cards")
        .select("id, issued_at, card_image_url, profiles(name), celebrities(name, image_url)")
        .order("issued_at", { ascending: false });
      setFanCards((data as any) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = fanCards.length * FAN_CARD_PRICE;

  return (
    <AdminShell title="Fan Cards" subtitle="All issued fan cards">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
          <p className="text-[var(--accent)] text-xs mb-2">Total Fan Cards</p>
          <p className="text-3xl font-bold text-white">{fanCards.length}</p>
        </div>
        <div className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
          <p className="text-[var(--accent)] text-xs mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-yellow-400">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : fanCards.length === 0 ? (
        <div className="text-center py-20 text-[var(--accent)] text-sm">No fan cards issued yet.</div>
      ) : (
        <div className="border border-[var(--border)] rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="divide-y divide-[var(--border)]">
            {fanCards.map((card) => (
              <motion.div key={card.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#111] transition">
                {/* Mini fan card */}
                <div className="relative w-10 h-14 rounded-lg overflow-hidden border border-yellow-400/30 flex-shrink-0"
                  style={{ backgroundColor: "#111" }}>
                  {(card.celebrities as any)?.image_url && (
                    <img src={(card.celebrities as any).image_url}
                      alt={(card.celebrities as any)?.name}
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-60" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                    <p className="text-yellow-400 text-[5px] font-bold">★ CELEB</p>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[var(--foreground)] text-sm font-medium">
                    {(card.profiles as any)?.name ?? "Unknown User"}
                  </p>
                  <p className="text-[var(--accent)] text-xs mt-0.5">
                    {(card.celebrities as any)?.name ?? "Unknown Celebrity"} Fan Card
                  </p>
                  <p className="text-[var(--accent)] text-xs mt-0.5">
                    {new Date(card.issued_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <p className="text-yellow-400 font-bold text-sm flex-shrink-0">
                  ${FAN_CARD_PRICE}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
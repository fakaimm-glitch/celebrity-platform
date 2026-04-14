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
  profiles: { name: string } | null;
  celebrities: { name: string; image_url: string } | null;
};

export default function AdminDonationsPage() {
  const supabase = createClient();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("donations")
        .select("id, amount, message, created_at, profiles(name), celebrities(name, image_url)")
        .order("created_at", { ascending: false });
      const list = (data as any) ?? [];
      setDonations(list);
      setTotal(list.reduce((s: number, d: any) => s + (d.amount ?? 0), 0));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AdminShell title="Donations" subtitle="All fan donations">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Donations", value: donations.length, color: "text-white" },
          { label: "Total Amount", value: `$${total.toLocaleString()}`, color: "text-yellow-400" },
          { label: "Average Donation", value: donations.length ? `$${(total / donations.length).toFixed(0)}` : "$0", color: "text-pink-400" },
        ].map((s) => (
          <div key={s.label} className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
            <p className="text-[var(--accent)] text-xs mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-20 text-[var(--accent)] text-sm">No donations yet.</div>
      ) : (
        <div className="border border-[var(--border)] rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="divide-y divide-[var(--border)]">
            {donations.map((donation) => (
              <motion.div key={donation.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#111] transition">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                  {(donation.celebrities as any)?.image_url && (
                    <img src={(donation.celebrities as any).image_url}
                      alt={(donation.celebrities as any)?.name}
                      className="w-full h-full object-cover object-top" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--foreground)] text-sm font-medium">
                    {(donation.profiles as any)?.name ?? "Unknown"} → {(donation.celebrities as any)?.name ?? "Unknown"}
                  </p>
                  {donation.message && (
                    <p className="text-[var(--accent)] text-xs mt-0.5 truncate">"{donation.message}"</p>
                  )}
                  <p className="text-[var(--accent)] text-xs mt-0.5">
                    {new Date(donation.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <p className="text-yellow-400 font-bold text-sm flex-shrink-0">
                  ${donation.amount?.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
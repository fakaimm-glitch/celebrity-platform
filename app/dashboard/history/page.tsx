"use client";

import DashboardShell from "@/components/DashboardShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

type Booking = {
  id: string;
  type: string;
  date: string;
  status: string;
  amount: number;
  celebrity: { name: string; image_url: string };
};

type Donation = {
  id: string;
  amount: number;
  message: string | null;
  created_at: string;
  celebrity: { name: string; image_url: string };
};

type FanCard = {
  id: string;
  card_image_url: string | null;
  issued_at: string;
  celebrity: { name: string; image_url: string };
};

function getCelebSlug(name: string) {
  const map: Record<string, string> = {
    "joe rogan": "joe",
    "taylor swift": "taylor",
    "dwayne johnson": "dwayne",
  };
  return map[name?.toLowerCase()] ?? name?.toLowerCase().replace(/\s+/g, "-");
}

export default function HistoryPage() {
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fanCards, setFanCards] = useState<FanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "donations" | "fancards">("bookings");

  useEffect(() => {
    async function load() {
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) throw new Error("Not authenticated");

        const uid = user.id;

        // Bookings
        const { data: bookingRows, error: bErr } = await supabase
          .from("bookings")
          .select("id, type, date, status, amount, celebrities(name, image_url)")
          .eq("user_id", uid)
          .order("date", { ascending: false });
        if (bErr) throw bErr;

        setBookings((bookingRows ?? []).map((b: any) => ({
          id: b.id,
          type: b.type,
          date: new Date(b.date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
          status: b.status,
          amount: Number(b.amount),
          celebrity: b.celebrities,
        })));

        // Donations
        const { data: donationRows, error: dErr } = await supabase
          .from("donations")
          .select("id, amount, message, created_at, celebrities(name, image_url)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });
        if (dErr) throw dErr;

        setDonations((donationRows ?? []).map((d: any) => ({
          id: d.id,
          amount: Number(d.amount),
          message: d.message,
          created_at: new Date(d.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
          celebrity: d.celebrities,
        })));

        // Fan Cards
        const { data: cardRows, error: cErr } = await supabase
          .from("fan_cards")
          .select("id, card_image_url, issued_at, celebrities(name, image_url)")
          .eq("user_id", uid)
          .order("issued_at", { ascending: false });
        if (cErr) throw cErr;

        setFanCards((cardRows ?? []).map((c: any) => ({
          id: c.id,
          card_image_url: c.card_image_url,
          issued_at: new Date(c.issued_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
          celebrity: c.celebrities,
        })));

      } catch (e: any) {
        setError(e.message ?? "Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusColor = (status: string) => {
    if (status === "confirmed") return "bg-green-400/10 text-green-400";
    if (status === "completed") return "bg-blue-400/10 text-blue-400";
    if (status === "cancelled") return "bg-red-400/10 text-red-400";
    return "bg-white/10 text-gray-400";
  };

  const tabs = [
    { key: "bookings", label: "Bookings", count: bookings.length },
    { key: "donations", label: "Donations", count: donations.length },
    { key: "fancards", label: "Fan Cards", count: fanCards.length },
  ] as const;

  return (
    <DashboardShell title="History" subtitle="Your bookings, donations and fan cards">

      {error && (
        <div className="mb-6 border border-red-400/20 bg-red-400/5 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">History</h1>
        <p className="text-[var(--accent)] text-sm mt-1">All your past bookings, donations and fan cards</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize transition border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-white text-white"
                : "border-transparent text-[var(--accent)] hover:text-white"
            }`}
          >
            {tab.label}
            {!loading && (
              <span className="ml-2 text-xs opacity-60">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📅</p>
              <p className="text-[var(--foreground)] font-semibold mb-2">No bookings yet</p>
              <p className="text-[var(--accent)] text-sm mb-6">Book your first celebrity experience</p>
              <Link href="/celebrities"
                className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Browse Celebrities
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <motion.div key={b.id} variants={fadeUp}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] hover:border-white/20 transition"
                  style={{ backgroundColor: "#0a0a0a" }}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                    {b.celebrity?.image_url ? (
                      <img src={b.celebrity.image_url} alt={b.celebrity.name}
                        className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--foreground)] font-semibold text-sm truncate">
                      {b.celebrity?.name}
                    </p>
                    <p className="text-[var(--accent)] text-xs capitalize mt-0.5">
                      {b.type.replace(/_/g, " ")} · {b.date}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-yellow-400 font-semibold text-sm">
                      ${b.amount.toLocaleString()}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize mt-1 inline-block ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* DONATIONS TAB */}
      {activeTab === "donations" && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">♥</p>
              <p className="text-[var(--foreground)] font-semibold mb-2">No donations yet</p>
              <p className="text-[var(--accent)] text-sm mb-6">Support your favourite celebrities</p>
              <Link href="/celebrities"
                className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Browse Celebrities
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((d) => (
                <motion.div key={d.id} variants={fadeUp}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] hover:border-white/20 transition"
                  style={{ backgroundColor: "#0a0a0a" }}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                    {d.celebrity?.image_url ? (
                      <img src={d.celebrity.image_url} alt={d.celebrity.name}
                        className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">♥</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--foreground)] font-semibold text-sm truncate">
                      {d.celebrity?.name}
                    </p>
                    {d.message && (
                      <p className="text-[var(--accent)] text-xs mt-0.5 truncate">"{d.message}"</p>
                    )}
                    <p className="text-[var(--accent)] text-xs mt-0.5">{d.created_at}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-yellow-400 font-semibold text-sm">
                      ${d.amount.toLocaleString()}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block bg-yellow-400/10 text-yellow-400">
                      Donated
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* FAN CARDS TAB */}
      {activeTab === "fancards" && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : fanCards.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🪪</p>
              <p className="text-[var(--foreground)] font-semibold mb-2">No fan cards yet</p>
              <p className="text-[var(--accent)] text-sm mb-6">Collect exclusive fan cards from your favourite celebrities</p>
              <Link href="/celebrities"
                className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Browse Celebrities
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {fanCards.map((c) => (
                <motion.div key={c.id} variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <Link href={`/celebrities/${getCelebSlug(c.celebrity?.name ?? "")}`}>
                    <div className="relative rounded-2xl overflow-hidden aspect-[2/3] border border-[var(--border)] cursor-pointer group"
                      style={{ backgroundColor: "#111" }}>

                      {/* Background — custom card image or celebrity photo */}
                      {c.card_image_url ? (
                        <img src={c.card_image_url} alt={c.celebrity?.name}
                          className="absolute inset-0 w-full h-full object-cover" />
                      ) : c.celebrity?.image_url ? (
                        <img src={c.celebrity.image_url} alt={c.celebrity?.name}
                          className="absolute inset-0 w-full h-full object-cover object-top opacity-60 group-hover:opacity-80 transition" />
                      ) : null}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Card content */}
                      <div className="absolute inset-0 p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-[9px] font-bold tracking-widest">CELEB</span>
                          <span className="text-yellow-400 text-[9px]">★ OFFICIAL</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold leading-tight">
                            {c.celebrity?.name}
                          </p>
                          <p className="text-yellow-400 text-[9px] mt-0.5">★ Fan Card</p>
                          <p className="text-white/50 text-[9px] mt-1">{c.issued_at}</p>
                        </div>
                      </div>

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-white" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

    </DashboardShell>
  );
}
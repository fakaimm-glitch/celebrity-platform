"use client";
import DashboardShell from "@/components/DashboardShell";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

// ---------- Types ----------
type Profile = {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string;
};

type Booking = {
  id: string;
  type: string;
  date: string;
  status: string;
  amount: number;
  celebrity: { name: string; image_url: string };
  slug: string;
};

type ActivityItem = {
  icon: string;
  text: string;
  time: string;
};

type FanCard = {
  id: string;
  celebrity: { name: string; image_url: string; id: string };
  issued_at: string;
};

type DonationRow = {
  celebrity: { name: string };
  amount: number;
};

type Stats = {
  totalSpent: number;
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  fanCards: number;
  totalDonated: number;
  donationCount: number;
};

// ---------- Helpers ----------
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  if (weeks > 0) return `${weeks}wk ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

function getCelebSlug(name: string) {
  const map: Record<string, string> = {
    "joe rogan": "joe",
    "taylor swift": "taylor",
    "dwayne johnson": "dwayne",
  };
  return map[name.toLowerCase()] ?? name.toLowerCase().replace(/\s+/g, "-");
}

function SkeletonCard() {
  return (
    <div className="border border-[var(--border)] rounded-2xl p-5 animate-pulse" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="h-3 w-24 bg-white/10 rounded mb-3" />
      <div className="h-8 w-16 bg-white/10 rounded mb-2" />
      <div className="h-3 w-32 bg-white/10 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [fanCards, setFanCards] = useState<FanCard[]>([]);
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // --- Auth ---
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) throw new Error("Not authenticated");

        const uid = user.id;

        // --- Profile ---
        const { data: prof } = await supabase
          .from("profiles")
          .select("id, name, avatar_url, role")
          .eq("id", uid)
          .single();
        setProfile(prof);

        // --- Bookings (upcoming, max 3) ---
        const { data: bookingRows, error: bErr } = await supabase
          .from("bookings")
          .select("id, type, date, status, amount, celebrity_id, celebrities(name, image_url)")
          .eq("user_id", uid)
          .order("date", { ascending: true });

        if (bErr) throw bErr;

        const allBookings: Booking[] = (bookingRows ?? []).map((b: any) => ({
          id: b.id,
          type: b.type,
          date: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: b.status,
          amount: Number(b.amount),
          celebrity: b.celebrities,
          slug: getCelebSlug(b.celebrities?.name ?? ""),
        }));

        const upcoming = allBookings.filter(b => b.status !== "completed").slice(0, 3);
        const completed = allBookings.filter(b => b.status === "completed");
        setBookings(upcoming);

        // --- Fan Cards ---
        const { data: cardRows } = await supabase
          .from("fan_cards")
          .select("id, issued_at, celebrity_id, celebrities(id, name, image_url)")
          .eq("user_id", uid)
          .order("issued_at", { ascending: false });

        const cards: FanCard[] = (cardRows ?? []).map((c: any) => ({
          id: c.id,
          celebrity: c.celebrities,
          issued_at: c.issued_at,
        }));
        setFanCards(cards);

        // --- Donations ---
        const { data: donationRows } = await supabase
          .from("donations")
          .select("amount, celebrity_id, celebrities(name)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });

        const donationList: DonationRow[] = (donationRows ?? []).map((d: any) => ({
          celebrity: d.celebrities,
          amount: Number(d.amount),
        }));

        // Aggregate by celebrity
        const donationMap: Record<string, number> = {};
        donationList.forEach(d => {
          const name = d.celebrity?.name ?? "Unknown";
          donationMap[name] = (donationMap[name] ?? 0) + d.amount;
        });
        const aggregated = Object.entries(donationMap).map(([name, amount]) => ({
          celebrity: { name },
          amount,
        }));
        setDonations(aggregated);

        const total = donationList.reduce((sum, d) => sum + d.amount, 0);
        setTotalDonated(total);

        // --- Reviews (for activity feed) ---
        const { data: reviewRows } = await supabase
          .from("reviews")
          .select("rating, created_at, celebrities(name)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(10);

        // Build activity feed from multiple sources
        const activityItems: ActivityItem[] = [];

        (reviewRows ?? []).forEach((r: any) => {
          activityItems.push({
            icon: "★",
            text: `You rated ${r.celebrities?.name} ${r.rating} stars`,
            time: timeAgo(r.created_at),
          });
        });

        (donationRows ?? []).slice(0, 3).forEach((d: any) => {
          activityItems.push({
            icon: "♥",
            text: `Donated $${Number(d.amount).toLocaleString()} to ${d.celebrities?.name}`,
            time: timeAgo(d.created_at),
          });
        });

        cards.slice(0, 2).forEach(c => {
          activityItems.push({
            icon: "🪪",
            text: `Fan card issued — ${c.celebrity?.name}`,
            time: timeAgo(c.issued_at),
          });
        });

        completed.slice(0, 2).forEach(b => {
          activityItems.push({
            icon: "📋",
            text: `Booking with ${b.celebrity?.name} completed`,
            time: b.date,
          });
        });

        // Sort by most recent (crude sort — items already come in desc order)
        setActivity(activityItems.slice(0, 5));

        // --- Stats ---
        const totalSpent = allBookings.reduce((s, b) => s + b.amount, 0);
        setStats({
          totalSpent,
          totalBookings: allBookings.length,
          upcomingBookings: upcoming.length,
          completedBookings: completed.length,
          fanCards: cards.length,
          totalDonated: total,
          donationCount: (donationRows ?? []).length,
        });

      } catch (e: any) {
        setError(e.message ?? "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const displayName = profile?.name?.split(" ")[0] ?? "there";
  const maxDonation = Math.max(...donations.map(d => d.amount), 1);

  return (
    <DashboardShell title="Dashboard" subtitle={`Welcome back, ${displayName}`}>

      {error && (
        <div className="mb-6 border border-red-400/20 bg-red-400/5 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8"
        initial="hidden" animate="visible" variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-4xl font-bold text-[var(--foreground)]">Your Universe</h1>
          <p className="text-[var(--accent)] text-sm mt-1">
            Welcome back, {profile?.name ?? "..."} — here's what's happening
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
          <span className="border border-[var(--border)] text-[var(--foreground)] text-xs px-4 py-2 rounded-full capitalize" style={{ backgroundColor: "#0a0a0a" }}>
            ⭐ {profile?.role ?? "Fan Member"}
          </span>
          {stats && (
            <span className="border border-yellow-400/30 text-yellow-400 text-xs px-4 py-2 rounded-full" style={{ backgroundColor: "#0a0a0a" }}>
              {stats.upcomingBookings} active {stats.upcomingBookings === 1 ? "booking" : "bookings"}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial="hidden" animate="visible" variants={stagger}
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {[
              {
                label: "Total Spent",
                value: `$${(stats?.totalSpent ?? 0).toLocaleString()}`,
                sub: `${stats?.totalBookings ?? 0} total bookings`,
              },
              {
                label: "Bookings",
                value: String(stats?.totalBookings ?? 0),
                sub: `${stats?.upcomingBookings ?? 0} upcoming · ${stats?.completedBookings ?? 0} completed`,
              },
              {
                label: "Fan Cards",
                value: String(stats?.fanCards ?? 0),
                sub: `Across ${stats?.fanCards ?? 0} ${stats?.fanCards === 1 ? "celebrity" : "celebrities"}`,
              },
              {
                label: "Donations",
                value: `$${(stats?.totalDonated ?? 0).toLocaleString()}`,
                sub: `${stats?.donationCount ?? 0} donations total`,
              },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}
                className="border border-[var(--border)] rounded-2xl p-5"
                style={{ backgroundColor: "#0a0a0a" }}
              >
                <p className="text-[var(--accent)] text-xs uppercase tracking-widest mb-2">{s.label}</p>
                <p className="text-[var(--foreground)] text-2xl font-bold mb-1">{s.value}</p>
                <p className="text-[var(--accent)] text-xs">{s.sub}</p>
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Bookings + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Upcoming Bookings */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-6"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[var(--foreground)] font-semibold">Upcoming Bookings</h2>
            <Link href="/dashboard/history" className="text-[var(--accent)] text-xs hover:text-[var(--foreground)] transition">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[var(--accent)] text-sm">No upcoming bookings</p>
              <Link href="/celebrities" className="text-yellow-400 text-xs mt-2 inline-block hover:underline">
                Browse celebrities →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <motion.div key={b.id} variants={fadeUp}
                  className="flex items-center gap-4 p-3 rounded-xl border border-[var(--border)] hover:border-white/20 transition"
                  style={{ backgroundColor: "#111" }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--border)] flex-shrink-0">
                    {b.celebrity?.image_url ? (
                      <img src={b.celebrity.image_url} alt={b.celebrity.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--foreground)] text-sm font-semibold truncate">{b.celebrity?.name}</p>
                    <p className="text-[var(--accent)] text-xs capitalize">{b.type.replace(/_/g, " ")} · {b.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-yellow-400 text-sm font-semibold">${b.amount.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                      b.status === "confirmed" ? "bg-green-400/10 text-green-400" :
                      b.status === "pending" ? "bg-white/10 text-[var(--accent)]" :
                      "bg-red-400/10 text-red-400"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-6"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <h2 className="text-[var(--foreground)] font-semibold mb-5">Recent Activity</h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
                  <div className="flex-1 h-4 bg-white/5 rounded animate-pulse mt-1" />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-[var(--accent)] text-sm text-center py-10">No activity yet</p>
          ) : (
            <div className="space-y-4">
              {activity.map((a, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: "#111" }}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--foreground)] text-sm leading-snug">{a.text}</p>
                  </div>
                  <span className="text-[var(--accent)] text-xs flex-shrink-0">{a.time}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>

      {/* Fan Cards + Donation Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Fan Cards */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-6"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[var(--foreground)] font-semibold">Fan Cards</h2>
            <Link href="/celebrities" className="text-[var(--accent)] text-xs hover:text-[var(--foreground)] transition">
              Collect more →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : fanCards.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[var(--accent)] text-sm">No fan cards yet</p>
              <Link href="/celebrities" className="text-yellow-400 text-xs mt-2 inline-block hover:underline">
                Get your first card →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {fanCards.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/celebrities/${getCelebSlug(c.celebrity?.name ?? "")}`}>
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="relative rounded-xl overflow-hidden aspect-[2/3] border border-[var(--border)] cursor-pointer"
                    style={{ backgroundColor: "#111" }}
                  >
                    {c.celebrity?.image_url && (
                      <img src={c.celebrity.image_url} alt={c.celebrity.name}
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-50" />
                    )}
                    <div className="absolute inset-0 p-2 flex flex-col justify-between">
                      <span className="text-white text-[9px] font-bold tracking-widest">CELEB</span>
                      <div>
                        <p className="text-white text-xs font-bold leading-tight">{c.celebrity?.name}</p>
                        <p className="text-yellow-400 text-[9px]">★ Fan Card</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Donation Impact */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-6"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <h2 className="text-[var(--foreground)] font-semibold mb-5">Donation Impact</h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-32 bg-white/5 rounded animate-pulse mb-2" />
                  <div className="h-1.5 rounded-full bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : donations.length === 0 ? (
            <p className="text-[var(--accent)] text-sm text-center py-10">No donations yet</p>
          ) : (
            <div className="space-y-4">
              {donations.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[var(--foreground)] text-xs">{d.celebrity?.name}</span>
                    <span className="text-[var(--accent)] text-xs">${d.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(d.amount / maxDonation) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
              <div className="border-t border-[var(--border)] pt-4 flex justify-between">
                <span className="text-[var(--accent)] text-sm">Total donated</span>
                <span className="text-[var(--foreground)] font-bold">${totalDonated.toLocaleString()}</span>
              </div>
            </div>
          )}
        </motion.div>

      </div>

    </DashboardShell>
  );
}
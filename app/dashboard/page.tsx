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
  visible: { transition: { staggerChildren: 0.08 } },
} as const;

type Profile = { id: string; name: string; avatar_url: string | null; role: string; };
type ActivityItem = { icon: string; text: string; time: string; };
type FanCard = { id: string; celebrity: { name: string; image_url: string; id: string }; issued_at: string; };
type DonationRow = { celebrity: { name: string }; amount: number; };
type Stats = {
  totalSpent: number; totalBookings: number; upcomingBookings: number;
  completedBookings: number; fanCards: number; totalDonated: number; donationCount: number;
};

const celebrities = [
  { slug: "joe", name: "Joe Rogan", category: "Comedian & Podcaster", image_url: "/celebs/joe.jpg", price: 300000, rating: 4.8 },
  { slug: "taylor", name: "Taylor Swift", category: "Musician & Singer-Songwriter", image_url: "/celebs/tai.jpg", price: 750000, rating: 5.0 },
  { slug: "dwayne", name: "Dwayne Johnson", category: "Actor & Entertainer", image_url: "/celebs/dwane.avif", price: 400000, rating: 4.8 },
];

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
  const map: Record<string, string> = { "joe rogan": "joe", "taylor swift": "taylor", "dwayne johnson": "dwayne" };
  return map[name.toLowerCase()] ?? name.toLowerCase().replace(/\s+/g, "-");
}

function SkeletonCard() {
  return (
    <div className="border border-[var(--border)] rounded-2xl p-4 animate-pulse" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="h-3 w-20 bg-white/10 rounded mb-3" />
      <div className="h-7 w-14 bg-white/10 rounded mb-2" />
      <div className="h-3 w-28 bg-white/10 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [fanCards, setFanCards] = useState<FanCard[]>([]);
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) throw new Error("Not authenticated");
        const uid = user.id;

        const { data: prof } = await supabase
          .from("profiles").select("id, name, avatar_url, role").eq("id", uid).single();
        setProfile(prof);

        const { data: bookingRows, error: bErr } = await supabase
          .from("bookings")
          .select("id, type, date, status, amount, celebrity_id, celebrities(name, image_url)")
          .eq("user_id", uid).order("date", { ascending: true });
        if (bErr) throw bErr;

        const allBookings = (bookingRows ?? []).map((b: any) => ({
          id: b.id, type: b.type,
          date: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: b.status, amount: Number(b.amount),
          celebrity: b.celebrities, slug: getCelebSlug(b.celebrities?.name ?? ""),
        }));

        const upcoming = allBookings.filter((b: any) => b.status !== "completed");
        const completed = allBookings.filter((b: any) => b.status === "completed");

        const { data: cardRows } = await supabase
          .from("fan_cards").select("id, issued_at, celebrity_id, celebrities(id, name, image_url)")
          .eq("user_id", uid).order("issued_at", { ascending: false });

        const cards: FanCard[] = (cardRows ?? []).map((c: any) => ({
          id: c.id, celebrity: c.celebrities, issued_at: c.issued_at,
        }));
        setFanCards(cards);

        const { data: donationRows } = await supabase
          .from("donations").select("amount, created_at, celebrity_id, celebrities(name)")
          .eq("user_id", uid).order("created_at", { ascending: false });

        const donationList: DonationRow[] = (donationRows ?? []).map((d: any) => ({
          celebrity: d.celebrities, amount: Number(d.amount),
        }));

        const donationMap: Record<string, number> = {};
        donationList.forEach(d => { const name = d.celebrity?.name ?? "Unknown"; donationMap[name] = (donationMap[name] ?? 0) + d.amount; });
        setDonations(Object.entries(donationMap).map(([name, amount]) => ({ celebrity: { name }, amount })));

        const total = donationList.reduce((sum, d) => sum + d.amount, 0);
        setTotalDonated(total);

        const { data: reviewRows } = await supabase
          .from("reviews").select("rating, created_at, celebrities(name)")
          .eq("user_id", uid).order("created_at", { ascending: false }).limit(10);

        const activityItems: ActivityItem[] = [];
        (reviewRows ?? []).forEach((r: any) => activityItems.push({ icon: "★", text: `You rated ${r.celebrities?.name} ${r.rating} stars`, time: timeAgo(r.created_at) }));
        (donationRows ?? []).slice(0, 3).forEach((d: any) => activityItems.push({ icon: "♥", text: `Donated $${Number(d.amount).toLocaleString()} to ${d.celebrities?.name}`, time: timeAgo(d.created_at) }));
        cards.slice(0, 2).forEach(c => activityItems.push({ icon: "🪪", text: `Fan card issued — ${c.celebrity?.name}`, time: timeAgo(c.issued_at) }));
        completed.slice(0, 2).forEach((b: any) => activityItems.push({ icon: "📋", text: `Booking with ${b.celebrity?.name} completed`, time: b.date }));
        setActivity(activityItems.slice(0, 5));

        setStats({
          totalSpent: allBookings.reduce((s: number, b: any) => s + b.amount, 0),
          totalBookings: allBookings.length, upcomingBookings: upcoming.length,
          completedBookings: completed.length, fanCards: cards.length,
          totalDonated: total, donationCount: (donationRows ?? []).length,
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
        <div className="mb-4 border border-red-400/20 bg-red-400/5 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Header — compact on mobile */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-5"
        initial="hidden" animate="visible" variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-2xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight">Your Universe</h1>
          <p className="text-[var(--accent)] text-xs sm:text-sm mt-0.5">
            Welcome back, {profile?.name ?? "..."} — here's what's happening
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
          <span className="border border-[var(--border)] text-[var(--foreground)] text-xs px-3 py-1.5 rounded-full capitalize" style={{ backgroundColor: "#0a0a0a" }}>
            ⭐ {profile?.role ?? "fan"}
          </span>
          {stats && (
            <span className="border border-yellow-400/30 text-yellow-400 text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "#0a0a0a" }}>
              {stats.upcomingBookings} active {stats.upcomingBookings === 1 ? "booking" : "bookings"}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Stats — 2 col on mobile, 4 on desktop */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5"
        initial="hidden" animate="visible" variants={stagger}
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          [
            { label: "Total Spent", value: `$${(stats?.totalSpent ?? 0).toLocaleString()}`, sub: `${stats?.totalBookings ?? 0} bookings` },
            { label: "Bookings", value: String(stats?.totalBookings ?? 0), sub: `${stats?.upcomingBookings ?? 0} upcoming` },
            { label: "Fan Cards", value: String(stats?.fanCards ?? 0), sub: `${stats?.fanCards ?? 0} celebrities` },
            { label: "Donations", value: `$${(stats?.totalDonated ?? 0).toLocaleString()}`, sub: `${stats?.donationCount ?? 0} total` },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp}
              className="border border-[var(--border)] rounded-2xl p-4"
              style={{ backgroundColor: "#0a0a0a" }}>
              <p className="text-[var(--accent)] text-[10px] uppercase tracking-widest mb-1.5">{s.label}</p>
              <p className="text-[var(--foreground)] text-xl sm:text-2xl font-bold mb-0.5">{s.value}</p>
              <p className="text-[var(--accent)] text-[10px]">{s.sub}</p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Quick Start + Activity — stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* Quick Start */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-4"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[var(--foreground)] font-semibold text-sm">Quick Start</h2>
              <p className="text-[var(--accent)] text-[10px] mt-0.5">Book, donate or get a fan card</p>
            </div>
            <Link href="/celebrities" className="text-[var(--accent)] text-xs hover:text-[var(--foreground)] transition">
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {celebrities.map((celeb) => (
              <div key={celeb.slug}>
                <Link href={`/celebrities/${celeb.slug}`}>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border)] hover:border-white/20 hover:bg-white/5 transition cursor-pointer group"
                    style={{ backgroundColor: "#111" }}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={celeb.image_url} alt={celeb.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--foreground)] text-xs font-semibold truncate">{celeb.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-yellow-400 text-[10px]">★ {celeb.rating}</span>
                        <span className="text-[var(--accent)] text-[10px]">· From ${celeb.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-[var(--accent)] text-xs group-hover:text-white transition flex-shrink-0">→</span>
                  </div>
                </Link>

                {/* Quick action pills */}
                <div className="flex gap-1.5 mt-1.5 pl-13">
                  <Link href={`/celebrities/${celeb.slug}`}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--accent)] hover:text-white hover:border-white/30 transition"
                    style={{ backgroundColor: "#0a0a0a" }}>
                    🎬 Book
                  </Link>
                  <Link href={`/celebrities/${celeb.slug}`}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--accent)] hover:text-white hover:border-white/30 transition"
                    style={{ backgroundColor: "#0a0a0a" }}>
                    ♥ Donate
                  </Link>
                  <Link href={`/celebrities/${celeb.slug}`}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--accent)] hover:text-white hover:border-white/30 transition"
                    style={{ backgroundColor: "#0a0a0a" }}>
                    🪪 Card
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-4"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <h2 className="text-[var(--foreground)] font-semibold text-sm mb-4">Recent Activity</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
                  <div className="flex-1 h-3 bg-white/5 rounded animate-pulse mt-2" />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🌟</p>
              <p className="text-[var(--accent)] text-xs mb-1">No activity yet</p>
              <p className="text-[var(--accent)] text-[10px]">Start by booking a celebrity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((a, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: "#111" }}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--foreground)] text-xs leading-snug">{a.text}</p>
                  </div>
                  <span className="text-[var(--accent)] text-[10px] flex-shrink-0">{a.time}</span>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="border-t border-[var(--border)] mt-4 pt-3 flex gap-4">
              <Link href="/dashboard/history" className="text-[10px] text-[var(--accent)] hover:text-white transition">📅 All bookings →</Link>
              <Link href="/dashboard/history" className="text-[10px] text-[var(--accent)] hover:text-white transition">🪪 My cards →</Link>
            </div>
          )}
        </motion.div>

      </div>

      {/* Fan Cards + Donation Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Fan Cards */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-4"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[var(--foreground)] font-semibold text-sm">Fan Cards</h2>
            <Link href="/celebrities" className="text-[var(--accent)] text-xs hover:text-[var(--foreground)] transition">Collect more →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : fanCards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🪪</p>
              <p className="text-[var(--accent)] text-xs">No fan cards yet</p>
              <Link href="/celebrities" className="text-yellow-400 text-[10px] mt-1.5 inline-block hover:underline">Get your first card →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {fanCards.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/celebrities/${getCelebSlug(c.celebrity?.name ?? "")}`}>
                  <motion.div
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="relative rounded-xl overflow-hidden aspect-[2/3] border border-[var(--border)] cursor-pointer"
                    style={{ backgroundColor: "#111" }}
                  >
                    {c.celebrity?.image_url && (
                      <img src={c.celebrity.image_url} alt={c.celebrity.name}
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-0 p-1.5 flex flex-col justify-between">
                      <span className="text-white text-[8px] font-bold tracking-widest">CELEB</span>
                      <div>
                        <p className="text-white text-[10px] font-bold leading-tight">{c.celebrity?.name}</p>
                        <p className="text-yellow-400 text-[8px]">★ Fan Card</p>
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
          className="border border-[var(--border)] rounded-2xl p-4"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <h2 className="text-[var(--foreground)] font-semibold text-sm mb-4">Donation Impact</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-28 bg-white/5 rounded animate-pulse mb-1.5" />
                  <div className="h-1.5 rounded-full bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">♥</p>
              <p className="text-[var(--accent)] text-xs">No donations yet</p>
              <Link href="/celebrities" className="text-yellow-400 text-[10px] mt-1.5 inline-block hover:underline">Support a celebrity →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
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
              <div className="border-t border-[var(--border)] pt-3 flex justify-between">
                <span className="text-[var(--accent)] text-xs">Total donated</span>
                <span className="text-[var(--foreground)] font-bold text-sm">${totalDonated.toLocaleString()}</span>
              </div>
            </div>
          )}
        </motion.div>

      </div>

    </DashboardShell>
  );
}
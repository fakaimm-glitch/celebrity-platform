"use client";
import AdminShell from "@/components/AdminShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const;

type Stats = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalDonations: number;
  totalDonationAmount: number;
  totalFanCards: number;
  totalUsers: number;
  totalRevenue: number;
};

type RecentBooking = {
  id: string;
  status: string;
  amount: number;
  type: string;
  created_at: string;
  profiles: { name: string } | null;
  celebrities: { name: string } | null;
};

export default function AdminOverviewPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { data: bookings },
        { data: donations },
        { data: fanCards },
        { data: users },
      ] = await Promise.all([
        supabase.from("bookings").select("id, status, amount"),
        supabase.from("donations").select("id, amount"),
        supabase.from("fan_cards").select("id"),
        supabase.from("profiles").select("id"),
      ]);

      const { data: recent } = await supabase
        .from("bookings")
        .select("id, status, amount, type, created_at, profiles(name), celebrities(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      const totalRevenue =
        (bookings ?? []).filter(b => b.status === "confirmed").reduce((s, b) => s + (b.amount ?? 0), 0) +
        (donations ?? []).reduce((s, d) => s + (d.amount ?? 0), 0);

      setStats({
        totalBookings: bookings?.length ?? 0,
        pendingBookings: (bookings ?? []).filter(b => b.status === "pending").length,
        confirmedBookings: (bookings ?? []).filter(b => b.status === "confirmed").length,
        totalDonations: donations?.length ?? 0,
        totalDonationAmount: (donations ?? []).reduce((s, d) => s + (d.amount ?? 0), 0),
        totalFanCards: fanCards?.length ?? 0,
        totalUsers: users?.length ?? 0,
        totalRevenue,
      });

      setRecentBookings((recent as any) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = stats ? [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, sub: "Confirmed bookings + donations", color: "text-yellow-400" },
    { label: "Total Bookings", value: stats.totalBookings, sub: `${stats.pendingBookings} pending · ${stats.confirmedBookings} confirmed`, color: "text-white" },
    { label: "Pending Bookings", value: stats.pendingBookings, sub: "Awaiting confirmation", color: "text-orange-400" },
    { label: "Total Donations", value: stats.totalDonations, sub: `$${stats.totalDonationAmount.toLocaleString()} total amount`, color: "text-pink-400" },
    { label: "Fan Cards Sold", value: stats.totalFanCards, sub: `$${(stats.totalFanCards * 49.99).toFixed(2)} revenue`, color: "text-blue-400" },
    { label: "Total Users", value: stats.totalUsers, sub: "Registered accounts", color: "text-green-400" },
  ] : [];

  function statusColor(status: string) {
    if (status === "confirmed") return "text-green-400 bg-green-400/10 border-green-400/20";
    if (status === "pending") return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    if (status === "rejected") return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }

  return (
    <AdminShell title="Overview" subtitle="Platform at a glance">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">

          {/* Stat Cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((card) => (
              <div key={card.label}
                className="border border-[var(--border)] rounded-2xl p-5"
                style={{ backgroundColor: "#0a0a0a" }}>
                <p className="text-[var(--accent)] text-xs mb-2">{card.label}</p>
                <p className={`text-3xl font-bold mb-1 ${card.color}`}>{card.value}</p>
                <p className="text-[var(--accent)] text-xs">{card.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[var(--foreground)] font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Review Bookings", href: "/admin/bookings", icon: "📅", urgent: (stats?.pendingBookings ?? 0) > 0 },
                { label: "View Donations", href: "/admin/donations", icon: "♥", urgent: false },
                { label: "Fan Cards", href: "/admin/fancards", icon: "🪪", urgent: false },
                { label: "Platform Settings", href: "/admin/settings", icon: "⚙️", urgent: false },
              ].map((action) => (
                <Link key={action.label} href={action.href}
                  className="relative border border-[var(--border)] rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:border-white/20 hover:bg-[#111] transition"
                  style={{ backgroundColor: "#0a0a0a" }}>
                  {action.urgent && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  )}
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-[var(--foreground)] text-xs font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[var(--foreground)] font-semibold">Recent Bookings</h2>
              <Link href="/admin/bookings"
                className="text-yellow-400 text-xs hover:text-yellow-300 transition">
                View all →
              </Link>
            </div>
            <div className="border border-[var(--border)] rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
              {recentBookings.length === 0 ? (
                <p className="text-[var(--accent)] text-sm text-center py-8">No bookings yet.</p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between px-5 py-4 hover:bg-[#111] transition">
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--foreground)] text-sm font-medium truncate">
                          {(booking.profiles as any)?.name ?? "Unknown User"}
                        </p>
                        <p className="text-[var(--accent)] text-xs mt-0.5">
                          {(booking.celebrities as any)?.name ?? "Unknown Celebrity"} · {booking.type?.replace(/_/g, " ")}
                        </p>
                        <p className="text-[var(--accent)] text-xs mt-0.5">
                          {new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="text-[var(--foreground)] text-sm font-bold">
                          ${booking.amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      )}
    </AdminShell>
  );
}
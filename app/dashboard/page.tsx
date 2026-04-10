"use client";
import DashboardShell from "@/components/DashboardShell";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const stats = [
  { label: "Total Spent", value: "$2,480", sub: "↑ 18% this month" },
  { label: "Bookings", value: "7", sub: "3 upcoming · 4 completed" },
  { label: "Fan Cards", value: "3", sub: "Across 3 celebrities" },
  { label: "Donations", value: "$340", sub: "To 3 stars total" },
];

const bookings = [
  { name: "Joe Rogan", type: "Backstage Pass", date: "Apr 14, 2026", amount: "$300,000", status: "Confirmed", slug: "joe" },
  { name: "Taylor Swift", type: "One on One", date: "Apr 22, 2026", amount: "$750,000", status: "Pending", slug: "taylor" },
  { name: "Dwayne Johnson", type: "Private Event", date: "May 3, 2026", amount: "$400,000", status: "Pending", slug: "dwayne" },
];

const activity = [
  { icon: "★", text: "You rated Joe Rogan 5 stars", time: "2h ago" },
  { icon: "♥", text: "Donated $50 to Taylor Swift", time: "1d ago" },
  { icon: "🪪", text: "Fan card issued — Dwayne Johnson", time: "3d ago" },
  { icon: "📋", text: "Booking #BK-0042 completed", time: "5d ago" },
  { icon: "✉", text: "Subscribed to newsletter", time: "1wk ago" },
];

export default function DashboardPage() {
  return (
    <DashboardShell title="Dashboard" subtitle="Welcome back, Jordan">

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8"
        initial="hidden" animate="visible" variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <h1 className="text-4xl font-bold text-[var(--foreground)]">Your Universe</h1>
          <p className="text-[var(--accent)] text-sm mt-1">Welcome back, Jordan — here's what's happening</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
          <span className="border border-[var(--border)] text-[var(--foreground)] text-xs px-4 py-2 rounded-full" style={{ backgroundColor: "#0a0a0a" }}>
            ⭐ Fan Member
          </span>
          <span className="border border-yellow-400/30 text-yellow-400 text-xs px-4 py-2 rounded-full" style={{ backgroundColor: "#0a0a0a" }}>
            3 active bookings
          </span>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial="hidden" animate="visible" variants={stagger}
      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeUp}
            className="border border-[var(--border)] rounded-2xl p-5"
            style={{ backgroundColor: "#0a0a0a" }}
          >
            <p className="text-[var(--accent)] text-xs uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-[var(--foreground)] text-2xl font-bold mb-1">{s.value}</p>
            <p className="text-[var(--accent)] text-xs">{s.sub}</p>
          </motion.div>
        ))}
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
          <div className="space-y-4">
            {bookings.map((b, i) => (
              <motion.div key={i} variants={fadeUp}
                className="flex items-center gap-4 p-3 rounded-xl border border-[var(--border)] hover:border-white/20 transition"
                style={{ backgroundColor: "#111" }}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--border)] flex items-center justify-center text-lg flex-shrink-0">
                  {i === 0 ? "🎙️" : i === 1 ? "🎵" : "🎬"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--foreground)] text-sm font-semibold truncate">{b.name}</p>
                  <p className="text-[var(--accent)] text-xs">{b.type} · {b.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-yellow-400 text-sm font-semibold">{b.amount}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${b.status === "Confirmed" ? "bg-green-400/10 text-green-400" : "bg-white/10 text-[var(--accent)]"}`}>
                    {b.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-6"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <h2 className="text-[var(--foreground)] font-semibold mb-5">Recent Activity</h2>
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
          <div className="grid grid-cols-3 gap-3">
            {bookings.map((b, i) => (
              <Link key={i} href={`/celebrities/${b.slug}`}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative rounded-xl overflow-hidden aspect-[2/3] border border-[var(--border)] cursor-pointer"
                  style={{ backgroundColor: "#111" }}
                >
                  <div className="absolute inset-0 p-2 flex flex-col justify-between">
                    <span className="text-[var(--foreground)] text-[9px] font-bold tracking-widest">CELEB</span>
                    <div>
                      <p className="text-[var(--foreground)] text-xs font-bold leading-tight">{b.name}</p>
                      <p className="text-yellow-400 text-[9px]">★ Fan Card</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Donation Impact */}
        <motion.div
          className="border border-[var(--border)] rounded-2xl p-6"
          style={{ backgroundColor: "#0a0a0a" }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <h2 className="text-[var(--foreground)] font-semibold mb-5">Donation Impact</h2>
          <div className="space-y-4">
            {[
              { name: "Joe Rogan", amount: 140, max: 340 },
              { name: "Taylor Swift", amount: 90, max: 340 },
              { name: "Dwayne Johnson", amount: 60, max: 340 },
            ].map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--foreground)] text-xs">{d.name}</span>
                  <span className="text-[var(--accent)] text-xs">${d.amount}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(d.amount / d.max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
            <div className="border-t border-[var(--border)] pt-4 flex justify-between">
              <span className="text-[var(--accent)] text-sm">Total donated</span>
              <span className="text-[var(--foreground)] font-bold">$340</span>
            </div>
          </div>
        </motion.div>

      </div>

    </DashboardShell>
  );
}
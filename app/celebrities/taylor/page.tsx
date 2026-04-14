"use client";
import DashboardShell from "@/components/DashboardShell";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const staticCelebrity = {
  name: "Taylor Swift",
  category: "Musician & Singer-Songwriter",
  country: "United States",
  price: 750000,
  rating: 5.0,
  reviews_count: 312,
  bio: "Taylor Swift is a global pop icon and one of the best-selling music artists of all time. With multiple Grammy Awards and a record-breaking Eras Tour, she has redefined what it means to be a generational talent in the music industry.",
  image_url: "/celebs/tai.jpg",
  tags: ["Musician", "Singer-Songwriter", "Producer"],
};

const similar = [
  { id: "joe", name: "Joe Rogan", category: "Comedian & Podcaster", price: 300000, rating: 4.8, image_url: "/celebs/joe.jpg" },
  { id: "dwayne", name: "Dwayne Johnson", category: "Actor", price: 400000, rating: 4.8, image_url: "/celebs/dwane.avif" },
];

const reviews = [
  { id: "1", name: "Emma W.", rating: 5, comment: "Taylor was warm, kind and absolutely magical in person. A dream come true!", date: "March 2025", initial: "E" },
  { id: "2", name: "Sofia K.", rating: 5, comment: "VIP meet & greet was perfectly organised. She remembered my name!", date: "February 2025", initial: "S" },
  { id: "3", name: "Hannah P.", rating: 5, comment: "Worth every single dollar. The most unforgettable night of my life.", date: "January 2025", initial: "H" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
} as const;

export default function TaylorSwiftPage() {
  const router = useRouter();
  const supabase = createClient();

  const [celebrityId, setCelebrityId] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState("private_event");
  const [donationAmount, setDonationAmount] = useState(100);
  const [activeTab, setActiveTab] = useState<"book" | "donate" | "fancard">("book");

  useEffect(() => {
    supabase
      .from("celebrities")
      .select("id")
      .ilike("name", "taylor swift")
      .single()
      .then(({ data }) => {
        if (data) setCelebrityId(data.id);
      });
  }, []);

  function goToBooking() {
    if (!celebrityId) return;
    router.push(`/dashboard/checkout/booking?celebrity_id=${celebrityId}&type=${bookingType}`);
  }

  function goToDonate() {
    if (!celebrityId) return;
    router.push(`/dashboard/checkout/donate?celebrity_id=${celebrityId}&amount=${donationAmount}`);
  }

  function goToFanCard() {
    if (!celebrityId) return;
    router.push(`/dashboard/checkout/fancard?celebrity_id=${celebrityId}`);
  }

  return (
    <DashboardShell title="Taylor Swift" subtitle="Musician & Singer-Songwriter">
      <div className="-mx-6 -mt-8">
        <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
          <img src={staticCelebrity.image_url} alt={staticCelebrity.name}
            className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <motion.div className="relative z-10 w-full px-6 pb-10" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex gap-2 mb-3 flex-wrap">
              {staticCelebrity.tags.map((tag) => (
                <span key={tag} className="border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full backdrop-blur-sm">{tag}</span>
              ))}
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold text-white mb-3">{staticCelebrity.name}</motion.h1>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-yellow-400 font-semibold">★ {staticCelebrity.rating} <span className="text-white/50 font-normal">({staticCelebrity.reviews_count} reviews)</span></span>
              <span className="text-white/50">📍 {staticCelebrity.country}</span>
              <span className="text-white/50">🎵 {staticCelebrity.category}</span>
              <span className="text-white font-semibold">From ${staticCelebrity.price.toLocaleString()}</span>
            </motion.div>
          </motion.div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        <div className="lg:col-span-2 space-y-12">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-[var(--foreground)] text-xl font-semibold mb-4">About</h2>
            <p className="text-[var(--accent)] text-sm leading-relaxed">{staticCelebrity.bio}</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-[var(--foreground)] text-xl font-semibold mb-6">
              Reviews <span className="text-[var(--accent)] text-sm font-normal ml-1">({reviews.length})</span>
            </motion.h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <motion.div key={r.id} variants={fadeUp}
                  className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">{r.initial}</div>
                    <div>
                      <p className="text-[var(--foreground)] text-sm font-semibold">{r.name}</p>
                      <p className="text-[var(--accent)] text-xs">{r.date}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(r.rating)].map((_, i) => (<span key={i} className="text-yellow-400 text-sm">★</span>))}
                    </div>
                  </div>
                  <p className="text-[var(--accent)] text-sm leading-relaxed">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-[var(--foreground)] text-xl font-semibold mb-6">Similar Celebrities</motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similar.map((s) => (
                <motion.div key={s.id} variants={fadeUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <Link href={`/celebrities/${s.id}`}
                    className="block border border-[var(--border)] rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
                    <img src={s.image_url} alt={s.name} className="w-full h-36 object-cover object-top" />
                    <div className="p-3">
                      <p className="text-[var(--foreground)] text-sm font-semibold">{s.name}</p>
                      <p className="text-[var(--accent)] text-xs">{s.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-yellow-400 text-xs">★ {s.rating}</span>
                        <span className="text-[var(--foreground)] text-xs font-semibold">${s.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="sticky top-24 border border-[var(--border)] rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>

            <div className="flex border-b border-[var(--border)]">
              {[{ key: "book", label: "🎬 Book" }, { key: "donate", label: "♥ Donate" }, { key: "fancard", label: "🪪 Fan Card" }].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex-1 py-3 text-xs font-semibold transition ${activeTab === tab.key ? "text-[var(--foreground)] border-b-2 border-white" : "text-[var(--accent)] hover:text-[var(--foreground)]"}`}
                  style={{ marginBottom: activeTab === tab.key ? "-1px" : "0" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">

              {activeTab === "book" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div>
                    <label className="text-[var(--accent)] text-xs mb-2 block">Experience Type</label>
                    <div className="space-y-2">
                      {[
                        { value: "private_event", label: "Private Event" },
                        { value: "backstage_pass", label: "Backstage Pass" },
                        { value: "one_on_one", label: "One-on-One Meet" },
                      ].map((type) => (
                        <button key={type.value} onClick={() => setBookingType(type.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition ${bookingType === type.value ? "border-white/40 text-white" : "border-[var(--border)] text-[var(--accent)] hover:border-white/20"}`}
                          style={{ backgroundColor: bookingType === type.value ? "#1a1a1a" : "#0a0a0a" }}>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[var(--border)] pt-4">
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-[var(--accent)]">Total</span>
                      <span className="text-[var(--foreground)] font-bold">${staticCelebrity.price.toLocaleString()}</span>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={goToBooking}
                      disabled={!celebrityId}
                      className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {celebrityId ? "Continue" : "Loading..."}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === "donate" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div>
                    <label className="text-[var(--accent)] text-xs mb-2 block">Amount (USD)</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[50, 100, 500, 1000, 5000, 10000].map((amt) => (
                        <button key={amt} onClick={() => setDonationAmount(amt)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition ${donationAmount === amt ? "border-white/40 text-white" : "border-[var(--border)] text-[var(--accent)] hover:border-white/20"}`}
                          style={{ backgroundColor: donationAmount === amt ? "#1a1a1a" : "#0a0a0a" }}>
                          ${amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input type="number" value={donationAmount} onChange={(e) => setDonationAmount(Number(e.target.value))}
                      className="w-full border border-[var(--border)] text-[var(--foreground)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                      style={{ backgroundColor: "#0a0a0a" }} placeholder="Custom amount..." />
                  </div>
                  <div className="border-t border-[var(--border)] pt-4">
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-[var(--accent)]">Total</span>
                      <span className="text-[var(--foreground)] font-bold">${donationAmount.toLocaleString()}</span>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={goToDonate}
                      disabled={!celebrityId}
                      className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {celebrityId ? "Continue" : "Loading..."}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === "fancard" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden h-44 border border-[var(--border)]" style={{ backgroundColor: "#111" }}>
                    <img src={staticCelebrity.image_url} alt={staticCelebrity.name}
                      className="w-full h-full object-cover object-top opacity-60" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-white text-xs font-bold tracking-widest">CELEB</span>
                        <span className="text-yellow-400 text-xs">★ {staticCelebrity.rating}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg leading-tight">{staticCelebrity.name}</p>
                        <p className="text-white/60 text-xs">{staticCelebrity.category} · {staticCelebrity.country}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--accent)] text-xs leading-relaxed">
                    Own an exclusive digital fan card of {staticCelebrity.name}. Limited edition, verified on our platform.
                  </p>
                  <div className="flex justify-between text-sm border-t border-[var(--border)] pt-4">
                    <span className="text-[var(--accent)]">Price</span>
                    <span className="text-[var(--foreground)] font-bold">$49.99</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={goToFanCard}
                    disabled={!celebrityId}
                    className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {celebrityId ? "Get Fan Card" : "Loading..."}
                  </motion.button>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
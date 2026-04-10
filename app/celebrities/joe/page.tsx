"use client";
import DashboardShell from "@/components/DashboardShell";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const celebrity = {
  name: "Joe Rogan",
  category: "Comedian & Podcaster",
  country: "United States",
  price: 300000,
  rating: 4.8,
  reviews_count: 94,
  bio: "Joe Rogan is a stand-up comedian, UFC commentator, and host of The Joe Rogan Experience — the world's most listened-to podcast. Known for his raw, unfiltered conversations with everyone from scientists to athletes to world leaders.",
  image_url: "/celebs/joe.jpg",
  tags: ["Comedian", "Podcaster", "UFC Commentator"],
};

const similar = [
  { id: "taylor", name: "Taylor Swift", category: "Musician", price: 750000, rating: 5.0, image_url: "/celebs/tai.jpg" },
  { id: "dwayne", name: "Dwayne Johnson", category: "Actor", price: 400000, rating: 4.8, image_url: "/celebs/dwane.avif" },
];

const reviews = [
  { id: "1", name: "Marcus T.", rating: 5, comment: "Joe was incredibly genuine and engaging. An unforgettable evening!", date: "March 2025", initial: "M" },
  { id: "2", name: "Lisa R.", rating: 5, comment: "Got backstage at a live show. Joe took time with every single fan.", date: "February 2025", initial: "L" },
  { id: "3", name: "Chris B.", rating: 4, comment: "Amazing experience, he was funny and very down to earth in person.", date: "January 2025", initial: "C" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,  // 👈 add "as const" here
    },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function JoeRoganPage() {
  const [bookingType, setBookingType] = useState("private_event");
  const [bookingDate, setBookingDate] = useState("");
  const [donationAmount, setDonationAmount] = useState(100);
  const [donationMessage, setDonationMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"book" | "donate" | "fancard">("book");

  return (
    <DashboardShell title="Joe Rogan" subtitle="Comedian & Podcaster">

      {/* HERO — full bleed, negative margin to escape shell padding */}
      <div className="-mx-6 -mt-8">
        <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
          <img src={celebrity.image_url} alt={celebrity.name} className="absolute inset-0 w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <motion.div className="relative z-10 w-full px-6 pb-10" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex gap-2 mb-3 flex-wrap">
              {celebrity.tags.map((tag) => (
                <span key={tag} className="border border-white/20 text-white/70 text-xs px-3 py-1 rounded-full backdrop-blur-sm">{tag}</span>
              ))}
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold text-white mb-3">{celebrity.name}</motion.h1>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-yellow-400 font-semibold">★ {celebrity.rating} <span className="text-white/50 font-normal">({celebrity.reviews_count} reviews)</span></span>
              <span className="text-white/50">📍 {celebrity.country}</span>
              <span className="text-white/50">🎙️ {celebrity.category}</span>
              <span className="text-white font-semibold">From ${celebrity.price.toLocaleString()}</span>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-12">

          {/* Bio */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-[var(--foreground)] text-xl font-semibold mb-4">About</h2>
            <p className="text-[var(--accent)] text-sm leading-relaxed">{celebrity.bio}</p>
          </motion.div>

          {/* Reviews */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-[var(--foreground)] text-xl font-semibold mb-6">
              Reviews <span className="text-[var(--accent)] text-sm font-normal ml-1">({reviews.length})</span>
            </motion.h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <motion.div key={r.id} variants={fadeUp} className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
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

          {/* Similar */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-[var(--foreground)] text-xl font-semibold mb-6">Similar Celebrities</motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similar.map((s) => (
                <motion.div key={s.id} variants={fadeUp} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <Link href={`/celebrities/${s.id}`} className="block border border-[var(--border)] rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
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

        {/* RIGHT — Booking Panel */}
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
                      {[{ value: "private_event", label: "Private Event" }, { value: "backstage_pass", label: "Backstage Pass" }, { value: "one_on_one", label: "One-on-One Meet" }].map((type) => (
                        <button key={type.value} onClick={() => setBookingType(type.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition ${bookingType === type.value ? "border-white/40 text-white" : "border-[var(--border)] text-[var(--accent)] hover:border-white/20"}`}
                          style={{ backgroundColor: bookingType === type.value ? "#1a1a1a" : "#0a0a0a" }}>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[var(--accent)] text-xs mb-2 block">Select Date</label>
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full border border-[var(--border)] text-[var(--foreground)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                      style={{ backgroundColor: "#0a0a0a", colorScheme: "dark" }} />
                  </div>
                  <div className="border-t border-[var(--border)] pt-4">
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-[var(--accent)]">Total</span>
                      <span className="text-[var(--foreground)] font-bold">${celebrity.price.toLocaleString()}</span>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[var(--accent)] transition">
                      Confirm Booking
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
                  <div>
                    <label className="text-[var(--accent)] text-xs mb-2 block">Message (optional)</label>
                    <textarea value={donationMessage} onChange={(e) => setDonationMessage(e.target.value)} rows={3} placeholder="Leave a message..."
                      className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--accent)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition resize-none"
                      style={{ backgroundColor: "#0a0a0a" }} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[var(--accent)] transition">
                    Donate ${donationAmount.toLocaleString()}
                  </motion.button>
                </motion.div>
              )}

              {activeTab === "fancard" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden h-44 border border-[var(--border)]" style={{ backgroundColor: "#111" }}>
                    <img src={celebrity.image_url} alt={celebrity.name} className="w-full h-full object-cover object-top opacity-60" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-white text-xs font-bold tracking-widest">CELEB</span>
                        <span className="text-yellow-400 text-xs">★ {celebrity.rating}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg leading-tight">{celebrity.name}</p>
                        <p className="text-white/60 text-xs">{celebrity.category} · {celebrity.country}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--accent)] text-xs leading-relaxed">Own an exclusive digital fan card of {celebrity.name}. Limited edition, verified on our platform.</p>
                  <div className="flex justify-between text-sm border-t border-[var(--border)] pt-4">
                    <span className="text-[var(--accent)]">Price</span>
                    <span className="text-[var(--foreground)] font-bold">$49.99</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[var(--accent)] transition">
                    Get Fan Card
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
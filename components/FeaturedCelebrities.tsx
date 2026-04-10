"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const celebrities = [
  { name: "Joe Rogan", location: "United States", rating: "4.8", img: "/celebs/joe.jpg" },
  { name: "Taylor Swift", location: "United States", rating: "5.0", img: "/celebs/tai.jpg" },
  { name: "Dwayne Johnson", location: "United States", rating: "4.8", img: "/celebs/dwane.avif" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

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

export default function FeaturedCelebrities() {
  return (
    <section className="bg-black py-16 px-6">

      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
      >
        <div className="inline-flex items-center gap-2 border border-[#1f1f1f] rounded-full px-4 py-1.5 text-xs text-[#a0a0a0] mb-4">
          ⭐ Featured Celebrities
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">
          Discover Our Iconic Stars
        </h2>
        <p className="text-[#a0a0a0] text-sm">
          Connect with the most celebrated personalities. Book instantly or dive into our full catalog.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {celebrities.map((celeb) => (
          <motion.div
            key={celeb.name}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-2xl overflow-hidden border border-[#1f1f1f] cursor-pointer"
            style={{ backgroundColor: "#0a0a0a" }}
          >
            {/* Image */}
            <Link href="/signin">
              <div className="relative h-56 overflow-hidden">
                <motion.img
                  src={celeb.img}
                  alt={celeb.name}
                  className="w-full h-full object-cover object-top"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold tracking-widest px-2 py-1 rounded">
                  FEATURED
                </span>
                <span className="absolute top-3 right-3 bg-black/70 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-md">
                  ★ {celeb.rating}
                </span>
              </div>
            </Link>

            {/* Body */}
            <div className="p-4" style={{ backgroundColor: "#0a0a0a" }}>
              <Link href="/signin">
                <h3 className="text-white text-lg font-semibold mb-2 hover:text-[#a0a0a0] transition">
                  {celeb.name}
                </h3>
              </Link>
              <div className="flex flex-col gap-1 mb-4 text-sm text-[#a0a0a0]">
                <span>📍 {celeb.location}</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mb-2">
                <Link href="/signin" className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="w-full bg-white text-black text-xs font-semibold py-2 rounded-lg hover:bg-[#a0a0a0] transition"
                  >
                    🎬 Book Now
                  </motion.button>
                </Link>
                <Link href="/signin" className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="w-full border border-[#1f1f1f] text-white text-xs font-semibold py-2 rounded-lg transition"
                    style={{ backgroundColor: "#0a0a0a" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#111111")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0a0a0a")}
                  >
                    ♥ Donate
                  </motion.button>
                </Link>
              </div>
              <Link href="/signin" className="block">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className="w-full border border-[#1f1f1f] text-[#a0a0a0] text-xs font-semibold py-2 rounded-lg transition"
                  style={{ backgroundColor: "#0a0a0a" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "#111111";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "#0a0a0a";
                    e.currentTarget.style.borderColor = "#1f1f1f";
                    e.currentTarget.style.color = "#a0a0a0";
                  }}
                >
                  🪪 Fan Card
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* See More */}
      <motion.div
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
      >
        <motion.a
          href="/signin"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 border border-[#1f1f1f] text-white px-8 py-3 rounded-full text-sm font-semibold transition"
          style={{ backgroundColor: "#0a0a0a" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#111111")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0a0a0a")}
        >
          View All Celebrities →
        </motion.a>
      </motion.div>

    </section>
  );
}
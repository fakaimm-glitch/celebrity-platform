"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Celebrities" },
  { value: "10K+", label: "Bookings Made" },
  { value: "50+", label: "Countries" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center -mx-4 sm:-mx-6 lg:-mx-8">

      {/* Background Image */}
      <img
        src="/hero.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 mb-8 text-sm text-gray-300 backdrop-blur-sm"
        >
          <span>⭐</span>
          <span>Exclusive VIP Experiences</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
        >
          Experience{" "}
          <span className="text-yellow-400">VIP</span>{" "}
          Moments
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Private events, backstage passes, and one-on-one moments with the celebrities you love most
        </motion.p>

        {/* Browse Categories + Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          
           <a href="/celebrities"
            className="flex items-center gap-2 border border-white/40 text-white px-8 py-4 rounded-full hover:bg-white/10 transition text-sm whitespace-nowrap"
          >
            ☰ Browse Categories
          </a>

          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for your favorite celebrity..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 rounded-full px-6 py-4 pr-14 text-sm focus:outline-none focus:border-white/50"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
              🔍
            </button>
          </div>
        </motion.div>

      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-10"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-6 px-4 bg-black/40 hover:bg-black/60 transition"
            >
              <span className="text-2xl md:text-3xl font-bold text-yellow-400">{stat.value}</span>
              <span className="text-xs text-gray-400 mt-1 tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
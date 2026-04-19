"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/celebs/hero.jpg",
    badge: "🎙️ Podcast Experiences",
    headline: "Go Behind",
    highlight: "The Mic",
    sub: "Private sessions, exclusive interviews, and one-on-one moments with the world's top podcasters and comedians.",
  },
  {
    image: "/celebs/hero2.avif",
    badge: "🎵 Music Experiences",
    headline: "Live Your",
    highlight: "VIP Moment",
    sub: "Backstage passes, meet & greets, and private concerts with the biggest music artists on the planet.",
  },
  {
    image: "/celebs/hero 3.avif",
    badge: "🎬 Hollywood Experiences",
    headline: "Meet Your",
    highlight: "Icon",
    sub: "Exclusive access to Hollywood's elite — private events, set visits, and unforgettable one-on-one encounters.",
  },
];

const stats = [
  { value: "500+", label: "Celebrities" },
  { value: "10K+", label: "Bookings Made" },
  { value: "50+", label: "Countries" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrev(current);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  function goTo(index: number) {
    if (index === current) return;
    setPrev(current);
    setCurrent(index);
  }

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">

      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ zIndex: 0 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/65" style={{ zIndex: 1 }} />

      <div className="relative max-w-4xl mx-auto px-6 py-20 w-full" style={{ zIndex: 2 }}>

        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${current}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 mb-8 text-sm text-gray-300 backdrop-blur-sm"
          >
            <span>{slide.badge}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`headline-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          >
            {slide.headline}{" "}
            <span className="text-yellow-400">{slide.highlight}</span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            {slide.sub}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="/signin" className="flex items-center gap-2 border border-white/40 text-white px-8 py-4 rounded-full hover:bg-white/10 transition text-sm whitespace-nowrap">
            Get Started
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

        <div className="flex items-center justify-center gap-3 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? "w-8 h-2 bg-yellow-400"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative w-full max-w-4xl mx-auto px-6 pb-10"
        style={{ zIndex: 2 }}
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
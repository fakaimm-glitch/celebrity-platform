"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const sponsors = [
  { name: "Visa", logo: "/sponsors/visa.png" },
  { name: "PayPal", logo: "/sponsors/paypay.png" },
  { name: "Live Nation", logo: "/sponsors/live.png" },
  { name: "Ticketmaster", logo: "/sponsors/trick.png" },
  { name: "American Express", logo: "/sponsors/am.png" },
  { name: "Spotify", logo: "/sponsors/sp.png" },
  { name: "YouTube", logo: "/sponsors/yo.png" },
  { name: "AEG Presents", logo: "/sponsors/ag.jpg" },
  { name: "Mastercard", logo: "/sponsors/ma.png" },
  { name: "CAA", logo: "/sponsors/ca.png" },
];

const allSponsors = [...sponsors, ...sponsors];

export default function Sponsors() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="py-16 border-y border-white/10 overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Keyframes injected directly */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 px-6"
      >
        <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
          Trusted & Supported By
        </p>
        <h2 className="text-white/70 text-lg font-semibold">
          Powering world-class celebrity experiences
        </h2>
      </motion.div>

      {/* Slider Track */}
      <div className="relative">

        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #080808, transparent)" }}
        />

        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #080808, transparent)" }}
        />

        {/* Scrolling logos */}
        <div
          ref={trackRef}
          className="marquee-track flex items-center gap-16 w-max py-4"
        >
          {allSponsors.map((sponsor, i) => (
            <img
              key={i}
              src={sponsor.logo}
              alt={sponsor.name}
              className="h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
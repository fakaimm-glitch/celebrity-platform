"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fanCards = [
  { src: "/fan1.webp", alt: "Joe Rogan Fan Card" },
  { src: "/fan4.avif", alt: "Dwayne Johnson Fan Card" },
  { src: "/fan3.jpg", alt: "Beyoncé Fan Card" },
];

export default function FanCards() {
  return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-2 border border-[var(--border)] rounded-full px-4 py-1.5 text-xs text-[var(--accent)] mb-4">
            ⭐ Fan Cards
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--foreground)]">
            Collect Your Favorites
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {fanCards.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              className="rounded-2xl overflow-hidden border border-[var(--border)] cursor-pointer"
              style={{ backgroundColor: "#0a0a0a" }}
            >
              <motion.img
                src={card.src}
                alt={card.alt}
                className="w-full h-80 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
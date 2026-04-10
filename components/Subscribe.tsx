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

export default function Subscribe() {
  return (
    <section className="py-24 bg-[var(--background)] border-t border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-6 text-center">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-4">
            <div className="inline-flex items-center gap-2 border border-[var(--border)] rounded-full px-4 py-1.5 text-xs text-[var(--accent)]">
              ⭐ Stay Updated
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-[var(--foreground)] mb-4"
          >
            Never Miss a VIP Moment
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-[var(--accent)] mb-10 max-w-xl mx-auto text-sm"
          >
            Subscribe to get exclusive celebrity updates, early access to bookings,
            fan card drops, and VIP event announcements straight to your inbox.
          </motion.p>

          {/* Form */}
          <motion.form
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              className="flex-1 border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--accent)] rounded-full px-6 py-4 text-sm focus:outline-none focus:border-white/40 transition"
              style={{ backgroundColor: "#0a0a0a" }}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-[var(--accent)] transition text-sm whitespace-nowrap"
            >
              Subscribe →
            </motion.button>
          </motion.form>

          {/* Fine print */}
          <motion.p
            variants={fadeUp}
            className="text-[var(--accent)] text-xs mt-4 opacity-50"
          >
            No spam. Unsubscribe at any time.
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
}
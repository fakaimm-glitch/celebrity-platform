"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const links = [
  {
    heading: "Company",
    items: [
      { label: "About", href: "/signin" },
      { label: "Careers", href: "/signin" },
      { label: "Press", href: "/signin" },
    ],
  },
  {
    heading: "Discover",
    items: [
      { label: "Browse", href: "/signin" },
      { label: "Categories", href: "/signin" },
      { label: "Featured", href: "/signin" },
      { label: "Top Rated", href: "/signin" },
      { label: "New Celebs", href: "/signin" },
    ],
  },
  {
    heading: "Services",
    items: [
      { label: "Book", href: "/signin" },
      { label: "Donate", href: "/signin" },
      { label: "Fan Card", href: "/signin" },
      { label: "VIP Access", href: "/signin" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Help", href: "/signin" },
      { label: "Contact", href: "/signin" },
      { label: "FAQ", href: "/signin" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Terms", href: "/signin" },
      { label: "Privacy", href: "/signin" },
      { label: "Cookies", href: "/signin" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top: Logo + Links */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Logo + Tagline */}
          <motion.div variants={fadeUp} className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-[var(--foreground)] tracking-wider">
              CELEB
            </Link>
            <p className="text-[var(--accent)] text-sm mt-3 leading-relaxed">
              Your gateway to exclusive celebrity experiences.
            </p>
            {/* Socials */}
            <div className="flex gap-4 mt-6">
              {["𝕏", "IG", "YT", "TK"].map((s) => (
                <motion.a
                  key={s}
                  href="/signin"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--accent)] hover:border-white/40 hover:text-white transition text-xs font-bold"
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav Columns */}
          {links.map((col) => (
            <motion.div key={col.heading} variants={fadeUp}>
              <p className="text-[var(--foreground)] font-semibold text-sm mb-4">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[var(--accent)] text-sm hover:text-[var(--foreground)] transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-[var(--accent)] text-sm opacity-50">
            © {new Date().getFullYear()} CELEB. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link
                key={item}
                href="/signin"
                className="text-[var(--accent)] text-sm opacity-50 hover:opacity-100 hover:text-[var(--foreground)] transition"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
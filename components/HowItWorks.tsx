"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Browse Celebrities",
    description:
      "Explore our curated roster of A-list actors, musicians, athletes, and more. Filter by category, price, or availability.",
    icon: "🔍",
  },
  {
    number: "02",
    title: "Book Your Experience",
    description:
      "Choose your experience type private event, backstage pass, or one-on-one meet. Select a date and confirm instantly.",
    icon: "📅",
  },
  {
    number: "03",
    title: "Meet Your Star",
    description:
      "Show up, experience the moment, and create memories that last a lifetime. Every booking is verified and guaranteed.",
    icon: "🌟",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.3 } },
};

export default function HowItWorks() {
  return (
    <section className="bg-[var(--background)] py-20 px-6">

      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 border border-[var(--border)] rounded-full px-4 py-1.5 text-xs text-[var(--accent)] mb-4">
          ⭐ Simple Process
        </div>
        <h2 className="text-4xl font-bold text-[var(--foreground)] mb-3">
          How It Works
        </h2>
        <p className="text-[var(--accent)] text-sm max-w-md mx-auto">
          From discovery to your unforgettable moment, three simple steps is all it takes.
        </p>
      </motion.div>

      {/* Steps Flow */}
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Desktop layout */}
        <div className="hidden md:flex items-start justify-between relative">

          {/* Animated connector line */}
          <motion.div
            className="absolute top-8 left-[calc(16%+16px)] right-[calc(16%+16px)] h-px origin-left"
            style={{ backgroundColor: "#1f1f1f" }}
            variants={lineVariants}
          />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex flex-col items-center text-center w-[30%] relative z-10"
            >
              {/* Circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center mb-6 border border-[var(--border)] cursor-default"
                style={{ backgroundColor: "#0a0a0a" }}
              >
                <span className="text-xl leading-none">{step.icon}</span>
                <span className="text-[10px] font-bold text-yellow-400 tracking-widest mt-0.5">
                  {step.number}
                </span>
              </motion.div>

              {/* Text */}
              <h3 className="text-[var(--foreground)] text-base font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-[var(--accent)] text-xs leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile layout — vertical timeline */}
        <div className="flex md:hidden flex-col relative pl-8">

          {/* Vertical line */}
          <div
            className="absolute left-4 top-4 bottom-4 w-px"
            style={{ backgroundColor: "#1f1f1f" }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative flex items-start gap-6 mb-10 last:mb-0"
            >
              {/* Dot */}
              <div
                className="absolute -left-8 w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#0a0a0a" }}
              >
                <span className="text-sm">{step.icon}</span>
              </div>

              {/* Text */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-yellow-400 tracking-widest block mb-1">
                  {step.number}
                </span>
                <h3 className="text-[var(--foreground)] text-base font-semibold mb-1">
                  {step.title}
                </h3>
                <p className="text-[var(--accent)] text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
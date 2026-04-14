"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const testimonials = [
  {
    video: "/vi.mp4",
    title: "Fan Booking Experience",
    initial: "S",
    name: "Sarah M.",
    role: "Booked a private meet & greet",
    quote:
      "I never thought I'd get to meet my favourite celebrity in person. The booking process was seamless and the experience was absolutely life-changing. Worth every penny — 10/10 would do it again!",
    stars: 5,
  },
  {
    video: "/dwayene.mp4",
    title: "VIP Backstage Pass",
    initial: "J",
    name: "James K.",
    role: "VIP event experience",
    quote:
      "From the fan card to the VIP backstage pass — this platform delivered everything it promised. My daughter cried happy tears meeting her idol. This is the real deal, no scams, just pure magic.",
    stars: 5,
  },
  {
    video: "/taylor.mp4",
    title: "One-on-One Meet",
    initial: "A",
    name: "Amara T.",
    role: "One-on-one meet & greet",
    quote:
      "Booking through CELEB was the easiest thing I've ever done. Within minutes I had a confirmed slot and the celebrity was exactly as warm and welcoming as I hoped. An experience I'll never forget.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
        >
          <div className="inline-flex items-center gap-2 border border-[var(--border)] rounded-full px-4 py-1.5 text-xs text-[var(--accent)] mb-4">
            ⭐ Success Stories
          </div>
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-3">
            What Fans Are Saying
          </h2>
          <p className="text-[var(--accent)] text-sm max-w-xl mx-auto">
            See how fans just like you created unforgettable memories through our platform.
          </p>
        </motion.div>

        {/* Vertical Feed */}
        <div className="space-y-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="border border-[var(--border)] rounded-3xl overflow-hidden"
              style={{ backgroundColor: "#0a0a0a" }}
            >
              {/* Video — full width */}
              <div className="relative w-full aspect-video bg-black">
                <video
                  className="w-full h-full object-cover"
                  src={t.video}
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>

              {/* Profile + Testimonial */}
              <div className="p-6">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <span key={s} className="text-yellow-400 text-base">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[var(--foreground)] text-sm leading-relaxed mb-6">
                  "{t.quote}"
                </p>

                {/* Divider */}
                <div className="border-t border-[var(--border)] pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] font-semibold text-sm">{t.name}</p>
                    <p className="text-[var(--accent)] text-xs">{t.role}</p>
                  </div>
                  <div className="ml-auto border border-[var(--border)] rounded-full px-3 py-1 text-[10px] text-[var(--accent)]">
                    ✓ Verified Fan
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
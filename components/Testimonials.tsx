"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Testimonials() {
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
            ⭐ Success Stories
          </div>
          <h2 className="text-4xl font-bold text-[var(--foreground)] mb-3">
            What Fans Are Saying
          </h2>
          <p className="text-[var(--accent)] text-sm max-w-xl mx-auto">
            See how fans just like you created unforgettable memories through our platform.
          </p>
        </motion.div>

        {/* Video Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >

          {/* Card 1 */}
          <motion.div variants={cardVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            {/* Video */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src="vi.mp4"
                title="Fan Booking Experience 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Caption */}
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm">
                  S
                </div>
                <div>
                  <p className="text-[var(--foreground)] font-semibold text-sm">Sarah M.</p>
                  <p className="text-[var(--accent)] text-xs">Booked a private meet & greet</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>
              <p className="text-[var(--accent)] text-sm leading-relaxed">
                "I never thought I'd get to meet my favourite celebrity in person.
                The booking process was seamless and the experience was absolutely
                life-changing. Worth every penny — 10/10 would do it again!"
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={cardVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            {/* Video */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&modestbranding=1&rel=0"
                title="Fan Booking Experience 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Caption */}
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm">
                  J
                </div>
                <div>
                  <p className="text-[var(--foreground)] font-semibold text-sm">James K.</p>
                  <p className="text-[var(--accent)] text-xs">VIP event experience</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>
              <p className="text-[var(--accent)] text-sm leading-relaxed">
                "From the fan card to the VIP backstage pass — this platform
                delivered everything it promised. My daughter cried happy tears
                meeting her idol. This is the real deal, no scams, just pure magic."
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
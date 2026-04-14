"use client";

import DashboardShell from "@/components/DashboardShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  celebrity: { name: string; image_url: string };
};

export default function ReviewsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) throw new Error("Not authenticated");

        const { data, error: rErr } = await supabase
          .from("reviews")
          .select("id, rating, comment, created_at, celebrities(name, image_url)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (rErr) throw rErr;

        setReviews((data ?? []).map((r: any) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: new Date(r.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
          celebrity: r.celebrities,
        })));

      } catch (e: any) {
        setError(e.message ?? "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <DashboardShell title="My Reviews" subtitle="Reviews you have left">

      {error && (
        <div className="mb-6 border border-red-400/20 bg-red-400/5 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">My Reviews</h1>
        <p className="text-[var(--accent)] text-sm mt-1">
          {loading ? "Loading..." : `${reviews.length} review${reviews.length !== 1 ? "s" : ""} left`}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">★</p>
          <p className="text-[var(--foreground)] font-semibold mb-2">No reviews yet</p>
          <p className="text-[var(--accent)] text-sm mb-6">
            After a booking, leave a review for your experience
          </p>
          <Link href="/celebrities"
            className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
            Browse Celebrities
          </Link>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {reviews.map((r) => (
            <motion.div key={r.id} variants={fadeUp}
              className="border border-[var(--border)] rounded-2xl p-5 hover:border-white/20 transition"
              style={{ backgroundColor: "#0a0a0a" }}
            >
              <div className="flex items-start gap-4">
                {/* Celebrity image */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                  {r.celebrity?.image_url ? (
                    <img src={r.celebrity.image_url} alt={r.celebrity.name}
                      className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[var(--foreground)] font-semibold text-sm">
                      {r.celebrity?.name}
                    </p>
                    <span className="text-[var(--accent)] text-xs">{r.created_at}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < r.rating ? "text-yellow-400" : "text-gray-700"}`}>
                        ★
                      </span>
                    ))}
                  </div>

                  {r.comment && (
                    <p className="text-[var(--accent)] text-sm leading-relaxed">
                      "{r.comment}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

    </DashboardShell>
  );
}
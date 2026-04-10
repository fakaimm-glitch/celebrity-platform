"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch {
      setError("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6 py-20">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-widest text-[var(--foreground)]">
            CELEB
          </Link>
          <p className="text-[var(--accent)] text-sm mt-2">Sign in to your account</p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={fadeUp}
          className="border border-[var(--border)] rounded-2xl p-8"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-[var(--accent)] text-xs mb-2 block">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--accent)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                style={{ backgroundColor: "#111111" }}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[var(--accent)] text-xs">Password</label>
                <Link href="/forgot-password" className="text-xs text-[var(--accent)] hover:text-[var(--foreground)] transition">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--accent)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                style={{ backgroundColor: "#111111" }}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || googleLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[var(--accent)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[var(--accent)] text-xs">or</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Google */}
            <motion.button
              type="button"
              onClick={handleGoogle}
              disabled={loading || googleLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full border border-[var(--border)] text-[var(--foreground)] font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#111111" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#111111")}
            >
              {googleLoading ? (
                <span className="text-[var(--accent)]">Redirecting...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </motion.button>

          </form>
        </motion.div>

        {/* Sign up link */}
        <motion.p variants={fadeUp} className="text-center text-[var(--accent)] text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[var(--foreground)] font-semibold hover:underline">
            Sign up
          </Link>
        </motion.p>

      </motion.div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Sign in
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr || !authData.user) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", authData.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        setError("Access denied. This portal is for administrators only.");
        setLoading(false);
        return;
      }

      // Success — redirect to admin dashboard
      router.push("/admin");
      router.refresh();

    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#0a0a0a" }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-3xl font-bold tracking-wider text-white">CELEB</p>
          <p className="text-yellow-400 text-xs tracking-widest uppercase mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="border border-white/10 rounded-3xl p-8 space-y-6"
          style={{ backgroundColor: "#111" }}>

          <div>
            <h1 className="text-xl font-bold text-white">Administrator Login</h1>
            <p className="text-white/40 text-sm mt-1">Restricted access — admins only</p>
          </div>

          {/* Email */}
          <div>
            <label className="text-white/50 text-xs mb-2 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="admin@celeb.com"
              className="w-full border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400/50 transition"
              style={{ backgroundColor: "#1a1a1a" }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white/50 text-xs mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-yellow-400/50 transition"
                style={{ backgroundColor: "#1a1a1a" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-red-400/20 bg-red-400/5 text-red-400 text-sm px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-3.5 rounded-xl text-sm hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying access..." : "Sign In to Admin Panel"}
          </motion.button>

          {/* Divider */}
          <div className="border-t border-white/5 pt-4">
            <p className="text-white/20 text-xs text-center">
              🔒 This portal is monitored and access is logged
            </p>
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6">
          <a href="/" className="text-white/30 text-xs hover:text-white/60 transition">
            ← Back to CELEB
          </a>
        </p>
      </motion.div>
    </div>
  );
}
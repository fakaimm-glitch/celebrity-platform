"use client";

import DashboardShell from "@/components/DashboardShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

type Profile = {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string;
};

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) throw new Error("Not authenticated");

        setEmail(user.email ?? "");

        const { data: prof } = await supabase
          .from("profiles")
          .select("id, name, avatar_url, role")
          .eq("id", user.id)
          .single();

        if (prof) {
          setProfile(prof);
          setName(prof.name ?? "");
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ name })
        .eq("id", user.id);

      if (updateErr) throw updateErr;

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DashboardShell title="Settings" subtitle="Manage your account">

      <div className="max-w-2xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Settings</h1>
          <p className="text-[var(--accent)] text-sm mt-1">Manage your profile and account</p>
        </div>

        {error && (
          <div className="mb-6 border border-red-400/20 bg-red-400/5 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 border border-green-400/20 bg-green-400/5 text-green-400 text-sm px-4 py-3 rounded-xl"
          >
            {success}
          </motion.div>
        )}

        {/* Profile Section */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp}
          className="border border-[var(--border)] rounded-2xl p-6 mb-4"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <h2 className="text-[var(--foreground)] font-semibold mb-5">Profile</h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name}
                  className="w-full h-full rounded-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-[var(--foreground)] font-semibold">{profile?.name ?? "..."}</p>
              <p className="text-[var(--accent)] text-xs capitalize">{profile?.role ?? "fan"}</p>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-[var(--accent)] text-xs mb-2 block">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--accent)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition disabled:opacity-50"
              style={{ backgroundColor: "#111" }}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="text-[var(--accent)] text-xs mb-2 block">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-[var(--border)] text-[var(--accent)] rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed"
              style={{ backgroundColor: "#111" }}
            />
            <p className="text-[var(--accent)] text-xs mt-1.5">Email cannot be changed here</p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-white text-black font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp}
          className="border border-[var(--border)] rounded-2xl p-6 mb-4"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <h2 className="text-[var(--foreground)] font-semibold mb-5">Account</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]"
              style={{ backgroundColor: "#111" }}>
              <div>
                <p className="text-[var(--foreground)] text-sm font-medium">Account Type</p>
                <p className="text-[var(--accent)] text-xs capitalize">{profile?.role ?? "fan"} account</p>
              </div>
              <span className="text-yellow-400 text-xs border border-yellow-400/30 px-3 py-1 rounded-full capitalize">
                {profile?.role ?? "fan"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]"
              style={{ backgroundColor: "#111" }}>
              <div>
                <p className="text-[var(--foreground)] text-sm font-medium">Member Since</p>
                <p className="text-[var(--accent)] text-xs">Celebrity Platform member</p>
              </div>
              <span className="text-[var(--accent)] text-xs">Active</span>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp}
          className="border border-red-400/20 rounded-2xl p-6"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <h2 className="text-red-400 font-semibold mb-2">Danger Zone</h2>
          <p className="text-[var(--accent)] text-sm mb-5">
            Sign out of your account on this device.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="border border-red-400/40 text-red-400 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-400/10 transition disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "🚪 Sign Out"}
          </button>
        </motion.div>

      </div>
    </DashboardShell>
  );
}
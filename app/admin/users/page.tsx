"use client";
import AdminShell from "@/components/AdminShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type User = {
  id: string;
  name: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string | null;
  email?: string;
};

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, role, avatar_url, created_at")
      .order("created_at", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleRole(user: User) {
    const newRole = user.role === "admin" ? "user" : "admin";
    setUpdating(user.id);
    await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);
    await load();
    setUpdating(null);
  }

  const filtered = users.filter(u =>
    (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (u.id ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function roleColor(role: string | null) {
    if (role === "admin") return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-blue-400 bg-blue-400/10 border-blue-400/20";
  }

  return (
    <AdminShell title="Users" subtitle="All registered users">
      {/* Summary + Search */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="border border-[var(--border)] rounded-2xl px-5 py-3" style={{ backgroundColor: "#0a0a0a" }}>
          <p className="text-[var(--accent)] text-xs">Total Users</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="border border-[var(--border)] rounded-2xl px-5 py-3" style={{ backgroundColor: "#0a0a0a" }}>
          <p className="text-[var(--accent)] text-xs">Admins</p>
          <p className="text-2xl font-bold text-yellow-400">{users.filter(u => u.role === "admin").length}</p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
            style={{ backgroundColor: "#0a0a0a" }} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--accent)] text-sm">No users found.</div>
      ) : (
        <div className="border border-[var(--border)] rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((user) => (
              <motion.div key={user.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#111] transition">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name ?? ""} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {(user.name ?? "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[var(--foreground)] text-sm font-medium truncate">
                    {user.name ?? "No name set"}
                  </p>
                  <p className="text-[var(--accent)] text-xs font-mono truncate mt-0.5">
                    {user.id}
                  </p>
                  {user.created_at && (
                    <p className="text-[var(--accent)] text-xs mt-0.5">
                      Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${roleColor(user.role)}`}>
                    {user.role ?? "user"}
                  </span>
                  <button
                    onClick={() => toggleRole(user)}
                    disabled={updating === user.id}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] text-[var(--accent)] hover:border-white/20 hover:text-white transition disabled:opacity-50">
                    {updating === user.id ? "..." : user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
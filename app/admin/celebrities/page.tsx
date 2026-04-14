"use client";
import AdminShell from "@/components/AdminShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Celebrity = {
  id: string;
  name: string;
  bio: string | null;
  image_url: string | null;
  country: string | null;
  price: number;
  rating: number | null;
  featured: boolean | null;
};

const empty: Omit<Celebrity, "id"> = {
  name: "", bio: "", image_url: "", country: "",
  price: 0, rating: 5.0, featured: false,
};

export default function AdminCelebritiesPage() {
  const supabase = createClient();
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Celebrity | null>(null);
  const [form, setForm] = useState<Omit<Celebrity, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("celebrities")
      .select("*")
      .order("name");
    setCelebrities(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(empty);
    setError(null);
    setShowForm(true);
  }

  function openEdit(c: Celebrity) {
    setEditing(c);
    setForm({ name: c.name, bio: c.bio ?? "", image_url: c.image_url ?? "",
      country: c.country ?? "", price: c.price, rating: c.rating ?? 5.0, featured: c.featured ?? false });
    setError(null);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) { setError("Name and price are required."); return; }
    setSaving(true);
    setError(null);
    if (editing) {
      await supabase.from("celebrities").update(form).eq("id", editing.id);
    } else {
      await supabase.from("celebrities").insert({ ...form, id: crypto.randomUUID() });
    }
    await load();
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this celebrity?")) return;
    setDeleting(id);
    await supabase.from("celebrities").delete().eq("id", id);
    await load();
    setDeleting(null);
  }

  return (
    <AdminShell title="Celebrities" subtitle="Manage celebrity listings">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[var(--accent)] text-sm">{celebrities.length} celebrities</p>
        <button onClick={openNew}
          className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
          + Add Celebrity
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="border border-[var(--border)] rounded-2xl p-6 mb-6 space-y-4"
          style={{ backgroundColor: "#0a0a0a" }}>
          <h2 className="text-[var(--foreground)] font-semibold">
            {editing ? `Edit: ${editing.name}` : "Add New Celebrity"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Name", key: "name", type: "text", placeholder: "Joe Rogan" },
              { label: "Country", key: "country", type: "text", placeholder: "United States" },
              { label: "Price (USD)", key: "price", type: "number", placeholder: "300000" },
              { label: "Rating", key: "rating", type: "number", placeholder: "4.8" },
              { label: "Image URL", key: "image_url", type: "text", placeholder: "/celebs/joe.jpg" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-[var(--accent)] text-xs mb-2 block">{field.label}</label>
                <input type={field.type}
                  value={(form as any)[field.key] ?? ""}
                  onChange={(e) => setForm(f => ({ ...f, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                  style={{ backgroundColor: "#111" }} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-[var(--accent)] text-xs mb-2 block">Bio</label>
              <textarea rows={3} value={form.bio ?? ""}
                onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Celebrity bio..."
                className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition resize-none"
                style={{ backgroundColor: "#111" }} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured ?? false}
                onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4" />
              <label htmlFor="featured" className="text-[var(--foreground)] text-sm">Featured celebrity</label>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Celebrity"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="border border-[var(--border)] text-[var(--accent)] px-5 py-2.5 rounded-xl text-sm hover:border-white/20 transition">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : celebrities.length === 0 ? (
        <div className="text-center py-20 text-[var(--accent)] text-sm">No celebrities yet.</div>
      ) : (
        <div className="space-y-3">
          {celebrities.map((c) => (
            <motion.div key={c.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4"
              style={{ backgroundColor: "#0a0a0a" }}>
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                {c.image_url && (
                  <img src={c.image_url} alt={c.name}
                    className="w-full h-full object-cover object-top" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[var(--foreground)] font-semibold text-sm">{c.name}</p>
                  {c.featured && (
                    <span className="text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                <p className="text-[var(--accent)] text-xs mt-0.5">{c.country}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-yellow-400 text-xs">★ {c.rating}</span>
                  <span className="text-[var(--foreground)] text-xs font-semibold">${c.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(c)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[var(--border)] text-[var(--accent)] hover:border-white/20 hover:text-white transition">
                  Edit
                </button>
                <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition disabled:opacity-50">
                  {deleting === c.id ? "..." : "Delete"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
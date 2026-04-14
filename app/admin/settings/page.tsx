"use client";
import AdminShell from "@/components/AdminShell";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const SETTINGS_KEYS = [
  { key: "bank_name", label: "Bank Name", placeholder: "CELEB Global Bank" },
  { key: "bank_account_name", label: "Account Name", placeholder: "CELEB Platform Inc." },
  { key: "bank_account_number", label: "Account Number", placeholder: "0123456789" },
  { key: "bank_routing_number", label: "Routing / ABA", placeholder: "021000021" },
  { key: "bank_swift", label: "SWIFT / BIC", placeholder: "CELEBUS33" },
  { key: "usdt_trc20_address", label: "USDT TRC20 Address", placeholder: "T..." },
  { key: "usdt_erc20_address", label: "USDT ERC20 Address", placeholder: "0x..." },
  { key: "usdt_bep20_address", label: "USDT BEP20 Address", placeholder: "0x..." },
];

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("platform_settings").select("key, value");
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      setValues(map);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await Promise.all(
      SETTINGS_KEYS.map(({ key }) =>
        supabase.from("platform_settings")
          .upsert({ key, value: values[key] ?? "" }, { onConflict: "key" })
      )
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <AdminShell title="Settings" subtitle="Platform payment configuration">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Bank Details */}
          <div className="border border-[var(--border)] rounded-2xl p-6" style={{ backgroundColor: "#0a0a0a" }}>
            <h2 className="text-[var(--foreground)] font-semibold mb-5">🏦 Bank Transfer Details</h2>
            <div className="space-y-4">
              {SETTINGS_KEYS.slice(0, 5).map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[var(--accent)] text-xs mb-2 block">{label}</label>
                  <input type="text"
                    value={values[key] ?? ""}
                    onChange={(e) => setValues(v => ({ ...v, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition font-mono"
                    style={{ backgroundColor: "#111" }} />
                </div>
              ))}
            </div>
          </div>

          {/* USDT */}
          <div className="border border-[var(--border)] rounded-2xl p-6" style={{ backgroundColor: "#0a0a0a" }}>
            <h2 className="text-[var(--foreground)] font-semibold mb-5">₮ USDT Crypto Addresses</h2>
            <div className="space-y-4">
              {SETTINGS_KEYS.slice(5).map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-[var(--accent)] text-xs mb-2 block">{label}</label>
                  <input type="text"
                    value={values[key] ?? ""}
                    onChange={(e) => setValues(v => ({ ...v, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition font-mono"
                    style={{ backgroundColor: "#111" }} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="bg-white text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition disabled:opacity-50">
              {saving ? "Saving..." : "Save All Settings"}
            </button>
            {saved && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-green-400 text-sm">
                ✓ Settings saved successfully!
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AdminShell>
  );
}
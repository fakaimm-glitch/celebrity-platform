"use client";

export const dynamic = "force-dynamic";

import DashboardShell from "@/components/DashboardShell";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

type Celebrity = { id: string; name: string; image_url: string; };
type Settings = Record<string, string>;

// 1. Create a sub-component to handle the SearchParams logic
function DonateCheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();

  const celebrityId = params.get("celebrity_id") ?? "";
  const initialAmount = Number(params.get("amount") ?? 100);

  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(initialAmount);
  const [message, setMessage] = useState("");

  // Personal details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "usdt">("card");
  const [bankOpen, setBankOpen] = useState(false);
  const [usdtOpen, setUsdtOpen] = useState(false);
  const [usdtNetwork, setUsdtNetwork] = useState<"trc20" | "erc20" | "bep20">("trc20");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    async function load() {
      if (!celebrityId) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      const [{ data: celeb }, { data: settingsRows }, { data: profile }] = await Promise.all([
        supabase.from("celebrities").select("id, name, image_url").eq("id", celebrityId).single(),
        supabase.from("platform_settings").select("key, value"),
        user ? supabase.from("profiles").select("*").eq("id", user.id).single() : Promise.resolve({ data: null }),
      ]);
      setCelebrity(celeb);
      const map: Settings = {};
      (settingsRows ?? []).forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);
      if (user) setEmail(user.email ?? "");
      if (profile) {
        setFullName(profile.full_name ?? "");
        setPhone(profile.phone ?? "");
        setAddress(profile.address ?? "");
        setCity(profile.city ?? "");
        setCountry(profile.country ?? "");
      }
      setLoading(false);
    }
    load();
  }, [celebrityId]);

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  
  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  async function handleSubmit() {
    if (!celebrity) return;
    if (!fullName || !email || !phone || !address || !city || !country) {
      setError("Please fill in all personal details."); return;
    }
    if (amount <= 0) { setError("Enter a valid amount."); return; }
    if (paymentMethod === "card" && (!cardName || !cardNumber || !expiry || !cvv)) {
      setError("Fill in all card details."); return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await supabase.from("profiles").upsert(
        { id: user.id, full_name: fullName }, // Changed 'name' to 'full_name' to match your profile fetch logic
        { onConflict: "id" }
      );

      const { error: insertErr } = await supabase.from("donations").insert({
        user_id: user.id,
        celebrity_id: celebrity.id,
        amount,
        message: message || null,
      });
      if (insertErr) throw insertErr;
      setSuccess(true);
    } catch (e: any) {
      setError(e.message ?? "Donation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
          <div className="w-20 h-20 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-3xl mx-auto mb-6">♥</div>
        </motion.div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Donation Sent!</h2>
        <p className="text-[var(--accent)] text-sm mb-2">
          You donated <span className="text-white font-semibold">${amount.toLocaleString()}</span> to{" "}
          <span className="text-white font-semibold">{celebrity?.name}</span>.
        </p>
        <p className="text-[var(--accent)] text-xs mb-8">It's now showing in your history.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => router.push("/dashboard")}
            className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">Dashboard</button>
          <button onClick={() => router.push("/dashboard/history")}
            className="border border-[var(--border)] text-[var(--foreground)] px-6 py-2.5 rounded-xl text-sm font-semibold hover:border-white/40 transition">View History</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-[var(--accent)] text-sm hover:text-white transition mb-8">← Back</button>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">Complete Donation</h1>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
        ))}</div>
      ) : !celebrity ? (
        <p className="text-[var(--accent)]">Celebrity not found.</p>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">

          {/* Who you're donating to */}
          <div className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
            <h2 className="text-[var(--foreground)] font-semibold mb-4">Donating To</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                <img src={celebrity.image_url} alt={celebrity.name} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="text-[var(--foreground)] font-semibold">{celebrity.name}</p>
                <p className="text-[var(--accent)] text-xs mt-0.5">Direct fan donation ♥</p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
            <h2 className="text-[var(--foreground)] font-semibold mb-4">Donation Amount</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[50, 100, 500, 1000, 5000, 10000].map((amt) => (
                <button key={amt} type="button" onClick={() => setAmount(amt)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                    amount === amt ? "border-white/40 text-white" : "border-[var(--border)] text-[var(--accent)] hover:border-white/20"
                  }`}
                  style={{ backgroundColor: amount === amt ? "#1a1a1a" : "#111" }}>
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
            <div>
              <label className="text-[var(--accent)] text-xs mb-2 block">Custom Amount (USD)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border border-[var(--border)] text-[var(--foreground)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                style={{ backgroundColor: "#111" }} placeholder="Enter amount..." />
            </div>
          </div>

          {/* Personal Details */}
          <div className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
            <h2 className="text-[var(--foreground)] font-semibold mb-4">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[var(--accent)] text-xs mb-2 block">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                  style={{ backgroundColor: "#111" }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[var(--accent)] text-xs mb-2 block">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@email.com"
                    className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                    style={{ backgroundColor: "#111" }} />
                </div>
                <div>
                  <label className="text-[var(--accent)] text-xs mb-2 block">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                    style={{ backgroundColor: "#111" }} />
                </div>
              </div>
              <div>
                <label className="text-[var(--accent)] text-xs mb-2 block">Street Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                  style={{ backgroundColor: "#111" }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[var(--accent)] text-xs mb-2 block">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                    style={{ backgroundColor: "#111" }} />
                </div>
                <div>
                  <label className="text-[var(--accent)] text-xs mb-2 block">Country</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                    style={{ backgroundColor: "#111" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border border-[var(--border)] rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a" }}>
            <h2 className="text-[var(--foreground)] font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[{ key: "card", label: "💳 Card" }, { key: "bank", label: "🏦 Bank" }, { key: "usdt", label: "₮ USDT" }].map((m) => (
                <button key={m.key} type="button"
                  onClick={() => { setPaymentMethod(m.key as any); setBankOpen(m.key === "bank"); setUsdtOpen(m.key === "usdt"); }}
                  className={`py-3 px-3 rounded-xl text-sm border transition text-center font-medium ${
                    paymentMethod === m.key ? "border-white/40 text-white" : "border-[var(--border)] text-[var(--accent)] hover:border-white/20"
                  }`}
                  style={{ backgroundColor: paymentMethod === m.key ? "#1a1a1a" : "#111" }}>
                  {m.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod === "card" && (
                <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div>
                    <label className="text-[var(--accent)] text-xs mb-2 block">Cardholder Name</label>
                    <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="John Doe"
                      className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition"
                      style={{ backgroundColor: "#111" }} />
                  </div>
                  <div>
                    <label className="text-[var(--accent)] text-xs mb-2 block">Card Number</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456" maxLength={19}
                      className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition font-mono"
                      style={{ backgroundColor: "#111" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[var(--accent)] text-xs mb-2 block">Expiry</label>
                      <input type="text" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY" maxLength={5}
                        className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition font-mono"
                        style={{ backgroundColor: "#111" }} />
                    </div>
                    <div>
                      <label className="text-[var(--accent)] text-xs mb-2 block">CVV</label>
                      <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••" maxLength={4}
                        className="w-full border border-[var(--border)] text-[var(--foreground)] placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition font-mono"
                        style={{ backgroundColor: "#111" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {paymentMethod === "bank" && (
                <motion.div key="bank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="border border-[var(--border)] rounded-xl overflow-hidden" style={{ backgroundColor: "#111" }}>
                  <button type="button" onClick={() => setBankOpen(!bankOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-[var(--foreground)]">
                    <span className="font-medium">🏦 Bank Transfer Details</span>
                    <span className="text-[var(--accent)] text-xs">{bankOpen ? "▲ Hide" : "▼ Show"}</span>
                  </button>
                  <AnimatePresence>
                    {bankOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[var(--border)]">
                        <div className="p-4 space-y-3">
                          {[
                            { label: "Bank Name", value: settings.bank_name },
                            { label: "Account Name", value: settings.bank_account_name },
                            { label: "Account Number", value: settings.bank_account_number },
                            { label: "Routing / ABA", value: settings.bank_routing_number },
                            { label: "SWIFT / BIC", value: settings.bank_swift },
                            { label: "Reference", value: `DON-${Date.now().toString().slice(-6)}` },
                          ].map((row) => (
                            <div key={row.label} className="flex justify-between items-center">
                              <span className="text-[var(--accent)] text-xs">{row.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[var(--foreground)] text-xs font-mono font-semibold">{row.value ?? "—"}</span>
                                {row.value && (
                                  <button type="button" onClick={() => navigator.clipboard.writeText(row.value!)}
                                    className="text-[10px] text-yellow-400 hover:text-yellow-300 transition">copy</button>
                                )}
                              </div>
                            </div>
                          ))}
                          <p className="text-yellow-400 text-xs pt-2 border-t border-[var(--border)]">
                            ⚠ Send exactly ${amount.toLocaleString()} — recorded after payment verified.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {paymentMethod === "usdt" && (
                <motion.div key="usdt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="border border-[var(--border)] rounded-xl overflow-hidden" style={{ backgroundColor: "#111" }}>
                  <button type="button" onClick={() => setUsdtOpen(!usdtOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-[var(--foreground)]">
                    <span className="font-medium">₮ USDT Crypto Payment</span>
                    <span className="text-[var(--accent)] text-xs">{usdtOpen ? "▲ Hide" : "▼ Show"}</span>
                  </button>
                  <AnimatePresence>
                    {usdtOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[var(--border)]">
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="text-[var(--accent)] text-xs mb-2 block">Select Network</label>
                            <div className="grid grid-cols-3 gap-2">
                              {(["trc20", "erc20", "bep20"] as const).map((net) => (
                                <button key={net} type="button" onClick={() => setUsdtNetwork(net)}
                                  className={`py-2 rounded-xl text-xs font-semibold border transition uppercase ${
                                    usdtNetwork === net ? "border-yellow-400/50 text-yellow-400" : "border-[var(--border)] text-[var(--accent)] hover:border-white/20"
                                  }`}
                                  style={{ backgroundColor: usdtNetwork === net ? "#1a1a1a" : "#0a0a0a" }}>
                                  {net}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-[var(--accent)] text-xs mb-2 block">USDT ({usdtNetwork.toUpperCase()}) Address</label>
                            <div className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border)]" style={{ backgroundColor: "#0a0a0a" }}>
                              <p className="text-[var(--foreground)] text-xs font-mono flex-1 break-all">
                                {settings[`usdt_${usdtNetwork}_address`] ?? "Address not configured"}
                              </p>
                              {settings[`usdt_${usdtNetwork}_address`] && (
                                <button type="button" onClick={() => navigator.clipboard.writeText(settings[`usdt_${usdtNetwork}_address`])}
                                  className="text-yellow-400 text-xs flex-shrink-0 hover:text-yellow-300 transition">copy</button>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[var(--accent)]">Amount to send</span>
                            <span className="text-white font-semibold font-mono">${amount.toLocaleString()} USDT</span>
                          </div>
                          <p className="text-yellow-400 text-xs pt-2 border-t border-[var(--border)]">
                            ⚠ Send only USDT on {usdtNetwork.toUpperCase()} network. Confirmed after 1 network confirmation.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="border border-red-400/20 bg-red-400/5 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} disabled={submitting}
            className="w-full bg-white text-black font-bold py-4 rounded-xl text-sm hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? "Processing..." : `Donate $${amount.toLocaleString()} to ${celebrity.name}`}
          </motion.button>
          <p className="text-[var(--accent)] text-xs text-center">🔒 Encrypted & secure. Donation appears instantly in your history.</p>
        </motion.div>
      )}
    </div>
  );
}

// 2. Export the main component wrapped in DashboardShell and Suspense
export default function DonateCheckoutPage() {
  return (
    <DashboardShell title="Checkout" subtitle="Complete your donation">
      <Suspense fallback={
        <div className="max-w-2xl mx-auto space-y-4 pt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      }>
        <DonateCheckoutContent />
      </Suspense>
    </DashboardShell>
  );
}
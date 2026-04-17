"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/admin", icon: "📊" },
  { label: "Bookings", href: "/admin/bookings", icon: "📅" },
  { label: "Donations", href: "/admin/donations", icon: "♥" },
  { label: "Fan Cards", href: "/admin/fancards", icon: "🪪" },
  { label: "Celebrities", href: "/admin/celebrities", icon: "⭐" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

function ProfileIcon() {
  return (
    <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:ring-2 hover:ring-yellow-400 transition cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

export default function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();

      // Not logged in at all → go to admin login
      if (userErr || !user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", user.id)
        .single();

      // Profile fetch failed or not admin → go to admin login
      if (profileErr || !profile || profile.role !== "admin") {
        router.replace("/admin/login");
        return;
      }

      setAdminName(profile.name ?? user.email?.split("@")[0] ?? "Admin");
      setAuthChecked(true);
    }
    checkAdmin();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex">

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 border-r border-[var(--border)] flex flex-col z-[60] transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div>
            <p className="text-xl font-bold tracking-wider text-white">CELEB</p>
            <p className="text-yellow-400 text-[10px] tracking-widest uppercase">Admin Panel</p>
          </div>
          <button type="button" className="lg:hidden text-white text-xl p-1 touch-manipulation"
            onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-[var(--accent)] text-[10px] uppercase tracking-widest mb-3 px-3">Management</p>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition
                ${pathname === item.href
                  ? "bg-yellow-400 text-black"
                  : "text-[var(--accent)] hover:text-[var(--foreground)] hover:bg-[#111]"
                }`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-[var(--border)] space-y-2">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ backgroundColor: "#111" }}>
            <ProfileIcon />
            <div className="overflow-hidden">
              <p className="text-[var(--foreground)] text-sm font-semibold truncate">{adminName}</p>
              <p className="text-yellow-400 text-xs">Administrator</p>
            </div>
          </div>
          <Link href="/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--accent)] hover:bg-[#1a1a1a] transition">
            <span>↩</span> Back to Dashboard
          </Link>
          <button type="button" onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-[#1a1a1a] transition">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[55] lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN */}
      <div className="flex-1 lg:ml-64 flex flex-col">

        {/* TOP BAR */}
        <div className="fixed top-0 left-0 right-0 lg:sticky lg:top-0 lg:left-auto lg:right-auto flex items-center justify-between px-6 py-4 border-b border-[var(--border)] z-40"
          style={{ backgroundColor: "#0a0a0a" }}>
          <div className="flex items-center gap-4">
            <button type="button"
              className="flex flex-col justify-center gap-[5px] w-10 h-10 touch-manipulation lg:hidden"
              onClick={() => setSidebarOpen(true)}>
              <span className="w-6 h-[2px] bg-white block rounded pointer-events-none" />
              <span className="w-6 h-[2px] bg-white block rounded pointer-events-none" />
              <span className="w-6 h-[2px] bg-white block rounded pointer-events-none" />
            </button>
            <Link href="/" className="text-white font-bold tracking-wider lg:hidden">
              CELEB <span className="text-yellow-400 text-xs">ADMIN</span>
            </Link>
            <div className="hidden lg:block">
              <p className="text-[var(--foreground)] font-semibold text-sm">{title ?? "Admin"}</p>
              <p className="text-[var(--accent)] text-xs">{subtitle ?? "Admin Panel"}</p>
            </div>
          </div>
          <ProfileIcon />
        </div>

        <div className="h-[65px] lg:hidden" />

        <div className="flex-1 px-6 py-8">
          {children}
        </div>

        <div className="hidden lg:block border-t border-[var(--border)] px-6 py-5">
          <p className="text-[var(--accent)] text-xs text-center">
            © {new Date().getFullYear()} CELEB Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
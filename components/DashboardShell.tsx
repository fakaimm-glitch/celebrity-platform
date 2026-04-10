"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "⬛" },
  { label: "Joe Rogan", href: "/celebrities/joe", icon: "🎙️" },
  { label: "Taylor Swift", href: "/celebrities/taylor", icon: "🎵" },
  { label: "Dwayne Johnson", href: "/celebrities/dwayne", icon: "🎬" },
  { label: "History", href: "/dashboard/history", icon: "🕐" },
  { label: "My Reviews", href: "/dashboard/reviews", icon: "★" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

const bottomNav = [
  {
    label: "Home",
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      </svg>
    ),
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
      </svg>
    ),
  },
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

export default function DashboardShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 border-r border-[var(--border)] flex flex-col z-[60] transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <Link href="/" className="text-xl font-bold tracking-wider text-white">CELEB</Link>
          <button type="button" className="lg:hidden text-white text-xl p-1 touch-manipulation"
            onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-[var(--accent)] text-[10px] uppercase tracking-widest mb-3 px-3">Main</p>
          {navItems.slice(0, 1).map((item) => (
            <Link key={item.label} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition
                ${pathname === item.href ? "bg-white text-black" : "text-[var(--accent)] hover:text-[var(--foreground)] hover:bg-[#111]"}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </Link>
          ))}

          <p className="text-[var(--accent)] text-[10px] uppercase tracking-widest mb-3 px-3 mt-5">Featured Celebs</p>
          {navItems.slice(1, 4).map((item) => (
            <Link key={item.label} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition
                ${pathname === item.href ? "bg-white text-black" : "text-[var(--accent)] hover:text-[var(--foreground)] hover:bg-[#111]"}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </Link>
          ))}

          <p className="text-[var(--accent)] text-[10px] uppercase tracking-widest mb-3 px-3 mt-5">My Activity</p>
          {navItems.slice(4).map((item) => (
            <Link key={item.label} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition
                ${pathname === item.href ? "bg-white text-black" : "text-[var(--accent)] hover:text-[var(--foreground)] hover:bg-[#111]"}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out at bottom of sidebar */}
        <div className="px-4 py-5 border-t border-[var(--border)] space-y-2">
          <Link href="/dashboard/settings">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1a1a1a] transition cursor-pointer"
              style={{ backgroundColor: "#111" }}>
              <ProfileIcon />
              <div>
                <p className="text-[var(--foreground)] text-sm font-semibold">Jordan Rivera</p>
                <p className="text-[var(--accent)] text-xs">Fan Member</p>
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-[#1a1a1a] transition"
          >
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

        {/* ✅ TOP BAR — fixed on mobile, sticky on desktop */}
        <div
          className="fixed top-0 left-0 right-0 lg:sticky lg:top-0 lg:left-auto lg:right-auto flex items-center justify-between px-6 py-4 border-b border-[var(--border)] z-40"
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="flex items-center gap-4">
            {/* Hamburger — mobile only */}
            <button type="button"
              className="flex flex-col justify-center gap-[5px] w-10 h-10 touch-manipulation lg:hidden"
              onClick={() => setSidebarOpen(true)}>
              <span className="w-6 h-[2px] bg-white block rounded pointer-events-none" />
              <span className="w-6 h-[2px] bg-white block rounded pointer-events-none" />
              <span className="w-6 h-[2px] bg-white block rounded pointer-events-none" />
            </button>

            {/* Logo — mobile only */}
            <Link href="/" className="text-white font-bold tracking-wider lg:hidden">CELEB</Link>

            {/* Title — desktop only */}
            <div className="hidden lg:block">
              <p className="text-[var(--foreground)] font-semibold text-sm">{title ?? "Dashboard"}</p>
              <p className="text-[var(--accent)] text-xs">{subtitle ?? "Welcome back"}</p>
            </div>
          </div>

          <Link href="/dashboard/settings">
            <ProfileIcon />
          </Link>
        </div>

        {/* ✅ Spacer to push content below the fixed top bar on mobile */}
        <div className="h-[65px] lg:hidden" />

        {/* Page Content */}
        <div className="flex-1 px-6 py-8 pb-24 lg:pb-8">
          {children}
        </div>

        {/* Footer — desktop only */}
        <div className="hidden lg:block border-t border-[var(--border)] px-6 py-5">
          <p className="text-[var(--accent)] text-xs text-center">
            © {new Date().getFullYear()} CELEB. All rights reserved.
          </p>
        </div>

      </div>

      {/* BOTTOM NAV — mobile only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)]"
        style={{ backgroundColor: "#0a0a0a" }}>
        <div className="flex items-center justify-around px-4 py-2">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition touch-manipulation ${
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <div className={`${isActive ? "text-yellow-400" : ""}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-yellow-400" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
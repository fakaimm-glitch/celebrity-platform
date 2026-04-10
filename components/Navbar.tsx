"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [mobileFeatures, setMobileFeatures] = useState(false);
  const [mounted, setMounted]           = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
        setFeaturesOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setMobileOpen(false);
    setMobileServices(false);
    setMobileFeatures(false);
  };

  return (
    <nav
      ref={navRef}
      className="w-full border-b border-gray-800 bg-black text-white fixed top-0 left-0 right-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT: Logo */}
        <div className="text-xl font-bold tracking-wider">
          <Link href="/">CELEB</Link>
        </div>

        {/* CENTER: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>

          {/* Services Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setServicesOpen(!servicesOpen); setFeaturesOpen(false); }}
              className="hover:text-gray-300 cursor-pointer"
            >
              Services ▾
            </button>
            {servicesOpen && (
              <div className="absolute top-8 left-0 bg-black border border-gray-800 rounded-md shadow-lg w-40 z-50">
                <Link href="/booking"  onClick={() => setServicesOpen(false)} className="block px-4 py-2 hover:bg-gray-900">Booking</Link>
                <Link href="/donation" onClick={() => setServicesOpen(false)} className="block px-4 py-2 hover:bg-gray-900">Donation</Link>
                <Link href="/fan-card" onClick={() => setServicesOpen(false)} className="block px-4 py-2 hover:bg-gray-900">Fan Card</Link>
              </div>
            )}
          </div>

          {/* Features Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setFeaturesOpen(!featuresOpen); setServicesOpen(false); }}
              className="hover:text-gray-300 cursor-pointer"
            >
              Features ▾
            </button>
            {featuresOpen && (
              <div className="absolute top-8 left-0 bg-black border border-gray-800 rounded-md shadow-lg w-44 z-50">
                <Link href="/signin" onClick={() => setFeaturesOpen(false)} className="block px-4 py-2 hover:bg-gray-900">Joe Rogan</Link>
                <Link href="/signin" onClick={() => setFeaturesOpen(false)} className="block px-4 py-2 hover:bg-gray-900">Taylor Swift</Link>
                <Link href="/signin" onClick={() => setFeaturesOpen(false)} className="block px-4 py-2 hover:bg-gray-900">Dwayne Johnson</Link>
              </div>
            )}
          </div>

          <Link href="/brands" className="hover:text-gray-300">Brands</Link>
        </div>

        {/* RIGHT: Sign In (desktop) + Hamburger (mobile) */}
        <div className="flex items-center gap-3">
          {/* Desktop Sign In */}
          <Link
            href="/signin"
            className="hidden md:block border border-white px-4 py-1.5 rounded text-sm hover:bg-white hover:text-black transition"
          >
            Sign In
          </Link>

          {/* Mobile Hamburger */}
          {mounted && (
            <button
              type="button"
              className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 touch-manipulation"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span
                className="w-5 h-[2px] bg-white block rounded transition-all duration-200"
                style={{ transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}
              />
              <span
                className="w-5 h-[2px] bg-white block rounded transition-all duration-200"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="w-5 h-[2px] bg-white block rounded transition-all duration-200"
                style={{ transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}
              />
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Dropdown (opens below navbar, from right) ── */}
      {mounted && mobileOpen && (
        <div className="md:hidden absolute right-4 top-[68px] w-64 bg-black border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">

          {/* Main links */}
          <Link href="/"      onClick={closeAll} className="block px-5 py-3.5 text-sm text-white border-b border-gray-800 hover:bg-gray-900 active:bg-gray-800">Home</Link>
          <Link href="/about" onClick={closeAll} className="block px-5 py-3.5 text-sm text-white border-b border-gray-800 hover:bg-gray-900 active:bg-gray-800">About</Link>
          <Link href="/brands" onClick={closeAll} className="block px-5 py-3.5 text-sm text-white border-b border-gray-800 hover:bg-gray-900 active:bg-gray-800">Brands</Link>

          {/* Services accordion */}
          <button
            type="button"
            onClick={() => { setMobileServices(!mobileServices); setMobileFeatures(false); }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-white border-b border-gray-800 hover:bg-gray-900 active:bg-gray-800"
          >
            <span>Services</span>
            <span
              className="text-gray-400 transition-transform duration-200 text-xs"
              style={{ transform: mobileServices ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
          </button>
          {mobileServices && (
            <div className="bg-gray-950 border-b border-gray-800">
              <Link href="/booking"  onClick={closeAll} className="block px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 border-b border-gray-800 last:border-0">Booking</Link>
              <Link href="/donation" onClick={closeAll} className="block px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 border-b border-gray-800 last:border-0">Donation</Link>
              <Link href="/fan-card" onClick={closeAll} className="block px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900">Fan Card</Link>
            </div>
          )}

          {/* Features accordion */}
          <button
            type="button"
            onClick={() => { setMobileFeatures(!mobileFeatures); setMobileServices(false); }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-white border-b border-gray-800 hover:bg-gray-900 active:bg-gray-800"
          >
            <span>Features</span>
            <span
              className="text-gray-400 transition-transform duration-200 text-xs"
              style={{ transform: mobileFeatures ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
          </button>
          {mobileFeatures && (
            <div className="bg-gray-950 border-b border-gray-800">
              <Link href="/signin" onClick={closeAll} className="block px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 border-b border-gray-800">Joe Rogan</Link>
              <Link href="/signin" onClick={closeAll} className="block px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900 border-b border-gray-800">Taylor Swift</Link>
              <Link href="/signin" onClick={closeAll} className="block px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-900">Dwayne Johnson</Link>
            </div>
          )}

          {/* Sign In */}
          <div className="p-4">
            <Link
              href="/signin"
              onClick={closeAll}
              className="block w-full text-center border border-white px-4 py-2.5 rounded text-sm hover:bg-white hover:text-black transition touch-manipulation"
            >
              Sign In
            </Link>
          </div>

        </div>
      )}
    </nav>
  );
}
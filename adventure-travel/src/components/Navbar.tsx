"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Adventures", href: "/treks" },
  { label: "Destinations", href: "/destinations" },
];

const activities = [
  {
    label: "Trekking",
    href: "/treks",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    description: "Himalayan trekking expeditions",
  },
  {
    label: "Skiing & Snowboarding",
    href: "/activities#skiing",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    description: "7-day courses in Auli",
  },
  {
    label: "Camping",
    href: "/activities#camping",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    description: "Riverside & mountain camps",
  },
  {
    label: "Paragliding",
    href: "/activities#paragliding",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.72.608 5.18 1.64" />
      </svg>
    ),
    description: "Tandem flights in Bir Billing",
  },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => { await signOut(); router.push("/"); };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActivityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl border-b ${
          scrolled ? "bg-[#0F172A]/95 border-white/10 shadow-lg shadow-black/20" : "bg-[#0F172A]/90 border-white/5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "h-16" : "h-20"}`}>
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-heading text-lg sm:text-xl font-bold text-white">
                Expedition Happiness Treks
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                    isActive(link.href) ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive(link.href)
                        ? "left-4 w-[calc(100%-2rem)]"
                        : "left-1/2 w-0 group-hover:left-4 group-hover:w-[calc(100%-2rem)]"
                    }`}
                  />
                </Link>
              ))}

              {/* Activities Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setActivityOpen(!activityOpen)}
                  aria-expanded={activityOpen}
                  aria-haspopup="true"
                  className={`relative px-4 py-2 text-sm font-medium transition-colors group flex items-center gap-1 ${
                    isActive("/activities") ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  Activities
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${activityOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:left-4 group-hover:w-[calc(100%-2rem)]" />
                </button>

                {activityOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl shadow-black/10 border border-gray-100 py-2 overflow-hidden">
                    {activities.map((act) => (
                      <Link
                        key={act.label}
                        href={act.href}
                        onClick={() => setActivityOpen(false)}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-accent/5 transition-colors group"
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                          {act.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">{act.label}</p>
                          <p className="text-xs text-muted">{act.description}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <Link
                        href="/activities"
                        onClick={() => setActivityOpen(false)}
                        className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-accent hover:bg-accent/5 transition-colors"
                      >
                        View All Activities
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                  isActive("/contact") ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                Contact
                <span
                  className={`absolute bottom-0 h-0.5 bg-accent transition-all duration-300 ${
                    isActive("/contact")
                      ? "left-4 w-[calc(100%-2rem)]"
                      : "left-1/2 w-0 group-hover:left-4 group-hover:w-[calc(100%-2rem)]"
                  }`}
                />
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className={`text-sm font-medium transition-colors ${scrolled ? "text-white/80 hover:text-white" : "text-white/80 hover:text-white"}`}>
                    {user.user_metadata?.full_name?.split(" ")[0] || user.email}
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={`text-sm font-medium transition-colors ${scrolled ? "text-white/80 hover:text-white" : "text-white/80 hover:text-white"}`}>
                    Log In
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 rounded-lg text-white"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0F172A]/95 backdrop-blur-xl pt-20 px-4 md:hidden overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-heading font-semibold text-white py-2.5 border-b border-white/10"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Activities */}
            <div className="py-3 border-b border-white/10">
              <p className="text-xl font-heading font-semibold text-white mb-2">Activities</p>
              <div className="flex flex-col gap-1 pl-4">
                {activities.map((act) => (
                  <Link
                    key={act.label}
                    href={act.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-base text-white/80 hover:text-white py-1.5 transition-colors"
                  >
                    <span className="text-accent">{act.icon}</span>
                    {act.label}
                  </Link>
                ))}
                <Link
                  href="/activities"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-base text-accent font-semibold py-1.5"
                >
                  View All Activities
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-xl font-heading font-semibold text-white py-2.5 border-b border-white/10"
            >
              Contact
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-3 rounded-xl bg-accent px-5 py-3.5 text-center text-base font-semibold text-white"
            >
              Contact Us
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-xl font-heading font-semibold text-white py-2.5 border-b border-white/10">
                  My Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left text-xl font-heading font-semibold text-white/60 py-2.5">
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex gap-3 mt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-xl border border-white/20 px-5 py-3 text-base font-semibold text-white">
                  Log In
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
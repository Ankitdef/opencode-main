"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { treks } from "@/data/treks";

export default function MobileSearchButton() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return treks
      .filter((t) => `${t.name} ${t.region} ${t.difficulty}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  return (
    <div className="md:hidden">
      {open && (
        <div className="fixed inset-0 z-[70] bg-black/40" onClick={() => setOpen(false)} aria-hidden />
      )}
      <div
        className={`fixed bottom-6 left-4 right-20 z-[71] transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="relative">
          <form
            action="/treks"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/treks${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`;
            }}
            className="relative"
          >
            <label htmlFor="sticky-search" className="sr-only">Search for Treks / Trips</label>
            <input
              id="sticky-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Treks / Trips..."
              autoComplete="off"
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-5 pr-12 text-sm text-foreground shadow-2xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {query.trim() && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
              {results.length > 0 ? (
                results.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/treks/${t.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-primary/5"
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="flex-shrink-0 text-xs text-muted">{t.region} · {t.difficulty}</span>
                  </Link>
                ))
              ) : (
                <Link
                  href={`/treks?search=${encodeURIComponent(query.trim())}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm text-muted transition-colors hover:bg-primary/5"
                >
                  No matches — see all treks filtered by &ldquo;{query.trim()}&rdquo;
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Search treks"
        aria-expanded={open}
        className={`fixed bottom-6 left-4 z-[72] flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-all duration-300 hover:scale-105 ${
          visible && !open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
}

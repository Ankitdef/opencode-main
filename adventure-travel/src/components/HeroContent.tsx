"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { treks } from "@/data/treks";
import ContactPopup from "./ContactPopup";

const trustMetrics = [
  { value: "5,000+", label: "Happy Trekkers" },
  { value: "250+", label: "Expeditions" },
  { value: "15+", label: "Years Guiding" },
  { value: "4.9★", label: "Avg. Rating" },
];

export default function HeroContent({ variant }: { variant: "split" | "scene" }) {
  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return treks
      .filter((t) => `${t.name} ${t.region} ${t.difficulty}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  const rise = (delay: number) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };

  const inputClass =
    "w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 " +
    (variant === "scene"
      ? "border-white/25 bg-white/15 text-white placeholder-white/70 backdrop-blur-sm"
      : "border-gray-200 bg-white text-foreground placeholder-gray-400");

  const headline = "text-white" + (variant === "scene" ? "" : " lg:text-foreground");
  const body = "text-white/85" + (variant === "scene" ? "" : " lg:text-muted");
  const metricValue = "text-white" + (variant === "scene" ? "" : " lg:text-foreground");
  const metricLabel = "text-white/70" + (variant === "scene" ? "" : " lg:text-muted");
  const panel = variant === "scene"
    ? "rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl shadow-black/20 ring-0 backdrop-blur-sm"
    : "rounded-2xl bg-white p-3 shadow-xl shadow-black/10 ring-1 ring-black/5";
  const badge = variant === "scene" ? "bg-primary/20 text-white" : "bg-primary/10 text-primary";

  return (
    <div className={variant === "scene" ? "w-full" : "w-full lg:w-[46%]"}>
      <motion.span {...rise(0)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest ${badge}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Himalayan Alpine Expeditions
      </motion.span>

      <motion.h1 {...rise(0.08)} className={`mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl ${headline}`}>
        Surreal Summits &amp;
        <br className="hidden sm:block" /> <span className="text-gradient">Wild Frontiers</span>
      </motion.h1>

      <motion.p
        {...rise(0.12)}
        className="text-shine-mountain mt-4 font-heading text-xl font-bold leading-snug tracking-tight sm:text-2xl [text-shadow:0_2px_14px_rgba(0,0,0,0.35)]"
      >
        <span className="block">Chhod do duniya ki saari <span className="italic opacity-80">bhasad</span>,</span>
        <span className="block">bula rahe hain tujhe <span className="font-extrabold">pahaad</span>.</span>
      </motion.p>

      <motion.p {...rise(0.16)} className={`mt-5 max-w-lg text-base leading-relaxed sm:text-lg ${body}`}>
        Precision-guided treks across the most dramatic alpine passes and sacred valleys of the
        Indian Himalayas — small groups, certified leaders, permits handled.
      </motion.p>

      <motion.div {...rise(0.24)} className={`mt-8 ${panel}`}>
        <div ref={wrapRef} className="relative">
          <form
            action="/treks"
            className="grid grid-cols-[1fr_auto] gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/treks${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`;
            }}
          >
            <label htmlFor="hero-search" className="sr-only">Search for Treks / Trips</label>
            <div className="relative">
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => wrapRef.current?.contains(document.activeElement) || setTimeout(() => setOpen(false), 120)}
                placeholder="Search for Treks / Trips..."
                autoComplete="off"
                className={inputClass}
              />
              <svg className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </form>

          {open && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
              {results.length > 0 ? (
                results.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/treks/${t.slug}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-primary/5"
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="flex-shrink-0 text-xs text-muted">
                      {t.region} · {t.difficulty}
                    </span>
                  </Link>
                ))
              ) : (
                <Link
                  href={`/treks?search=${encodeURIComponent(query.trim())}`}
                  className="block px-4 py-3 text-sm text-muted transition-colors hover:bg-primary/5"
                >
                  No matches — see all treks filtered by &ldquo;{query.trim()}&rdquo;
                </Link>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div {...rise(0.32)} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/treks"
          className="shine group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
        >
          Explore All Treks
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <button
          onClick={() => setShowPopup(true)}
          className={`inline-flex items-center justify-center rounded-xl border px-7 py-3.5 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 ${
            variant === "scene"
              ? "border-white/40 bg-white/15 text-white hover:bg-white/25"
              : "border-black/10 bg-white/90 text-foreground shadow-sm hover:bg-white"
          }`}
        >
          Talk to a Trek Expert
        </button>
      </motion.div>

      <motion.div {...rise(0.4)} className="mt-10 grid max-w-md grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
        {trustMetrics.map((metric) => (
          <div key={metric.label}>
            <div className={`font-heading text-2xl font-bold ${metricValue}`}>{metric.value}</div>
            <div className={`mt-0.5 text-[11px] font-medium ${metricLabel}`}>{metric.label}</div>
          </div>
        ))}
      </motion.div>

      <ContactPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}

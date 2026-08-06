"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { treks } from "@/data/treks";
import ContactPopup from "./ContactPopup";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80";

// Populate the Destination search from the real trek catalogue so every listed
// trek is searchable from the homepage.
const searchDestinations = treks.map((t) => t.name);

const searchDifficulties = ["Easy", "Moderate", "Challenging", "Strenuous"];

const trustMetrics = [
  { value: "5,000+", label: "Happy Trekkers" },
  { value: "250+", label: "Expeditions" },
  { value: "15+", label: "Years Guiding" },
  { value: "4.9★", label: "Avg. Rating" },
];

export default function HeroSplit() {
  const [showPopup, setShowPopup] = useState(false);
  const [destination, setDestination] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Hero image parallax — slides up slower than scroll (mountain depth)
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Content panel — subtle 3D tilt as user scrolls past
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { rotateX: 0, transformPerspective: 1200 },
          {
            rotateX: -5,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  // Compose a deep link into the treks catalogue from the search selections.
  const searchQuery = new URLSearchParams();
  if (destination) searchQuery.set("search", destination);
  if (difficulty) searchQuery.set("difficulty", difficulty);
  const searchHref = `/treks${searchQuery.toString() ? `?${searchQuery.toString()}` : ""}`;

  const rise = (delay: number) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };

  const selectClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 cursor-pointer";

  return (
    <section ref={heroRef} className="relative isolate min-h-[100svh] overflow-hidden bg-white">
      {/* Mountain scene: full-bleed on mobile, right half on desktop */}
      <div ref={imgRef} className="absolute inset-0 lg:left-1/2 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="Golden light on the Indian Himalayas"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
        {/* Legibility overlay for the content that sits over the image on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25 lg:hidden" />
        {/* Ambient orbs on the desktop image side */}
        <div className="pointer-events-none absolute right-[12%] top-24 hidden h-72 w-72 rounded-full bg-primary/20 blur-[140px] lg:block" />
      </div>

      {/* White panel (desktop) with an organic wavy right edge */}
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-white lg:block">
        <svg
          className="absolute top-0 left-full -ml-px h-full w-[70px] text-white"
          viewBox="0 0 70 100"
          preserveAspectRatio="none"
          fill="currentColor"
          aria-hidden
        >
          <path d="M0,0 L22,0 C 50,18 8,44 38,62 C 60,76 16,90 26,100 L0,100 Z" />
        </svg>
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 pb-14 pt-28 lg:px-8" style={{ transformStyle: "preserve-3d" }}>
        <div className="w-full lg:w-[46%]">
          <motion.span
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Himalayan Alpine Expeditions
          </motion.span>

          <motion.h1
            {...rise(0.08)}
            className="mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl lg:text-foreground"
          >
            Surreal Summits &amp;
            <br className="hidden sm:block" /> <span className="text-gradient">Wild Frontiers</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg lg:text-muted"
          >
            Precision-guided treks across the most dramatic alpine passes and sacred valleys of the
            Indian Himalayas — small groups, certified leaders, permits handled.
          </motion.p>

          {/* Search */}
          <motion.div
            {...rise(0.24)}
            className="mt-8 rounded-2xl bg-white p-3 shadow-xl shadow-black/10 ring-1 ring-black/5"
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <label htmlFor="hero-destination" className="sr-only">Destination</label>
                <select id="hero-destination" value={destination} onChange={(e) => setDestination(e.target.value)} className={selectClass}>
                  <option value="">Destination</option>
                  {searchDestinations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hero-difficulty" className="sr-only">Difficulty</label>
                <select id="hero-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
                  <option value="">Difficulty</option>
                  {searchDifficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <Link
                href={searchHref}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Link>
            </div>
          </motion.div>

          {/* CTAs */}
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
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/90 px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition-all hover:bg-white hover:-translate-y-0.5"
            >
              Talk to a Trek Expert
            </button>
          </motion.div>

          {/* Trust metrics */}
          <motion.div {...rise(0.4)} className="mt-10 grid max-w-md grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
            {trustMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="font-heading text-2xl font-bold text-white lg:text-foreground">{metric.value}</div>
                <div className="mt-0.5 text-[11px] font-medium text-white/70 lg:text-muted">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/40">Scroll</span>
        <div className="flex h-8 w-5 justify-center rounded-full border border-foreground/20 pt-1.5">
          <div className="h-1.5 w-1 rounded-full bg-foreground/50" style={{ animation: "scroll-dot 1.5s ease-in-out infinite" }} />
        </div>
      </div>

      <ContactPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </section>
  );
}

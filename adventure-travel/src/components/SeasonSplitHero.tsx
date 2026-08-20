"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll } from "framer-motion";

const SUMMER_IMG =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80";
const WINTER_IMG =
  "https://images.pexels.com/photos/848591/pexels-photo-848591.jpeg?w=1920&q=80";

export default function SeasonSplitHero() {
  const reduceMotion = useReducedMotion();
  const [pos, setPos] = useState(50);
  const heroRef = useRef<HTMLElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Pointer-drag divider (desktop)
  useEffect(() => {
    const el = dragRef.current;
    if (!el || reduceMotion) return;
    let raf = 0;
    const update = (clientX: number) => {
      const rect = heroRef.current!.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPos(Math.min(88, Math.max(12, pct)));
    };
    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      el.setPointerCapture(e.pointerId);
      update(e.clientX);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          update(e.clientX);
        });
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  // Touch: divider follows scroll progress through the hero
  useEffect(() => {
    if (reduceMotion) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarse) return;
    const unsub = scrollYProgress.on("change", (v) => {
      setPos(Math.min(88, Math.max(12, 60 - v * 30)));
    });
    return () => unsub();
  }, [reduceMotion, scrollYProgress]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(12, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(88, p + 5));
  };

  const clipPath = reduceMotion ? undefined : `inset(0 0 0 ${pos}%)`;

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-background"
    >
      {/* Summer base layer */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SUMMER_IMG}
          alt="Green Himalayan ridge in monsoon season, Uttarakhand"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/15 to-transparent" />
      </div>

      {/* Winter layer — clipped */}
      <div
        className="absolute inset-0"
        style={{ clipPath }}
        aria-hidden={reduceMotion ? undefined : true}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WINTER_IMG}
          alt="Skier carving fresh powder at Auli, Uttarakhand"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-sky-950/15 to-transparent" />
      </div>

      {/* Divider */}
      <div
        ref={dragRef}
        role="slider"
        aria-label="Season divider"
        aria-valuemin={12}
        aria-valuemax={88}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={onKey}
        className={`absolute inset-y-0 z-20 flex w-0.5 items-center justify-center bg-white/80 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${reduceMotion ? "pointer-events-none cursor-default" : "cursor-ew-resize touch-none"}`}
        style={{ left: `${pos}%` }}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-foreground shadow-xl">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
          >
            <path
              d="M6 3L2 7l4 4M14 3l4 4-4 4M2 7h4M14 7h4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={
          reduceMotion ? undefined : { duration: 0.7, ease: "easeOut", delay: 0.15 }
        }
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-6 pb-14 pt-24 lg:px-8"
      >
        {/* Top rail */}
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
            APR – OCT
          </span>
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
            DEC – MAR
          </span>
        </div>

        {/* Headline */}
        <div className="mt-auto flex flex-col gap-4 lg:gap-3">
          <h1 className="font-heading font-bold leading-none text-white drop-shadow-lg">
            <span className="block text-display-xl">ONE RANGE.</span>
            <span className="block text-display-xl text-white/95">TWO SEASONS.</span>
          </h1>
          <p className="max-w-xl text-base font-medium leading-relaxed text-white/80 md:text-lg">
            Himalayan treks in Uttarakhand — and snow school at Auli.
          </p>

          {/* CTAs */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/treks"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore treks
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              Learn to ski
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Altitude chip */}
        <div className="mt-8 hidden items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm sm:flex">
          <svg
            className="h-3.5 w-3.5 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 17l6-6 4 4 8-8"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 7h7v7"
            />
          </svg>
          <span className="font-heading text-sm font-bold tabular-nums text-white">
            1,200 M – 4,700 M
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Uttarakhand Himalaya
          </span>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          Scroll
        </span>
        <div className="flex h-8 w-5 justify-center rounded-full border border-white/30 pt-1.5">
          <div
            className="h-1.5 w-1 rounded-full bg-white/60"
            style={{ animation: "scroll-dot 1.5s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

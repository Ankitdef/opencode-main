"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { treks, DIFFICULTY_COLORS } from "@/data/treks";
import { StaggerContainer, StaggerItem } from "./MotionWrapper";
import SmartImage from "./SmartImage";

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.02,1.02,1.02)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointer}
      onPointerUp={reset}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={className}
      style={{ transition: "transform 0.2s ease-out", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

type Badge = { text: string; icon: string; color: string };

function getBadge(trek: (typeof treks)[0]): Badge | null {
  if (trek.id === 9) return { text: "Bestseller", icon: "⭐", color: "bg-amber-500" };
  if (trek.id === 11) return { text: "Most Booked", icon: "🏆", color: "bg-emerald-500" };
  if (trek.id === 13) return { text: "Trending", icon: "🔥", color: "bg-orange-500" };
  if (trek.price >= 40000) return { text: "Premium", icon: "💎", color: "bg-violet-500" };
  return null;
}

export default function PopularTreksV2() {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const reduceMotion = useReducedMotion();

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="treks" className="py-section bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Our Popular Adventures</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-display-lg">
            Signature Himalayan Treks
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Handpicked trails across Uttarakhand &amp; Himachal — filtered by region, difficulty, and season.
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
          {treks.slice(0, 9).map((trek) => {
            const badge = getBadge(trek);
            const isWishlisted = wishlist.has(trek.id);

            return (
              <StaggerItem key={trek.id} className="h-full">
                <TiltCard className="h-full">
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-900 shadow-lg shadow-black/10">
                    <Link
                      href={`/treks/${trek.slug}`}
                      aria-label={trek.name}
                      className="absolute inset-0 z-10 block"
                    />

                    <SmartImage
                      src={trek.image}
                      alt={trek.name}
                      className="absolute inset-0 h-full w-full object-cover card-img-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    {badge && (
                      <div className={`absolute left-3 top-3 z-20 ${badge.color} flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white`}>
                        <span>{badge.icon}</span>
                        {badge.text}
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                        {trek.region} · {trek.days} Days
                      </span>
                      <h3 className="mt-1.5 font-heading text-xl font-bold leading-tight text-white">
                        {trek.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: DIFFICULTY_COLORS[trek.difficulty] }}
                        >
                          {trek.difficulty}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {trek.currency}{trek.price.toLocaleString("en-IN")}
                          <span className="font-normal text-white/60"> / person</span>
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 border-t border-white/15 pt-3 text-xs font-semibold text-white/80 transition-colors group-hover:text-primary">
                        Explore
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleWishlist(trek.id)}
                      aria-pressed={isWishlisted}
                      aria-label={isWishlisted ? `Remove ${trek.name} from wishlist` : `Add ${trek.name} to wishlist`}
                      className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:bg-black/50 active:scale-90"
                    >
                      <svg
                        className={`h-4 w-4 transition-all duration-200 ${isWishlisted ? "scale-110 fill-red-500 text-red-500" : "text-white"}`}
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
          >
            View All Adventures
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

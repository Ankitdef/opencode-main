"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { treks, DIFFICULTY_COLORS } from "@/data/treks";
import { StaggerContainer, StaggerItem } from "./MotionWrapper";

type Badge = {
  text: string;
  icon: string;
  color: string;
};

function getBadge(trek: typeof treks[0]): Badge | null {
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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="treks" className="py-section-sm bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-accent">Our Treks</span>
          <h2 className="mt-3 sm:mt-4 font-heading text-2xl sm:text-3xl md:text-display-lg font-bold text-foreground leading-tight">
            Popular Adventures
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
            Handpicked trails across Uttarakhand & Himachal — filtered by region, difficulty, and season.
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.06}>
          {treks.slice(0, 9).map((trek) => {
            const badge = getBadge(trek);
            const isWishlisted = wishlist.has(trek.id);

            return (
              <StaggerItem key={trek.id}>
                {/* Wrapper is the hover/positioning context so the wishlist button
                    can be a SIBLING of the Link (never an anchor-in-anchor). */}
                <div className="relative group card-premium bg-white dark:bg-card rounded-2xl shadow-lg shadow-black/5 overflow-hidden border border-gray-100 dark:border-white/10">
                  <Link href={`/treks/${trek.slug}`} className="block">
                    {/* Image */}
                    <div className="relative h-44 sm:h-52 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trek.image}
                        alt={trek.name}
                        className="w-full h-full object-cover card-img-zoom"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Badge */}
                      {badge && (
                        <div className={`absolute top-3 left-3 ${badge.color} text-white text-xs font-bold rounded-full px-3 py-1 flex items-center gap-1`}>
                          <span>{badge.icon}</span>
                          {badge.text}
                        </div>
                      )}

                      {/* Rating */}
                      {trek.rating && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 20 20" aria-hidden>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs font-bold text-foreground">{trek.rating}</span>
                          <span className="text-[10px] text-muted">({trek.reviewCount})</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted mb-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {trek.location || trek.region}
                      </div>
                      <h3 className="font-heading font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                        {trek.name}
                      </h3>
                      <p className="text-muted text-sm mt-1 line-clamp-2">{trek.blurb}</p>

                      {/* Meta Row */}
                      <div className="flex items-center flex-wrap gap-3 text-xs text-muted mt-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-white font-semibold text-[10px]"
                          style={{ backgroundColor: DIFFICULTY_COLORS[trek.difficulty] }}
                        >
                          {trek.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {trek.days} Days
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {trek.maxAltitude}m
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {trek.bestSeason}
                        </span>
                        {trek.groupSize && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H5.228A2 2 0 013 17.208V17c0-2.071 1.456-3.818 3.382-4.262" />
                            </svg>
                            Max {trek.groupSize}
                          </span>
                        )}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-white/10">
                        <span className="text-lg font-bold text-accent">
                          {trek.currency}{trek.price.toLocaleString("en-IN")}
                          <span className="text-xs font-normal text-muted ml-1">/ person</span>
                        </span>
                        <span className="text-xs font-semibold text-primary trek-card-arrow inline-flex items-center gap-1">
                          Explore
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Wishlist Heart — sibling of the Link, layered above it */}
                  <button
                    onClick={() => toggleWishlist(trek.id)}
                    aria-pressed={isWishlisted}
                    aria-label={isWishlisted ? `Remove ${trek.name} from wishlist` : `Add ${trek.name} to wishlist`}
                    className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all active:scale-90"
                  >
                    <svg
                      className={`w-4 h-4 transition-all duration-200 ${isWishlisted ? "text-red-500 fill-red-500 scale-110" : "text-white"}`}
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
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            View All Adventures
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

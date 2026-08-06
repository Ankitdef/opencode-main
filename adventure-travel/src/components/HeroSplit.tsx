"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroContent from "./HeroContent";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80";

export default function HeroSplit() {
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
        <HeroContent variant="split" />
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/40">Scroll</span>
        <div className="flex h-8 w-5 justify-center rounded-full border border-foreground/20 pt-1.5">
          <div className="h-1.5 w-1 rounded-full bg-foreground/50" style={{ animation: "scroll-dot 1.5s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

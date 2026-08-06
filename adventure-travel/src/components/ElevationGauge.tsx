"use client";

import { useEffect, useRef } from "react";

// Real altitude milestones from the trek catalogue (src/data/treks.ts).
const MILESTONES = [
  { alt: 5000, label: "5,000m · High Pass" },
  { alt: 4000, label: "4,000m · Alpine Zone" },
  { alt: 3210, label: "3,210m · Base Camps" },
  { alt: 2000, label: "2,000m · Pine Forest" },
  { alt: 0, label: "0m · Valley Start" },
];

const MAX_ALT = 5000;

export default function ElevationGauge() {
  const hikerRef = useRef<HTMLDivElement>(null);
  const altitudeRef = useRef<HTMLSpanElement>(null);
  const altitudeMobileRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
          const alt = Math.round(progress * MAX_ALT);

          if (hikerRef.current) {
            hikerRef.current.style.top = `${(1 - progress) * 100}%`;
          }
          const text = `${alt.toLocaleString("en-IN")}m`;
          if (altitudeRef.current) altitudeRef.current.textContent = text;
          if (altitudeMobileRef.current) altitudeMobileRef.current.textContent = text;
          if (progressRef.current) progressRef.current.style.width = `${progress * 100}%`;
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const trail = (
    <div className="relative h-[45vh] w-1 rounded-full bg-gradient-to-b from-primary/40 via-accent/40 to-secondary/40">
      {MILESTONES.filter((m) => m.alt > 0 && m.alt < MAX_ALT).map((m) => (
        <div
          key={m.alt}
          className="absolute right-2 flex items-center gap-1.5 whitespace-nowrap"
          style={{ top: `${(1 - m.alt / MAX_ALT) * 100}%` }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
          <span className="text-[9px] font-medium uppercase tracking-wider text-muted">
            {m.label.split("·")[1]?.trim() ?? m.label}
          </span>
        </div>
      ))}

      <div
        ref={hikerRef}
        className="absolute right-1/2 top-0 translate-x-1/2"
        style={{ transition: "top 80ms linear" }}
      >
        <div className="-ml-1.5 -mt-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/40 ring-2 ring-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="pointer-events-none fixed z-[45]">
      {/* Desktop: vertical gauge on the right edge */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center lg:flex">
        <span
          ref={altitudeRef}
          className="mb-2 font-heading text-xs font-bold tabular-nums text-secondary"
        >
          0m
        </span>
        {trail}
      </div>

      {/* Mobile: compact altitude pill, bottom-center */}
      <div className="fixed bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full border border-white/10 bg-card/70 px-3 py-1.5 backdrop-blur-sm lg:hidden">
        <span
          ref={altitudeMobileRef}
          className="font-heading text-xs font-bold tabular-nums text-secondary"
        >
          0m
        </span>
        <div className="h-0.5 w-16 overflow-hidden rounded-full bg-foreground/15">
          <div
            ref={progressRef}
            className="h-full w-0 bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MountainPass() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".mp-layer-back", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.to(".mp-layer-mid", {
        yPercent: 28,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.to(".mp-layer-front", {
        yPercent: 48,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.fromTo(
        ".mp-copy",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[110vh] overflow-hidden bg-gradient-to-b from-white/70 via-secondary/10 to-background/80"
    >
      {/* Back range — light, distant, slowest */}
      <svg
        className="mp-layer-back absolute inset-x-0 bottom-0 w-full will-change-transform"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="#C7DBEB"
          d="M0,420 L0,320 L90,240 L180,300 L300,180 L420,280 L520,210 L620,300 L760,150 L880,290 L990,220 L1100,310 L1220,200 L1320,290 L1440,240 L1440,420 Z"
        />
        <path
          fill="#EAF4FB"
          d="M300,180 L340,240 L300,252 L262,244 Z M760,150 L806,216 L760,230 L714,220 Z M1220,200 L1262,260 L1220,272 L1180,262 Z M90,240 L122,286 L90,296 L58,288 Z M520,210 L556,258 L520,270 L486,260 Z"
        />
      </svg>

      {/* Mid range — medium, slightly faster */}
      <svg
        className="mp-layer-mid absolute inset-x-0 bottom-0 w-full will-change-transform"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="#9DC0D8"
          d="M0,420 L0,360 L120,300 L240,370 L360,280 L480,360 L600,300 L720,380 L860,260 L980,360 L1080,310 L1200,380 L1320,300 L1440,360 L1440,420 Z"
        />
        <path
          fill="#F2F8FC"
          d="M360,280 L398,330 L360,344 L324,334 Z M860,260 L900,318 L860,330 L822,320 Z M120,300 L150,342 L120,352 L92,344 Z M600,300 L630,342 L600,352 L572,344 Z M1320,300 L1350,340 L1320,350 L1292,342 Z"
        />
      </svg>

      {/* Front range — darkest, fastest */}
      <svg
        className="mp-layer-front absolute inset-x-0 bottom-0 w-full will-change-transform"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="#6E9CB8"
          d="M0,420 L0,380 L160,340 L300,400 L440,330 L580,400 L720,350 L880,410 L1020,340 L1160,405 L1300,360 L1440,405 L1440,420 Z"
        />
        <path
          fill="#FFFFFF"
          d="M440,330 L474,372 L440,382 L408,374 Z M1020,340 L1052,382 L1020,392 L990,384 Z M160,340 L184,374 L160,382 L138,376 Z M720,350 L748,390 L720,398 L694,392 Z"
        />
      </svg>

      {/* Copy — sits on the horizon */}
      <div className="mp-copy absolute inset-x-0 bottom-[16%] z-10 flex justify-center px-6 text-center">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Uttarakhand · Himachal Pradesh
          </span>
          <h2 className="mt-4 font-heading text-display-md font-bold text-foreground leading-tight">
            From Pine Forest to the Snowline
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Every ridge leads higher — past alpine meadows, glacial rivers, and summit passes above
            four thousand metres.
          </p>
        </div>
      </div>

      {/* Soft mist fading into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

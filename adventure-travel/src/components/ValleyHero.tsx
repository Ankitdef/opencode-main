"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import HeroSplit from "./HeroSplit";
import HeroContent from "./HeroContent";
import { isWebGLAvailable } from "@/lib/webgl";

const ValleyScene = dynamic(() => import("./three/ValleyScene"), { ssr: false });

const SCROLL_HEIGHT = "300vh";

export default function ValleyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [webgl] = useState(isWebGLAvailable);

  useEffect(() => {
    document.documentElement.dataset.hero3d = "true";
    return () => {
      delete document.documentElement.dataset.hero3d;
    };
  }, []);

  useEffect(() => {
    const sec = sectionRef.current;
    const fade = fadeRef.current;
    if (!sec || !fade) return;
    const onScroll = () => {
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      const opacity = Math.min(1, Math.max(0, (p - 0.85) / 0.15));
      fade.style.opacity = String(opacity);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!webgl) return <HeroSplit />;

  return (
    <section ref={sectionRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <ValleyScene sectionRef={sectionRef} />

        {/* Handoff fade — blends the canvas into the MountainPass section below */}
        <div
          ref={fadeRef}
          className="pointer-events-none absolute inset-0 z-20 bg-background"
          style={{ opacity: 0 }}
        />

        {/* Overlay content */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <HeroContent variant="scene" />
          </div>
        </div>
      </div>
    </section>
  );
}

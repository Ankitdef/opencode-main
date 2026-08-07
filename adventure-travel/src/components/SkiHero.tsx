"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isWebGLAvailable } from "@/lib/webgl";

const SkiScene = dynamic(() => import("./three/SkiScene"), { ssr: false });

export default function SkiHero() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    // ponytail: mount-gate so SSR and first client render both output the fallback, avoiding a hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-gate after hydration is the intended post-SSR capability check
    if (isWebGLAvailable()) setWebgl(true);
  }, []);

  useEffect(() => {
    if (!webgl) return;
    document.documentElement.dataset.snow3d = "true";
    return () => {
      delete document.documentElement.dataset.snow3d;
    };
  }, [webgl]);

  return (
    <>
      {webgl && (
        <div className="fixed inset-0 z-0" aria-hidden>
          <SkiScene />
        </div>
      )}

      {/* Hero headline over the live slope (gradient band when WebGL is unavailable) */}
      <section
        className={`relative z-10 flex min-h-screen items-center ${
          webgl ? "" : "bg-gradient-to-b from-sky-200 via-sky-100 to-white"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="text-center px-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Choose Your Adventure
            </p>
            <h1 className="mb-6 text-5xl md:text-7xl font-heading font-bold text-foreground">
              Activities
            </h1>
            <p className="max-w-2xl text-lg text-muted">
              From Himalayan treks to snow-covered slopes, riverside camps to tandem flights — find your perfect adventure in the Indian Himalayas.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

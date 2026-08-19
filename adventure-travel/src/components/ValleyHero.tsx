"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HeroContent from "./HeroContent";
import { isWebGLAvailable } from "@/lib/webgl";

const ValleyScene = dynamic(() => import("./three/ValleyScene"), { ssr: false });

export default function ValleyHero() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    // ponytail: mount-gate so SSR (no WebGL) and first client render both output the static view, avoiding a hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-gate after hydration is the intended post-SSR capability check
    if (isWebGLAvailable()) setWebgl(true);
  }, []);

  useEffect(() => {
    if (!webgl) return;
    document.documentElement.dataset.hero3d = "true";
    return () => {
      delete document.documentElement.dataset.hero3d;
    };
  }, [webgl]);

  return (
    <>
      {/* Whole-page valley scene, fixed behind everything — the camera
          flies up-valley as the page scrolls. No photo, no snow, no birds. */}
      {webgl && (
        <div className="fixed inset-0 z-0" aria-hidden>
          <ValleyScene />
        </div>
      )}

      {/* Hero headline + search over the trailhead */}
      <section
        className={`relative z-10 flex min-h-screen items-center ${
          webgl ? "" : "bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <HeroContent variant="scene" />
        </div>
      </section>
    </>
  );
}

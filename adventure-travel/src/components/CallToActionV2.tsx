"use client";

import { useState } from "react";
import Link from "next/link";
import ContactPopup from "./ContactPopup";
import { FadeUp, ScaleIn } from "./MotionWrapper";

export default function CallToActionV2() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <section className="py-section-sm px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScaleIn>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 md:p-16 text-center bg-gradient-mesh">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-[2rem]" />

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/10 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-[120px] pointer-events-none" />

              {/* Rotating Rings */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full border border-white/10"
                style={{ animation: "spin-slow 30s linear infinite" }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border border-white/10"
                style={{ animation: "spin-slow 25s linear infinite reverse" }}
              />

              {/* Mountain Silhouette */}
              <div className="absolute bottom-0 left-0 right-0 h-20 opacity-10">
                <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,200 L0,120 Q200,40 400,100 Q600,20 800,80 Q1000,10 1200,70 Q1400,30 1440,60 L1440,200 Z" fill="white" />
                </svg>
              </div>

              <div className="relative z-10">
                <FadeUp delay={0.1}>
                  <h2 className="font-heading text-display-lg font-bold text-white leading-tight max-w-3xl mx-auto">
                    Your Next Himalayan Adventure Starts Today
                  </h2>
                </FadeUp>

                <FadeUp delay={0.2}>
                  <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
                    Choose from our carefully curated collection of treks, each offering unique experiences and unforgettable memories in the Indian Himalayas.
                  </p>
                </FadeUp>

                <FadeUp delay={0.3}>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/treks"
                      className="relative overflow-hidden rounded-2xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 text-center group"
                    >
                      <span className="relative z-10 group-hover:text-white transition-colors">Explore Adventures</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <button
                      onClick={() => setShowPopup(true)}
                      className="rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5"
                    >
                      Talk to an Expert
                    </button>
                  </div>
                </FadeUp>

                <FadeUp delay={0.4}>
                  <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      100% Safe
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      4.9+ Rating
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                      Expert Guides
                    </span>
                  </div>
                </FadeUp>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      <ContactPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}

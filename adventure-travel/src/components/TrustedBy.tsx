"use client";

import { FadeUp } from "./MotionWrapper";

const partners = [
  { name: "Google Reviews", rating: "4.9", reviews: "1,200+" },
  { name: "TripAdvisor", rating: "4.8", reviews: "850+" },
  { name: "Ministry of Tourism", rating: "", reviews: "Certified" },
  { name: "Uttarakhand Tourism", rating: "", reviews: "Recognized" },
  { name: "IMF", rating: "", reviews: "Member" },
  { name: "ATOAI", rating: "", reviews: "Member" },
];

export default function TrustedBy() {
  return (
    <section className="py-section-sm bg-background/70 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-muted">Trusted By</span>
          <h2 className="mt-3 font-heading text-2xl sm:text-3xl md:text-display-md font-bold text-foreground leading-tight">
            Recognized by Industry Leaders
          </h2>
        </FadeUp>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 mx-6 px-8 py-6 rounded-2xl bg-white dark:bg-card border border-gray-100 dark:border-white/10 flex items-center gap-4 min-w-[250px]"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{partner.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">{partner.name}</p>
                  {partner.rating ? (
                    <div className="flex items-center gap-1">
                      <svg className="h-3 w-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-foreground">{partner.rating}</span>
                      <span className="text-xs text-muted">({partner.reviews})</span>
                    </div>
                  ) : (
                    <p className="text-xs text-primary font-semibold">{partner.reviews}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

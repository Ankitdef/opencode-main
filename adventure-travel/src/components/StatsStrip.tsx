"use client";

import { stats } from "@/data/treks";
import { FadeUp } from "./MotionWrapper";

export default function StatsStrip() {
  return (
    <section className="border-y border-foreground/10 bg-background/80 py-10 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((s) => (
          <FadeUp key={s.label} className="text-center">
            <p className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {s.value.toLocaleString("en-IN")}
              <span className="text-primary">{s.suffix}</span>
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted">
              {s.label}
            </p>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

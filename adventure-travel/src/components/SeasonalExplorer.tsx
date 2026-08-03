"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { treks, DIFFICULTY_COLORS } from "@/data/treks";
import { FadeUp, StaggerContainer, StaggerItem } from "./MotionWrapper";

const seasons = [
  { id: "winter", label: "Winter", icon: "❄️", months: "Dec – Feb", match: ["Dec", "Jan", "Feb"] },
  { id: "spring", label: "Spring", icon: "🌸", months: "Mar – May", match: ["Mar", "Apr", "May"] },
  { id: "summer", label: "Summer", icon: "☀️", months: "Jun – Aug", match: ["Jun", "Jul", "Aug"] },
  { id: "autumn", label: "Autumn", icon: "🍂", months: "Sep – Nov", match: ["Sep", "Oct", "Nov"] },
];

function getSeasonTreks(seasonId: string) {
  const season = seasons.find((s) => s.id === seasonId);
  if (!season) return [];
  return treks.filter((t) => {
    const s = t.bestSeason.toLowerCase();
    return season.match.some((m) => s.includes(m.toLowerCase()));
  });
}

export default function SeasonalExplorer() {
  const [activeSeason, setActiveSeason] = useState("winter");
  const seasonTreks = getSeasonTreks(activeSeason);

  return (
    <section className="py-section-sm bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-sm font-semibold tracking-widest uppercase text-accent">Seasonal Adventures</span>
          <h2 className="mt-3 sm:mt-4 font-heading text-2xl sm:text-3xl md:text-display-lg font-bold text-foreground leading-tight">
            Explore by Season
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed">
            Every season offers a unique Himalayan experience. Find your perfect time to trek.
          </p>
        </FadeUp>

        {/* Season Tabs */}
        <FadeUp delay={0.1} className="mb-8 sm:mb-10">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeason(season.id)}
                className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm font-semibold transition-all ${
                  activeSeason === season.id
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-white dark:bg-card text-foreground border border-gray-200 dark:border-white/10 hover:border-primary/30"
                }`}
              >
                <span className="text-lg">{season.icon}</span>
                <span>{season.label}</span>
                <span className="text-xs opacity-60">{season.months}</span>
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Trek Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
              {seasonTreks.map((trek) => (
                <StaggerItem key={trek.id}>
                  <Link
                    href={`/treks/${trek.slug}`}
                    className="group block bg-white dark:bg-card rounded-2xl shadow-lg shadow-black/5 overflow-hidden border border-gray-100 dark:border-white/10 card-premium"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trek.image}
                        alt={trek.name}
                        className="w-full h-full object-cover card-img-zoom"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="px-2 py-0.5 text-white text-xs font-semibold rounded-full"
                          style={{ backgroundColor: DIFFICULTY_COLORS[trek.difficulty] }}
                        >
                          {trek.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                        {trek.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted mt-2">
                        <span>{trek.days} Days</span>
                        <span>•</span>
                        <span>{trek.maxAltitude}m</span>
                        <span>•</span>
                        <span>{trek.bestSeason}</span>
                      </div>
                      <p className="text-sm font-bold text-accent mt-3">
                        {trek.currency}{trek.price.toLocaleString("en-IN")}
                        <span className="text-xs font-normal text-muted ml-1">/ person</span>
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        </AnimatePresence>

        {seasonTreks.length === 0 && (
          <div className="text-center py-12 text-muted">
            No treks available for this season. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}

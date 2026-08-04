"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { treks } from "@/data/treks";
import { StaggerContainer, StaggerItem } from "./MotionWrapper";
import SmartImage from "./SmartImage";

const featuredTreks = treks
  .filter((t) => [9, 11, 13, 14].includes(t.id))
  .map((trek) => ({
    ...trek,
    elevation: trek.maxAltitude,
    season: trek.bestSeason,
    quickFacts: [
      { icon: "mountain", value: `${trek.maxAltitude}m` },
      { icon: "clock", value: `${trek.days} Days` },
      { icon: "star", value: `${trek.rating}★` },
    ],
  }));

export default function FeaturedAdventuresV2() {
  return (
    <section id="gallery" className="py-section bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-accent">Featured</span>
          <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
            Featured Escapes
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-xl">
            Our editors&apos; picks — signature routes through the majestic Indian Himalayas
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" staggerDelay={0.1}>
          {featuredTreks.map((trek) => (
            <StaggerItem key={trek.id}>
              <Link
                href={`/treks/${trek.slug}`}
                className="group relative overflow-hidden rounded-3xl cursor-pointer block h-80 card-premium"
              >
                <SmartImage
                  src={trek.image}
                  alt={trek.name}
                  className="w-full h-full object-cover card-img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Difficulty Badge */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-full px-3 py-1 text-xs font-bold text-white bg-accent">
                    {trek.difficulty}
                  </span>
                </div>

                {/* Quick Facts */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {trek.quickFacts.map((fact) => (
                    <span
                      key={fact.icon}
                      className="rounded-full bg-black/30 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold text-white flex items-center gap-1"
                    >
                      {fact.icon === "mountain" && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {fact.icon === "clock" && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {fact.icon === "star" && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      )}
                      {fact.value}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{trek.location || trek.region}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white">{trek.name}</h3>
                  <p className="text-white/70 text-sm mt-1 line-clamp-1">{trek.blurb}</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-white font-bold text-lg">
                      {trek.currency}{trek.price.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-white/60 ml-1">/ person</span>
                    </p>
                    <span className="text-sm font-semibold text-white trek-card-arrow inline-flex items-center gap-1">
                      Explore
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

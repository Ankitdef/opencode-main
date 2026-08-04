"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "./MotionWrapper";
import SmartImage from "./SmartImage";

const destinations = [
  {
    name: "Uttarakhand",
    tagline: "Land of Gods",
    treks: 13,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    description: "From the sacred valleys of Flowers to the snow-capped peaks of Kedarkantha, Uttarakhand offers diverse Himalayan experiences.",
    highlights: ["Valley of Flowers", "Kedarkantha", "Brahmatal", "Roopkund"],
    color: "from-emerald-400 to-teal-500",
  },
  {
    name: "Himachal Pradesh",
    tagline: "Dev Bhoomi",
    treks: 2,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "Dramatic landscapes, ancient temples, and thrilling passes await in India's most beloved hill state.",
    highlights: ["Hampta Pass", "Pangarchula Peak"],
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Garhwal Region",
    tagline: "Heart of Uttarakhand",
    treks: 10,
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
    description: "The Garhwal Himalayas boast some of India's most iconic treks, including the mysterious Roopkund and sacred Hemkund Sahib.",
    highlights: ["Roopkund", "Har Ki Dun", "Kuari Pass"],
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Winter Treks",
    tagline: "Snow Adventures",
    treks: 5,
    image: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80",
    description: "Experience the magic of snow-covered trails, frozen lakes, and winter camping in the Himalayas.",
    highlights: ["Kedarkantha", "Brahmatal", "Chandratal"],
    color: "from-violet-400 to-purple-500",
  },
];

// Deep-link each destination into the treks catalogue's region/search filters.
const hrefFor = (name: string) => {
  if (name === "Himachal Pradesh") return "/treks?region=Himachal%20Pradesh";
  if (name === "Winter Treks") return "/treks?search=winter";
  return "/treks?region=Uttarakhand";
};

export default function FeaturedDestinations() {
  return (
    <section className="py-section-sm bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-accent">Destinations</span>
          <h2 className="mt-3 sm:mt-4 font-heading text-2xl sm:text-3xl md:text-display-lg font-bold text-foreground leading-tight">
            Featured Destinations
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed max-w-xl">
            Discover the diverse landscapes and cultures of the Indian Himalayas.
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" staggerDelay={0.1}>
          {destinations.map((dest) => (
            <StaggerItem key={dest.name}>
              <Link
                href={hrefFor(dest.name)}
                className="group relative overflow-hidden rounded-3xl block h-96 card-premium"
              >
                <SmartImage
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover card-img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex rounded-full bg-gradient-to-r ${dest.color} px-3 py-1 text-xs font-bold text-white`}>
                      {dest.treks} Treks
                    </span>
                    <span className="text-sm text-white/70">{dest.tagline}</span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">{dest.name}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">{dest.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    {dest.highlights.map((h) => (
                      <span key={h} className="text-xs text-white/90 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                        {h}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    Explore Destination
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            View All Destinations
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

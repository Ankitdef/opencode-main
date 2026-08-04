"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { stories } from "@/data/stories";
import { StaggerContainer, StaggerItem } from "./MotionWrapper";
import SmartImage from "./SmartImage";

export default function AdventureStories() {
  const featured = stories.find((s) => s.featured) || stories[0];
  const secondary = stories.filter((s) => s.id !== featured.id).slice(0, 2);

  return (
    <section className="py-section bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-accent">Stories</span>
          <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
            Adventure Stories
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-xl">
            Insights, guides, and tales from the trail
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.1}>
          {/* Featured Article */}
          <StaggerItem className="lg:col-span-2">
            <Link href={featured.href} className="block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <motion.article
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-card shadow-lg shadow-black/5 h-full"
              >
              <div className="relative h-64 md:h-80 overflow-hidden">
                <SmartImage
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-primary text-white text-xs font-bold px-3 py-1">
                    {featured.category}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 text-white/80 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">
                        {featured.author.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span>{featured.author}</span>
                    </div>
                    <span>·</span>
                    <span>{featured.readTime} min read</span>
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-white leading-tight">
                    {featured.title}
                  </h3>
                  <p className="text-white/70 mt-2 line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    Read Story
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
              </motion.article>
            </Link>
          </StaggerItem>

          {/* Secondary Articles */}
          <StaggerItem className="flex flex-col gap-6">
            {secondary.map((story) => (
              <Link
                key={story.id}
                href={story.href}
                className="flex-1 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
              <motion.article
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-card shadow-lg shadow-black/5 flex-1 h-full"
              >
                <div className="relative h-40 overflow-hidden">
                  <SmartImage
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-white/90 text-foreground text-xs font-bold px-2 py-0.5">
                      {story.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-heading text-lg font-bold text-white leading-tight line-clamp-2">
                      {story.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-muted text-sm line-clamp-2">{story.excerpt}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>{story.author}</span>
                      <span>·</span>
                      <span>{story.readTime} min</span>
                    </div>
                    <span className="text-xs font-semibold text-primary trek-card-arrow inline-flex items-center gap-1">
                      Read
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.article>
              </Link>
            ))}
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}

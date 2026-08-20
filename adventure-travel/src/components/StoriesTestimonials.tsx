"use client";

import Link from "next/link";
import { stories } from "@/data/stories";
import { testimonials } from "@/data/treks";
import { FadeUp, StaggerContainer, StaggerItem } from "./MotionWrapper";
import SmartImage from "./SmartImage";

export default function StoriesTestimonials() {
  const featuredStories = stories.filter((s) => s.featured).slice(0, 3);
  const picks = testimonials.slice(0, 3);

  return (
    <section className="relative bg-background py-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeUp>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              FROM THE TRAIL
            </span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Stories and words from the mountains
          </h2>
        </FadeUp>

        <StaggerContainer
          className="mt-10 grid gap-6 md:grid-cols-3"
          staggerDelay={0.06}
        >
          {featuredStories.map((story) => (
            <StaggerItem key={story.id}>
              <Link
                href={story.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SmartImage
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-foreground">
                    {story.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-base font-semibold leading-tight text-foreground">
                    {story.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {story.excerpt}
                  </p>
                  <p className="mt-auto pt-4 text-xs font-medium text-muted">
                    {story.author} · {story.readTime} min read
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Testimonial band */}
        <StaggerContainer
          className="mt-16 grid gap-6 md:grid-cols-3"
          staggerDelay={0.06}
        >
          {picks.map((t) => (
            <StaggerItem key={t.name}>
              <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
                <div className="flex gap-0.5 text-accent" aria-hidden>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-4 font-heading text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted">
                  {t.role} · {t.location}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

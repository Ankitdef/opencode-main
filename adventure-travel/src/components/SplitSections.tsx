"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import SmartImage from "./SmartImage";

type Split = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
  bullets: string[];
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
  reverse?: boolean;
  tint?: boolean;
};

const splits: Split[] = [
  {
    id: "why",
    eyebrow: "Why Us",
    title: (
      <>
        Small Groups. Certified Leaders.{" "}
        <span className="text-gradient">Zero Compromise.</span>
      </>
    ),
    body:
      "We cap every departure and hand you a licensed guide from the very valley you're walking through — so the mountain, not the logistics, is all you think about.",
    bullets: [
      "15+ years guiding the Indian Himalayas",
      "Licensed local leaders, max 12 per group",
      "Permits, porters & logistics handled end-to-end",
      "Daily acclimatisation buffers built into every route",
    ],
    cta: { label: "Explore all treks", href: "/treks" },
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000&q=80",
    imageAlt: "Trekkers crossing a high Himalayan ridge",
  },
  {
    id: "safety",
    eyebrow: "Safety First",
    title: (
      <>
        Safety, Engineered Into{" "}
        <span className="text-gradient">Every Step.</span>
      </>
    ),
    body:
      "Leaving your comfort zone takes trust. We earn it with protocols that run from pre-trek briefings to daily health checks high on the mountain.",
    bullets: [
      "AMS-trained guides on every route",
      "Gamow bag & pulse oximeter on high climbs",
      "Satellite communication beyond network range",
      "Clear, rehearsed emergency evacuation plans",
    ],
    cta: { label: "Talk to our safety team", href: "/contact" },
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1000&q=80",
    imageAlt: "Snow-capped peaks under a clear sky",
    reverse: true,
    tint: true,
  },
  {
    id: "how-it-works",
    eyebrow: "How It Works",
    title: (
      <>
        From Inspiration{" "}
        <span className="text-gradient">to Summit.</span>
      </>
    ),
    body:
      "Five simple steps take you from browsing to the top of a Himalayan pass — we handle every hard part in between.",
    bullets: [
      "Choose your route by region, difficulty & days",
      "We tailor pacing, acclimatisation & lodging to you",
      "National-park and inner-line permits, all sorted",
      "Summit with a local guide, then descend safe",
    ],
    cta: { label: "Plan your trek", href: "/contact" },
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&q=80",
    imageAlt: "A trail winding through an alpine valley",
  },
  {
    id: "winter",
    eyebrow: "Winter Season",
    title: (
      <>
        Chase the <span className="text-gradient">Snow.</span>
      </>
    ),
    body:
      "When the high passes close, the winter classics open — frozen lakes, powder-laden pines and summit sunrises made for first-timers.",
    bullets: [
      "Kedarkantha & Brahmatal snow summits",
      "Frozen alpine lakes and silent forests",
      "Insulated camps built for the cold",
      "Beginner-friendly, December to March",
    ],
    cta: { label: "See winter treks", href: "/treks?search=winter" },
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1000&q=80",
    imageAlt: "Snow-covered Himalayan trekking trail",
    reverse: true,
    tint: true,
  },
];

function SplitPanel({ data }: { data: Split }) {
  const reduceMotion = useReducedMotion();
  const reverse = !!data.reverse;

  return (
    <section id={data.id} className={`relative overflow-hidden ${data.tint ? "bg-surface/70" : "bg-white/70"} backdrop-blur-md`}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Text */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className={reverse ? "lg:order-2" : ""}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {data.eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground md:text-display-lg">
            {data.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{data.body}</p>
          <ul className="mt-6 space-y-3">
            {data.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-foreground">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <span className="text-sm md:text-base">{bullet}</span>
              </li>
            ))}
          </ul>
          <Link
            href={data.cta.href}
            className="shine group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
          >
            <span className="relative z-[2] inline-flex items-center gap-2">
              {data.cta.label}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </motion.div>

        {/* Image with a curved, panel-flowing edge (mirrors the hero) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className={`relative ${reverse ? "lg:order-1" : ""}`}
        >
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/15 to-secondary/15 blur-2xl" />
          <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10">
            <SmartImage
              src={data.image}
              alt={data.imageAlt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            {/* Curved edge on the side that faces the text, filled with the section colour */}
            <div
              className={`pointer-events-none absolute inset-y-0 z-10 hidden w-14 lg:block ${reverse ? "right-0" : "left-0"} ${
                data.tint ? "text-surface/70" : "text-white/70"
              }`}
            >
              <svg className="h-full w-full" viewBox="0 0 56 100" preserveAspectRatio="none" fill="currentColor" aria-hidden>
                {reverse ? (
                  <path d="M56,0 L36,0 C 10,22 50,48 22,70 C -2,88 42,100 32,100 L56,100 Z" />
                ) : (
                  <path d="M0,0 L20,0 C 46,22 6,48 34,70 C 58,88 14,100 24,100 L0,100 Z" />
                )}
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function SplitSections() {
  return (
    <>
      {splits.map((data) => (
        <SplitPanel key={data.id} data={data} />
      ))}
    </>
  );
}

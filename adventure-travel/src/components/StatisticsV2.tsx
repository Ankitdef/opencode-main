"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end * 10) / 10);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

const displayStats = [
  { value: 15, suffix: "+", label: "Years of Guiding Experience" },
  { value: 5000, suffix: "+", label: "Happy Trekkers Guided" },
  { value: 250, suffix: "+", label: "Successful Expeditions" },
  { value: 98, suffix: "%", label: "Overall Satisfaction Rate" },
];

function Stat({ stat, started }: { stat: (typeof displayStats)[0]; started: boolean }) {
  const displayVal = stat.value >= 1000 ? `${Math.floor(stat.value / 1000)}K` : null;
  const count = useCountUp(displayVal ? parseFloat(displayVal) : stat.value, 2000, started);

  const value = displayVal
    ? `${Math.round(count)}K`
    : stat.value % 1 !== 0
      ? count.toFixed(1)
      : Math.round(count).toString();

  return (
    <div className="text-center">
      <p className="font-heading text-5xl font-bold leading-none text-white md:text-6xl lg:text-7xl">
        {value}
        <span className="text-primary">{stat.suffix}</span>
      </p>
      <p className="mx-auto mt-4 max-w-[16ch] text-xs font-medium uppercase tracking-[0.25em] text-white/50">
        {stat.label}
      </p>
    </div>
  );
}

export default function StatisticsV2() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-section">
      {/* faint ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]" aria-hidden />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-14 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-primary/60" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Expedition Happiness by the Numbers
            </span>
            <span className="h-px w-10 bg-primary/60" aria-hidden />
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
        >
          {displayStats.map((stat) => (
            <Stat key={stat.label} stat={stat} started={started} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { testimonials } from "@/data/treks";

export default function TestimonialsV2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reduceMotion = useReducedMotion();

  const startAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (reduceMotion) return; // don't auto-advance for reduced-motion users
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  }, [reduceMotion]);

  const pauseAutoAdvance = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoAdvance]);

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    startAutoAdvance();
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    startAutoAdvance();
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    startAutoAdvance();
  };

  const off = reduceMotion ? 0 : 300;
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? off : -off,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -off : off,
      opacity: 0,
    }),
  };

  return (
    <section className="py-section-sm relative overflow-hidden bg-gradient-to-b from-emerald-50/40 via-background/30 to-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary">Reviews</span>
          <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
            Stories from Fellow Adventurers
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Real experiences from trekkers who have embarked on unforgettable journeys with us.
          </p>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-12"
        >
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-semibold text-foreground">4.9/5</span>
            <span className="text-sm text-muted">on Google</span>
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-white/20" />
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-semibold text-foreground">4.8/5</span>
            <span className="text-sm text-muted">on TripAdvisor</span>
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">5K+</div>
            <span className="text-sm font-semibold text-foreground">Happy Trekkers</span>
          </div>
        </motion.div>

        {/* Slider */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={pauseAutoAdvance}
          onMouseLeave={startAutoAdvance}
          onFocusCapture={pauseAutoAdvance}
          onBlurCapture={startAutoAdvance}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="absolute left-1 md:-left-12 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-foreground hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            aria-label="Next testimonial"
            className="absolute right-1 md:-right-12 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-foreground hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Card */}
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-card shadow-xl shadow-black/5 p-8 md:p-12 min-h-[320px] flex items-center" aria-live="polite">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Quote Icon */}
                  <svg className="h-10 w-10 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonials[activeIndex].rating }).map((_, j) => (
                      <svg key={j} className="h-5 w-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg md:text-xl text-muted leading-relaxed italic max-w-2xl mb-6">
                    &ldquo;{testimonials[activeIndex].quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg">
                      {testimonials[activeIndex].name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="text-left">
                      <p className="font-heading font-semibold text-foreground">{testimonials[activeIndex].name}</p>
                      <p className="text-sm text-muted">{testimonials[activeIndex].location}</p>
                      <p className="text-xs text-primary font-semibold">Trek: {testimonials[activeIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === activeIndex}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

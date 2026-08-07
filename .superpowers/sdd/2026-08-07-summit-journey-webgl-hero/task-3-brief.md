### Task 3: Extract `HeroContent` from `HeroSplit`

Move the hero's content column (badge, H1, copy, search selects, CTAs, trust metrics, `ContactPopup` wiring, and the `showPopup`/`destination`/`difficulty` state) out of `HeroSplit.tsx` into a reusable `HeroContent.tsx` so both the WebGL overlay (Task 7) and the `HeroSplit` fallback share one source of truth. Add a `variant` prop to switch text/panel colors for over-image vs over-canvas.

**Files:**
- Create: `adventure-travel/src/components/HeroContent.tsx`
- Modify: `adventure-travel/src/components/HeroSplit.tsx` (replace the content column at lines ~128-228 with `<HeroContent variant="split" />`)

**Interfaces:**
- Produces: `HeroContent({ variant }: { variant: "split" | "scene" })` — self-contained (no props besides variant; owns its own search state and `ContactPopup`).
- Consumes: `treks` from `@/data/treks` (unchanged), `ContactPopup` (unchanged).

- [ ] **Step 1: Create `HeroContent.tsx`**

Move from `HeroSplit.tsx` into this file: `searchDestinations`, `searchDifficulties`, `trustMetrics`, the `showPopup`/`destination`/`difficulty` state, `searchHref`, `rise`, `selectClass`, and the entire content column JSX (HeroSplit lines 130-218). The component signature and the variant-driven classes:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { treks } from "@/data/treks";
import ContactPopup from "./ContactPopup";

const searchDestinations = treks.map((t) => t.name);
const searchDifficulties = ["Easy", "Moderate", "Challenging", "Strenuous"];

const trustMetrics = [
  { value: "5,000+", label: "Happy Trekkers" },
  { value: "250+", label: "Expeditions" },
  { value: "15+", label: "Years Guiding" },
  { value: "4.9★", label: "Avg. Rating" },
];

export default function HeroContent({ variant }: { variant: "split" | "scene" }) {
  const [showPopup, setShowPopup] = useState(false);
  const [destination, setDestination] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const reduceMotion = useReducedMotion();

  const searchQuery = new URLSearchParams();
  if (destination) searchQuery.set("search", destination);
  if (difficulty) searchQuery.set("difficulty", difficulty);
  const searchHref = `/treks${searchQuery.toString() ? `?${searchQuery.toString()}` : ""}`;

  const rise = (delay: number) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };

  const selectClass =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 cursor-pointer " +
    (variant === "scene"
      ? "border-white/25 bg-white/15 text-white placeholder-white/70 [&>option]:text-foreground"
      : "border-gray-200 bg-white text-foreground");

  const headline = "text-white" + (variant === "scene" ? "" : " lg:text-foreground");
  const body = "text-white/85" + (variant === "scene" ? "" : " lg:text-muted");
  const metricValue = "text-white" + (variant === "scene" ? "" : " lg:text-foreground");
  const metricLabel = "text-white/70" + (variant === "scene" ? "" : " lg:text-muted");
  const panel = variant === "scene"
    ? "rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl shadow-black/20 ring-0 backdrop-blur-sm"
    : "rounded-2xl bg-white p-3 shadow-xl shadow-black/10 ring-1 ring-black/5";

  return (
    <>
      <motion.span {...rise(0)} className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Himalayan Alpine Expeditions
      </motion.span>

      <motion.h1 {...rise(0.08)} className={`mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl ${headline}`}>
        Surreal Summits &amp;
        <br className="hidden sm:block" /> <span className="text-gradient">Wild Frontiers</span>
      </motion.h1>

      <motion.p {...rise(0.16)} className={`mt-5 max-w-lg text-base leading-relaxed sm:text-lg ${body}`}>
        Precision-guided treks across the most dramatic alpine passes and sacred valleys of the
        Indian Himalayas — small groups, certified leaders, permits handled.
      </motion.p>

      <motion.div {...rise(0.24)} className={`mt-8 ${panel}`}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label htmlFor="hero-destination" className="sr-only">Destination</label>
            <select id="hero-destination" value={destination} onChange={(e) => setDestination(e.target.value)} className={selectClass}>
              <option value="">Destination</option>
              {searchDestinations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hero-difficulty" className="sr-only">Difficulty</label>
            <select id="hero-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
              <option value="">Difficulty</option>
              {searchDifficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <Link
            href={searchHref}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </Link>
        </div>
      </motion.div>

      <motion.div {...rise(0.32)} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/treks"
          className="shine group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
        >
          Explore All Treks
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <button
          onClick={() => setShowPopup(true)}
          className={`inline-flex items-center justify-center rounded-xl border px-7 py-3.5 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 ${
            variant === "scene"
              ? "border-white/40 bg-white/15 text-white hover:bg-white/25"
              : "border-black/10 bg-white/90 text-foreground shadow-sm hover:bg-white"
          }`}
        >
          Talk to a Trek Expert
        </button>
      </motion.div>

      <motion.div {...rise(0.4)} className="mt-10 grid max-w-md grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 sm:gap-x-4">
        {trustMetrics.map((metric) => (
          <div key={metric.label}>
            <div className={`font-heading text-2xl font-bold ${metricValue}`}>{metric.value}</div>
            <div className={`mt-0.5 text-[11px] font-medium ${metricLabel}`}>{metric.label}</div>
          </div>
        ))}
      </motion.div>

      {showPopup && <ContactPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
```

> Note: `ContactPopup` currently opens in-place; verify the popup still opens and closes after the extraction (Playwright check in Step 3).

- [ ] **Step 2: Slim `HeroSplit.tsx` down to the shell + fallback**

In `HeroSplit.tsx`:
- Delete: `searchDestinations`, `searchDifficulties`, `trustMetrics`, the `showPopup`/`destination`/`difficulty` state, `searchHref`, `rise`, `selectClass` (lines ~16-27, 30-34, 80-96).
- Keep: `heroRef`, `imgRef`, `contentRef`, the GSAP parallax/tilt effect, the section + background image + white wavy panel markup, and the scroll cue.
- Replace the content column (lines ~130-218) with:

```tsx
      {/* Content */}
      <div ref={contentRef} className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 pb-14 pt-28 lg:px-8" style={{ transformStyle: "preserve-3d" }}>
        <HeroContent variant="split" />
      </div>
```

Add the import: `import HeroContent from "./HeroContent";`

- [ ] **Step 3: Verify hero still works**

Run: `npm run build` — expected to pass.
Run: `npx eslint src/components/HeroSplit.tsx src/components/HeroContent.tsx` — expected clean.

Playwright: navigate to `http://localhost:3000`, verify the H1 "Surreal Summits" renders, the destination select has options, the Search button links to `/treks?...`, and clicking "Talk to a Trek Expert" opens the contact popup (then close it).

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroSplit.tsx src/components/HeroContent.tsx
git commit -m "refactor: extract HeroContent for reuse by WebGL hero"
```

---

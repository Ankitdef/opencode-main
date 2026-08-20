# Homepage Redesign — "Two Seasons, One Range"

Date: 2026-08-20
Status: Approved concept, pending implementation plan

## Context

The current homepage (`src/app/page.tsx`) stacks 14 sections: a three.js WebGL
valley fly-through hero followed by overlapping card grids (PopularTreksV2,
FeaturedDestinations, FeaturedAdventuresV2), plus SeasonalExplorer,
ValleyMapSection, PermitTours, SplitSections, AdventureStories,
InstagramGallery, StatisticsV2, TestimonialsV2, FAQV2, CallToActionV2,
MountainPass, TrustedBy.

Problems identified:

- The page reads as a generic stack of similar card grids — "dull".
- The snow-sports courses vertical (`src/data/courses.ts`, `/courses` routes,
  course detail pages) is fully built but completely absent from the homepage.
- The WebGL hero is heavy and is the only distinctive element; everything after
- it underwhelms.

## Concept

**Two Seasons, One Range.** The brand's unique asset is that it runs Himalayan
treks in summer (Apr–Oct) and snow-sports courses in Auli in winter (Dec–Mar).
The homepage is built on that duality: summer sections carry warm
emerald/amber tints, winter sections carry ice/sky tints, and the two halves
meet in the hero.

Decisions locked with the user:

- Feature the existing skiing/snowboarding/backcountry courses (no new
  skateboarding content).
- Full redesign, not a reskin.
- Split photo hero replaces the three.js valley scene.

## Section structure (14 → 9)

### 1. Split Hero (new component, e.g. `SeasonSplitHero.tsx`)

- Full-viewport, two halves: summer trek ridge photo (left) | Auli powder/skier
  photo (right). Plain `<img>` with Unsplash URLs per codebase convention.
- Divider between halves is draggable on desktop (pointer events) and
  scroll-progress-driven on touch devices; both halves parallax subtly.
- Headline spans both halves: "One range. Two seasons." Subline names
  Uttarakhand treks and Auli snow school.
- One CTA per half: "Explore treks" → `/treks`, "Learn to ski" → `/courses`.
- Season date rails: `APR–OCT` on the summer half, `DEC–MAR` on the winter half.
- Altitude chip kept as a small brand motif (static, e.g. "1,200m → 4,700m").
- No WebGL. Static fallback when reduced motion is on (divider centered, no
  drag inertia).

### 2. Summer rail — treks (replaces PopularTreksV2 + FeaturedAdventuresV2 + FeaturedDestinations)

- Horizontal-scroll rail of trek cards from existing `treks[]` (no data
  changes). Card shows image, name, days, difficulty (existing
  `DIFFICULTY_COLORS`), max altitude, price, next batch dates.
- Warm tint background (emerald/amber tokens).
- One "View all treks" link to `/treks`.

### 3. Winter — Snow School (new component; the centerpiece)

- Cinematic showcase of `courses[]` from `src/data/courses.ts`: skiing,
  snowboarding, backcountry.
- Layout: one large featured course (the 7-Day Skiing Course, `featured` flag
  exists in data) plus the remaining courses as secondary cards.
- Each card: image, name, location, level, duration, dates, price, CTA to
  `/courses/<slug>` (existing route).
- Trust stats already present in data surfaced as a strip: 6:1
  student-instructor ratio, 20+ hours coaching/week, completion certificate,
  Nanda Devi backdrop.
- Ice tint background (sky/secondary token).

### 4. The Range (replaces ValleyMapSection + SeasonalExplorer + PermitTours)

- One altitude-band strip: a horizontal elevation profile from ~1,200m to
  ~4,700m with markers for where courses run (Auli ~2,800m) and where key
  treks summit. Data already exists on `treks[]` (`maxAltitude`, itinerary
  altitudes) — no new data source.
- Static SVG/CSS, light scroll reveal. No map library.

### 5. Stories + Testimonials merged (replaces AdventureStories + TestimonialsV2)

- One section: three stories from `stories[]` with the matching testimonial
  quote folded in, instead of two separate sections.

### 6. Stats strip (replaces StatisticsV2 as a full section)

- Inline band of the existing `stats` export, not a standalone full-height
  section.

### 7. FAQ

- Keep FAQV2 content (`faqItems`), slim the presentation.

### 8. CTA + Footer

- Keep CallToActionV2 and FooterV2 as-is.

### Cut entirely

TrustedBy, SplitSections, InstagramGallery, MountainPass, ScrollProgress bar,
ElevationGauge, and the three.js ValleyScene hero. SmoothScrollProvider stays
as the page wrapper, unchanged.

## Data

No new data modules. Reuse `treks[]`, `courses[]`, `stories[]`, `testimonials`,
`faqItems`, `stats`, `REGIONS`, `DIFFICULTIES`, `DIFFICULTY_COLORS` from
`src/data/`. WhatsApp deep-link convention for any lead capture stays.

## Motion & visual rules

- One signature interaction: the hero divider. Everything else is restrained.
- framer-motion inline per component, gated on `useReducedMotion()` (existing
  convention). Enter animations `ease-out`; no bounce/elastic easing.
- Prefer `MotionWrapper.tsx` helpers (`FadeUp`, `StaggerContainer`) for new
  work where they fit.
- Colors only from existing tokens in `globals.css` (`primary`, `accent`,
  `secondary`, `background`, `card`, ...). Summer sections warm-tinted, winter
  sections ice-tinted. No new palette, no purple gradients, no nested cards.
- Images: plain `<img loading="lazy" decoding="async">` with Unsplash URLs
  (existing convention), not `next/image`.
- Headings Poppins (`font-heading`), body Inter.

## Architecture notes

- Home page stays a `"use client"` component composing section components
  (existing model). New sections are client components like the rest.
- Below-the-fold heavy sections stay `dynamic()` imports with skeleton
  placeholders (existing pattern in `page.tsx`).
- Hero split divider: pointer events + `requestAnimationFrame`, no new
  dependency. Touch fallback: divider follows vertical scroll progress.

## Reduced motion & accessibility

- All motion gated on `useReducedMotion()`; reduced-motion users get a static
  centered split hero and static reveals.
- Draggable divider has a keyboard alternative (arrow keys move it) and
  `aria` labeling; photos have alt text.
- Contrast: no gray-on-colored text; body copy meets AA on both tints.

## Verification

- `npm run build` (from `adventure-travel/`) — static generation must pass.
- `npm run lint`.
- No test framework exists in this repo; visual verification via `npm run dev`.

## Out of scope

- New content/data entry (courses, treks stay as-is).
- Other pages (`/treks`, `/courses`, detail pages) beyond links to them.
- Dark mode wiring (existing `dark:` variants remain inert).

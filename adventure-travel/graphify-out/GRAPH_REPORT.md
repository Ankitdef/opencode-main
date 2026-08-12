# Graph Report - .  (2026-08-13)

## Corpus Check
- 80 files · ~60,424 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 450 nodes · 642 edges · 28 communities (22 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Homepage & Shared Components
- Auth & Navigation
- UI Library & Layout Chrome
- Hero & Landing Sections
- TypeScript Config
- Cancellation Policy
- Runtime Dependencies
- Dev Tooling
- Course System
- Trek Detail
- Auth Store (Local)
- Trek Listing
- 3D Scene (Valley)
- FAQ Page
- Destinations Page
- Activities Page
- Contact Page
- ESLint Config
- Next.js Config
- Next.js Types
- PostCSS Config
- Screenshot Script

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `useAuth()` - 15 edges
3. `SmartImage()` - 14 edges
4. `StaggerContainer()` - 13 edges
5. `StaggerItem()` - 13 edges
6. `FadeUp()` - 11 edges
7. `createClient()` - 11 edges
8. `treks` - 9 edges
9. `createActivityBooking()` - 8 edges
10. `lsRead()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `TrekDetailClient()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/treks/[id]/TrekDetailClient.tsx → src/contexts/AuthContext.tsx
- `TrekDetailClient()` --calls--> `createTrekBooking()`  [EXTRACTED]
  src/app/treks/[id]/TrekDetailClient.tsx → src/lib/auth.ts
- `ActivitiesPage()` --calls--> `useReveal()`  [EXTRACTED]
  src/app/activities/ActivitiesPageClient.tsx → src/hooks/useReveal.ts
- `Props` --references--> `Course`  [EXTRACTED]
  src/app/courses/[course]/CourseDetailClient.tsx → src/data/courses.ts
- `CourseDetailClient()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/courses/[course]/CourseDetailClient.tsx → src/contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (28 total, 6 thin omitted)

### Community 0 - "Homepage & Shared Components"
Cohesion: 0.06
Nodes (32): STATIC_ROUTES, TREK_ROUTES, featuredTreks, destinations, FeaturedDestinations(), hrefFor(), images, StaggerContainer() (+24 more)

### Community 1 - "Auth & Navigation"
Cohesion: 0.09
Nodes (39): CourseDetailClient(), DashboardPage(), STATUS_COLORS, inter, metadata, poppins, viewport, LoginPage() (+31 more)

### Community 2 - "UI Library & Layout Chrome"
Cohesion: 0.06
Nodes (16): destinations, instagramImages, legalLinks, popularTreks, quickLinks, socials, regions, AnimationProps (+8 more)

### Community 3 - "Hero & Landing Sections"
Cohesion: 0.07
Nodes (21): AdventureStories, FAQV2, InstagramGallery, PermitTours, SeasonalExplorer, StatisticsV2, TestimonialsV2, MILESTONES (+13 more)

### Community 4 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "Cancellation Policy"
Cohesion: 0.08
Nodes (11): ArrowRightIcon(), CANCELLATION_STEPS, CancellationPolicyPage(), COMPANY_CANCELLATION_REASONS, CreditCardIcon(), FAQS, NO_SHOW_SCENARIOS, NON_REFUNDABLE_ITEMS (+3 more)

### Community 6 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (27): framer-motion, gsap, @netlify/plugin-nextjs, next, dependencies, framer-motion, gsap, @netlify/plugin-nextjs (+19 more)

### Community 7 - "Dev Tooling"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 8 - "Course System"
Cohesion: 0.11
Nodes (12): INC_ICONS, Props, Tab, TAB_LIST, TYPE_COLORS, TYPE_COLORS, metadata, Course (+4 more)

### Community 9 - "Trek Detail"
Cohesion: 0.10
Nodes (9): DIFFICULTY_COLORS, GALLERY_IMAGES, GalleryTab(), INCLUDED, NOT_INCLUDED, Tab, TABS, TREK_GALLERIES (+1 more)

### Community 10 - "Auth Store (Local)"
Cohesion: 0.21
Nodes (12): ActivityBooking, Booking, createActivityBooking(), createBooking(), createUser(), findUserByEmail(), getActivityBookings(), getBookings() (+4 more)

### Community 11 - "Trek Listing"
Cohesion: 0.13
Nodes (8): metadata, DIFF_BADGE, DIFFICULTIES, DIFFICULTY_ORDER, DURATION_OPTIONS, PRICE_OPTIONS, SORT_OPTIONS, REGIONS

### Community 12 - "3D Scene (Valley)"
Cohesion: 0.26
Nodes (12): buildTerrain(), buildTrail(), COLORS, GRAD2, heightAt(), PERM, simplex2(), trailCurve() (+4 more)

### Community 13 - "FAQ Page"
Cohesion: 0.14
Nodes (5): FAQ_CATEGORIES, FAQCategory, FAQItemData, FAQ_DATA, metadata

### Community 14 - "Destinations Page"
Cohesion: 0.20
Nodes (7): difficultyRanges, metadata, categories, Destination, destinations, regions, sortOptions

### Community 15 - "Activities Page"
Cohesion: 0.24
Nodes (6): activities, ActivitiesPage(), colorMap, icons, metadata, useReveal()

## Knowledge Gaps
- **163 isolated node(s):** `activities`, `colorMap`, `icons`, `metadata`, `REFUND_TIERS` (+158 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SmartImage()` connect `Homepage & Shared Components` to `UI Library & Layout Chrome`, `Trek Detail`, `Trek Listing`, `Destinations Page`, `Activities Page`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Auth & Navigation` to `Course System`, `Trek Detail`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `StaggerContainer()` connect `Homepage & Shared Components` to `FAQ Page`, `UI Library & Layout Chrome`, `Cancellation Policy`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `activities`, `colorMap`, `icons` to the rest of the system?**
  _163 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Homepage & Shared Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05889724310776942 - nodes in this community are weakly interconnected._
- **Should `Auth & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.08549019607843138 - nodes in this community are weakly interconnected._
- **Should `UI Library & Layout Chrome` be split into smaller, more focused modules?**
  _Cohesion score 0.059379217273954114 - nodes in this community are weakly interconnected._
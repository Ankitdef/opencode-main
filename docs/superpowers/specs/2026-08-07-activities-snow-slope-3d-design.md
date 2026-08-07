# Activities page — fixed snow-slope 3D backdrop (skiing / snowboarding / backcountry)

Date: 2026-08-07

## Goal

Give the `/activities` page the same WebGL treatment as the homepage valley flythrough: a fixed, whole-page snow-slope 3D scene behind all content, with a stylized skier carving down the run. Inspiration: alpine skiing, snowboarding, backcountry touring.

## Design decisions (user-confirmed)

- **Fixed snow-slope backdrop, whole page** — same pattern as the homepage: content scrolls above a `fixed inset-0 z-0` WebGL scene; camera/progress is driven by full-page document scroll.
- **Stylized skier carving** — a skier built from 3D primitives (no external model assets) carves S-turns down the slope.
- **Scroll = descent + always-carving** — scroll progress places the skier on the run (top of page = high on the slope, bottom = base); a time-based sway keeps the carving motion alive regardless of scroll.
- **Bright alpine day** — powder-blue sky, bright white snow, cold airy fog.
- **3D scene as hero** — the photo hero banner is removed; the first `min-h-screen` section shows the "Activities" title + subtitle over the live slope.

## Architecture

Mirror the shipped homepage valley feature exactly (`ValleyScene`/`ValleyHero`), untouched.

### `adventure-travel/src/components/three/SkiScene.tsx` (new)

Default export, **no props**, `"use client"`. Document-scroll drive identical to `ValleyScene`:

```
progressRef.current = clamp(scrollY / (scrollHeight - innerHeight), 0, 1)
```

Composition:
- **Slope** — a wide plane descending from a snow-covered ridge at the far end toward the base; vertex-colored white → pale blue-grey as it falls, with a shallow carved run down the middle. Fog + background `#dff0ff` (bright alpine).
- **Pines** — instanced cone firs (dark blue-green, snow-tipped) placed along both flanks of the run (instancing pattern mirrors `Forest`).
- **Skier** — stylized primitives: two ski boards, boots, body, jacket, head, two poles; leans into turns.
- **Carve path** — a CatmullRom S-curve from ridge to base. `curve.getPoint(p)` sets the skier's base position; a time-based lateral sway + lean gives the always-carving feel.
- **Camera** — trails behind/above the skier looking down-slope; subtle mouse parallax (same as `ValleyScene`'s `Rig`).
- **Powder** — light white particle puffs kicked up near the skis + a light falling-snow drift (few hundred points).
- **Guards** — `document.hidden` pause in frame loops; reduced-motion `staticView` static frame; `dpr [1,1.75]`; targeted `eslint-disable` comments per the repo convention (never whole-file).

### `adventure-travel/src/components/SkiHero.tsx` (new)

Mirrors `ValleyHero`:
- `fixed inset-0 z-0` container hosts `dynamic(() => import("./three/SkiScene"), { ssr: false })`, `aria-hidden`.
- **Mount-gate**: `useState(false)` + post-hydration `isWebGLAvailable()` so SSR and first client render both output the fallback (hydration safety).
- **`document.documentElement.dataset.snow3d = "true"`** set when mounted, cleaned up on unmount.
- **Fallback (no WebGL)**: a CSS sky-gradient hero band (powder-blue → white) with the "Activities" title. Lazy version: no photo in the fallback. Add the hero photo only if the user asks.
- **Reduced motion**: the scene renders a static frame at a good vantage.

### `adventure-travel/src/app/activities/ActivitiesPageClient.tsx` (modify)

- Remove the photo hero banner; `<SkiHero />` replaces it. The hero is the first `min-h-screen` section over the scene (title + subtitle + accent).
- Wrap everything after `<SkiHero />` in `<div className="relative z-10">`.
- Page root: drop `bg-white dark:bg-background` (make it transparent) so the fixed scene shows through.
- **Translucent** section roots:
  - Skiing feature banner (`bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100` → `from-sky-50/60 via-blue-50/50 to-sky-100/60 backdrop-blur-md`).
  - "What Adventure Calls You?" and "Why Adventure With Us?" are already `bg-accent/5` — translucent as-is, leave unchanged.
- **Stay solid** (designed color bands): the dark ILP section, the final gradient CTA.
- Internal cards keep solid backgrounds.
- `#skiing` anchor, Skills Academy cards, video embeds, course modal: unchanged.

## Behavior matrix

| Environment | Result |
|---|---|
| WebGL available | Fixed 3D snow scene behind all content; skier descends as you scroll |
| No WebGL | CSS gradient hero band; content sections render normally (translucent over the page's light background reads near-white, as today) |
| `prefers-reduced-motion: reduce` | Static 3D frame, skier and camera frozen |
| Tab hidden | Frame loops pause (`document.hidden`) |
| Mobile | Same scene; forest/pine counts lowered (mirror valley's mobile counts) |

## Performance notes

- Same budget as the valley scene: `dpr [1,1.75]`, fog culling, instanced pines, `powerPreference: "high-performance"`.
- Scene renders behind the whole page (deliberate tradeoff, same as homepage).
- `backdrop-blur-md` only on the skiing banner (the other content sections are already translucent or transparent) — far fewer blur layers than the homepage.

## Out of scope

- No external model/skeleton assets for the skier.
- No new npm dependencies.
- No changes to the homepage valley feature or `terrain.ts`.
- SkiingCourseModal and all copy unchanged.

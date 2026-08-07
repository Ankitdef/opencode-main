# Design: Valley flythrough behind the whole homepage

**Date:** 2026-08-07
**Status:** Approved
**Scope:** Extends the Summit Journey WebGL hero so the valley flythrough continues for the entire homepage scroll. The 3D scene becomes a fixed page-wide background; page content scrolls above it.

## Goal

The user loves the WebGL valley flythrough and wants it to keep going as the whole page scrolls down. The valley stays visible behind the page, the camera flies from the valley floor to the summit ridge across the full page length, and the site's content sits above the valley. First few sections get translucent backgrounds so the valley glows through; the summit is reached at the bottom of the page, where MountainPass now lives.

## Architecture

### Scene host (`ValleyHero`, modified)

- Drop the `300vh` sticky scroll zone and the handoff-fade overlay entirely.
- `ValleyHero` renders:
  - `<div className="fixed inset-0 z-0" aria-hidden>` wrapping the dynamically-imported `<ValleyScene>` (`ssr:false`). The canvas fills the viewport and is always on screen.
  - The hero content as the first normal section: `<section className="relative z-10 flex min-h-screen items-center">` containing `<HeroContent variant="scene" />`. It sits on the first screen over the trailhead and scrolls away normally.
- The mount-gate (`useState(false)` + post-hydration `isWebGLAvailable()` effect) stays — it prevents the hydration mismatch.
- `document.documentElement.dataset.hero3d = "true"` stays set while mounted, so the DOM `SnowParticles` stay paused for the whole page (the scene carries its own snow).
- No WebGL → unchanged `HeroSplit` fallback (no canvas, no dataset flag).

### Page content above the canvas (`page.tsx`, modified)

- Wrap everything after `ValleyHero` in `<div className="relative z-10">` so all static content paints above the `fixed z-0` canvas (a fixed layer otherwise covers static content regardless of DOM order).
- Move `<MountainPass />` from its current position (second) to just before `<FooterV2 />`.
- Everything else (SnowParticles, ElevationGauge, ScrollProgress, ScrollDepth wrappers, all sections) stays in order.

### Scene drive (`ValleyScene`, modified)

- Camera progress = full document scroll: `p = clamp(scrollY / (docScrollHeight - innerHeight), 0, 1)`, computed from a native `window` scroll listener. Replaces the section-rect computation.
- Remove the `scrolled-past` / `below-viewport` bails from `Rig` and `SnowDrift` — the scene is always on-screen now. Keep the `document.hidden` bail.
- `sectionRef` prop is no longer needed by the scene; drop it from `ValleyScene`, `Rig`, and `SnowDrift` (and from `ValleyHero`'s usage). The hero content no longer needs a section ref either.
- `CAMERA_PATH`, terrain, trail, forest, snow, dpr clamp `[1, 1.75]`, reduced-motion static frame (`staticView`) all unchanged.

### Translucent first sections

The first three content sections get glass treatment (valley glows through; internal cards keep their own readability):

- `TrustedBy`, `PopularTreksV2`, `HimalayanMap`: section background becomes translucent + blurred (e.g. `bg-background/70 backdrop-blur-md` or `glass` classes) instead of solid.
- MountainPass (moved to the bottom, near the summit): translucent section background so the summit ridge shows behind its stats; its internal stat cards keep solid styling for readability.
- All sections below HimalayanMap keep their current solid backgrounds.

## Behavior

- Top of page: hero headline + search over the valley trailhead.
- Scrolling the whole page: camera glides up the valley, arriving at the summit ridge at the bottom.
- ElevationGauge already maps altitude to the full page — it now matches the flight (no change).
- Reduced motion: static frame (unchanged).
- No WebGL: HeroSplit fallback; the rest of the page structure is WebGL-independent and unchanged.

## Performance

- Same light scene (procedural terrain, ≤1500 instanced trees, ≤800 snow points, dpr clamp `[1,1.75]`). The only added cost is that it renders behind the whole page instead of a 300vh zone.
- If mobile lag is reported, reduce tree/snow counts or dpr — never remove the effect.

## Out of scope

- No changes to the 3D assets (terrain, trail, forest, snow, camera path).
- No changes to the ElevationGauge, ScrollDepth, SnowParticles, Navbar.
- No changes below the wrapped content except MountainPass's relocation + translucency.

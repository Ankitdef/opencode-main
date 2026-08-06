# Summit Journey — WebGL Hero Design Spec

## Overview
Replace the current 2D hero (`HeroSplit`) with a full-screen WebGL (Three.js) valley flythrough. Scroll carries the camera up a procedurally generated Himalayan trail from the valley floor to the summit ridge, where the canvas hands off to the existing 2D `MountainPass` section. Rest of the homepage stays unchanged.

Approved scope (user): **Hero takeover only** — signature moment is the scroll-flythrough valley. Rest of the page keeps current DOM 3D effects.

## Dependencies
- `three` — WebGL engine
- `@react-three/fiber@^9` — React 19 renderer
- `@react-three/drei@^10` — helpers (useScroll, instancing utilities)
- `@types/three`
- Skill: `cloudai-x/threejs-skills@threejs-animation` (installed globally)

## Changes

### 1. `src/components/three/ValleyScene.tsx` (new, client)
- Full-screen `<Canvas>` replacing `<HeroSplit />` in `page.tsx` (import swap; `HeroSplit` retained as the WebGL-unavailable fallback).
- Scene contents, all procedural (zero downloaded assets):
  - **Terrain**: `PlaneGeometry` displaced by simplex noise → ridges + valley floor; vertex colors pine-green → rock → snow as altitude rises.
  - **Trail**: light-colored strip following a `CatmullRomCurve3` spline up the valley to the summit.
  - **Pine forest**: `InstancedMesh` ~1,500 instances placed on the flanks via noise threshold.
  - **Snow drift**: `Points` system (lower count than DOM variant; DOM `SnowParticles` paused while hero is on-screen).
  - **Lighting/fog**: directional sun + hemisphere light + atmospheric fog (fog provides depth — no shadow maps).
- **Camera path**: hero wrapped in a ~300vh scroll zone; drei `useScroll` maps scroll → progress along the spline path. Start: low in valley, looking up at the summit. End: cresting the ridge, looking out over the range.
- Desktop: subtle mouse parallax offset on camera.
- `prefers-reduced-motion`: static scenic frame (camera locked at the valley view), content still scrolls.
- Fade-out on `scrollYProgress > ~0.9` of the hero zone → blends into `MountainPass` below.

### 2. `page.tsx`
- Replace `<HeroSplit />` with `<ValleyHero />` wrapper that renders `ValleyScene` (or `HeroSplit` if `!WebGLRenderingContext`).
- Keep `ElevationGauge`, `ScrollDepth`, `SnowParticles` wiring as-is.

### 3. Performance (lazy but not sloppy)
- `dpr={[1, 1.75]}`
- Instanced meshes, no shadow maps
- Render loop pauses when tab hidden or hero scrolled fully past
- Particle counts reduced on mobile (match `window.innerWidth < 768`)

## Error handling / fallback
- No WebGL context → render existing `HeroSplit` unchanged.
- Canvas mount errors caught → fall back to `HeroSplit`.

## Testing / verification
- `npm run build` (from `adventure-travel/`) + `npx eslint` on touched files
- Playwright: canvas present, zero console errors, camera transform changes as scroll progresses, mobile viewport (390x844) renders, reduced-motion (via emulation) shows static frame

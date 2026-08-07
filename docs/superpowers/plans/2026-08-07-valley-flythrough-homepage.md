# Valley Flythrough Behind the Whole Homepage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the 300vh WebGL hero flythrough into a page-wide fixed background: the camera flies from the valley floor to the summit across the full homepage scroll, content scrolls above it, first three sections + MountainPass go translucent.

**Architecture:** `ValleyHero` becomes a fixed full-viewport scene host (canvas at `z-0`) plus the hero content as the first normal section (`z-10`). All remaining page content is wrapped in a `relative z-10` container so it paints above the fixed canvas. The camera progress is driven by full-document scroll instead of the section rect. `MountainPass` moves to just before the footer (summit arrival).

**Tech Stack:** Next.js 16 (App Router, `"use client"`), React 19, TypeScript (strict), Tailwind v4, three + @react-three/fiber (already installed), Lenis (via `SmoothScrollProvider`).

## Global Constraints

- npm commands run in `C:\Users\aka54\Downloads\opencode-main\adventure-travel`; git commands in `C:\Users\aka54\Downloads\opencode-main`. Windows PowerShell — `&&` does not work.
- No test framework configured. Verify with `npm run build` + `npx eslint <changed files>` + Playwright.
- `drei` must NOT be added. `THREE.MathUtils.simplex2` does not exist in three 0.185 — never use it.
- Every component is `"use client"`; framer-motion/GSAP animations already respect `prefers-reduced-motion` — keep that.
- The WebGL scene must keep pausing when `document.hidden`; reduced-motion keeps the static frame.
- No WebGL → `HeroSplit` fallback, no canvas, `dataset.hero3d` must not be set.
- R3F imperative patterns trigger eslint-plugin-react-hooks v6 false positives — use targeted `eslint-disable-next-line <rule> -- <justification>` comments (repo precedent `TrekDetailClient.tsx:735`), never whole-file disables.
- The site targets INR (`Rs.`) and `en_IN` copy; do not change any copy.

---

### Task 1: Wrap page content and relocate MountainPass

**Files:**
- Modify: `adventure-travel/src/app/page.tsx`

**Interfaces:**
- Consumes: existing `ValleyHero`, `MountainPass`, `FooterV2` and the section components — no signature changes.
- Produces: page structure where everything after `ValleyHero` sits in `<div className="relative z-10">`, and `MountainPass` renders just above `FooterV2`. This container is what later tasks rely on to paint content above the fixed `z-0` canvas.

- [ ] **Step 1: Wrap content and move MountainPass**

In `page.tsx`, inside `<main>`:

1. Move the `<MountainPass />` line from its current position (directly after `<ValleyHero />`) to immediately before `<FooterV2 />`.
2. Wrap everything after `<ValleyHero />` in a single `<div className="relative z-10">`. The result:

```tsx
export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative overflow-x-hidden">
        <ScrollProgress />
        <SnowParticles />
        <ElevationGauge />
        <ValleyHero />
        <div className="relative z-10">
          <TrustedBy />
          <ScrollDepth><PopularTreksV2 /></ScrollDepth>
          <ScrollDepth depth={40} rotateX={2}><HimalayanMap /></ScrollDepth>
          <ScrollDepth><SplitSections /></ScrollDepth>
          <ScrollDepth depth={30}><FeaturedDestinations /></ScrollDepth>
          <ScrollDepth><SeasonalExplorer /></ScrollDepth>
          <ScrollDepth depth={40} rotateX={2}><FeaturedAdventuresV2 /></ScrollDepth>
          <ScrollDepth><PermitTours /></ScrollDepth>
          <ScrollDepth depth={30}><AdventureStories /></ScrollDepth>
          <ScrollDepth><InstagramGallery /></ScrollDepth>
          <ScrollDepth depth={20}><StatisticsV2 /></ScrollDepth>
          <ScrollDepth><TestimonialsV2 /></ScrollDepth>
          <ScrollDepth><FAQV2 /></ScrollDepth>
          <ScrollDepth><CallToActionV2 /></ScrollDepth>
          <MountainPass />
          <FooterV2 />
        </div>
        <FloatingWhatsApp />
      </main>
    </SmoothScrollProvider>
  );
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build` — expected pass.
Run: `npx eslint src/app/page.tsx` — expected clean.

- [ ] **Step 3: Commit**

```bash
git add adventure-travel/src/app/page.tsx
git commit -m "refactor: wrap homepage content above hero layer and relocate MountainPass"
```

---

### Task 2: Fixed whole-page scene + document-scroll drive

**Files:**
- Modify: `adventure-travel/src/components/three/ValleyScene.tsx`
- Modify: `adventure-travel/src/components/ValleyHero.tsx`

**Interfaces:**
- Consumes: `HeroContent` (`variant="scene"`), `HeroSplit` (fallback), `isWebGLAvailable` from `@/lib/webgl`, `dynamic` from `next/dynamic`, `ValleyScene` default export.
- Produces: `ValleyScene()` — default export, **no props**. `ValleyHero()` — default export, **no props**. `ValleyScene` consumes `CAMERA_PATH` (unchanged), `buildTerrain`/`buildTrail`/`heightAt`/`simplex2` (unchanged).

- [ ] **Step 1: Rewrite `ValleyScene.tsx`**

Replace the whole file with:

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildTerrain, buildTrail, heightAt, simplex2 } from "./terrain";

const CAMERA_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 4, 160),   // valley entrance, looking up-valley
  new THREE.Vector3(0, 10, 90),
  new THREE.Vector3(-4, 20, 30),
  new THREE.Vector3(-8, 34, -30),
  new THREE.Vector3(-14, 52, -90),
  new THREE.Vector3(-20, 72, -145),
  new THREE.Vector3(-24, 88, -165), // cresting the ridge
]);

function Rig({
  progressRef,
  staticView,
}: {
  progressRef: React.MutableRefObject<number>;
  staticView: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const mouse = useRef({ x: 0, y: 0 });
  const look = useRef(new THREE.Vector3());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // eslint-disable-next-line react-hooks/immutability -- R3F frame loop drives the camera imperatively by design
  useFrame(() => {
    if (document.hidden) return;
    const p = staticView ? 0 : progressRef.current;
    camera.position.copy(CAMERA_PATH.getPoint(p));
    look.current.copy(CAMERA_PATH.getPoint(Math.min(1, p + 0.06)));
    if (!staticView) {
      // eslint-disable-next-line react-hooks/immutability -- camera is a live THREE.Vector3, mutated per frame
      camera.position.x += mouse.current.x * 1.5;
      camera.position.y += mouse.current.y * 1.0;
    }
    camera.lookAt(look.current);
  });
  return null;
}

function Forest({ count }: { count: number }) {
  const inst = useMemo(() => {
    /* eslint-disable react-hooks/purity -- procedural instancing samples Math.random during render (R3F pattern) */
    const geo = new THREE.ConeGeometry(0.9, 3.2, 5);
    const mat = new THREE.MeshStandardMaterial({ color: "#2f6b47", roughness: 1 });
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    let placed = 0;
    let guard = 0;
    while (placed < count && guard < count * 20) {
      guard++;
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 340;
      const y = heightAt(x, z);
      if (y < 1.5 || y > 12) continue;          // only mid flanks
      if (Math.abs(x) < 6) continue;            // keep the valley/trail clear
      if (simplex2(x * 0.05, z * 0.05) < 0.1) continue;
      dummy.position.set(x, y, z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.6 + Math.random() * 1.1;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(placed++, dummy.matrix);
    }
    /* eslint-enable react-hooks/purity */
    mesh.count = placed;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return mesh;
  }, [count]);
  return <primitive object={inst} />;
}

function SnowDrift({ count, height }: { count: number; height: number }) {
  const points = useMemo(() => {
    /* eslint-disable react-hooks/purity -- procedural particle field samples Math.random during render (R3F pattern) */
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    /* eslint-enable react-hooks/purity */
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: "white",
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }, [count]);

  // eslint-disable-next-line react-hooks/immutability -- R3F frame loop mutates the buffer attr imperatively
  useFrame((_, delta) => {
    if (document.hidden) return;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) - delta * 3;
      if (y < -2) y = height + 2;
      attr.setY(i, y);
    }
    // eslint-disable-next-line react-hooks/immutability -- buffer attr mutated in the R3F frame loop
    attr.needsUpdate = true;
  });
  return <primitive object={points} />;
}

export default function ValleyScene() {
  const progressRef = useRef(0);
  const [staticView, setStaticView] = useState(false);
  const terrain = useMemo(() => buildTerrain(), []);
  const trail = useMemo(() => buildTrail(), []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const forestCount = isMobile ? 1000 : 1500;
  const snowCount = isMobile ? 400 : 800;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time reduced-motion probe, no deps to subscribe to
    setStaticView(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      progressRef.current = total > 0 ? THREE.MathUtils.clamp(window.scrollY / total, 0, 1) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 500, position: [0, 4, 160] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <color attach="background" args={["#cfe4f7"]} />
      <fog attach="fog" args={["#cfe4f7", 60, 320]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[30, 60, 40]} intensity={1.4} />
      <primitive object={terrain} />
      <primitive object={trail} />
      <Forest count={forestCount} />
      <SnowDrift count={snowCount} height={40} />
      <Rig progressRef={progressRef} staticView={staticView} />
    </Canvas>
  );
}
```

Changes vs the previous version: progress is `scrollY / (scrollHeight - innerHeight)` (full page, not section rect); `Rig` and `SnowDrift` no longer take `sectionRef` and no longer bail when the scene is off-screen (it is always on-screen); `ValleyScene` takes no props.

- [ ] **Step 2: Rewrite `ValleyHero.tsx`**

Replace the whole file with:

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HeroSplit from "./HeroSplit";
import HeroContent from "./HeroContent";
import { isWebGLAvailable } from "@/lib/webgl";

const ValleyScene = dynamic(() => import("./three/ValleyScene"), { ssr: false });

export default function ValleyHero() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    // ponytail: mount-gate so SSR (no WebGL) and first client render both output HeroSplit, avoiding a hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-gate after hydration is the intended post-SSR capability check
    if (isWebGLAvailable()) setWebgl(true);
  }, []);

  useEffect(() => {
    if (!webgl) return;
    document.documentElement.dataset.hero3d = "true";
    return () => {
      delete document.documentElement.dataset.hero3d;
    };
  }, [webgl]);

  if (!webgl) return <HeroSplit />;

  return (
    <>
      {/* Whole-page valley scene, fixed behind everything */}
      <div className="fixed inset-0 z-0" aria-hidden>
        <ValleyScene />
      </div>

      {/* Hero headline + search over the trailhead */}
      <section className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <HeroContent variant="scene" />
        </div>
      </section>
    </>
  );
}
```

Changes vs the previous version: no `sectionRef`, no `fadeRef`, no handoff-fade overlay, no 300vh sticky zone; the scene sits in a `fixed inset-0 z-0` container and the hero content is the first normal `min-h-screen` section.

- [ ] **Step 3: Verify build + lint + typecheck**

Run: `npm run build` — expected pass.
Run: `npx eslint src/components/three/ValleyScene.tsx src/components/ValleyHero.tsx` — expected clean.
Run: `npx tsc --noEmit` — expected pass (exit 0).

- [ ] **Step 4: Commit**

```bash
git add adventure-travel/src/components/three/ValleyScene.tsx adventure-travel/src/components/ValleyHero.tsx
git commit -m "feat: drive valley flythrough across the full page scroll"
```

---

### Task 3: Translucent sections over the valley

**Files:**
- Modify: `adventure-travel/src/components/TrustedBy.tsx`
- Modify: `adventure-travel/src/components/PopularTreksV2.tsx`
- Modify: `adventure-travel/src/components/HimalayanMap.tsx`
- Modify: `adventure-travel/src/components/MountainPass.tsx`

**Interfaces:**
- Consumes: nothing new. Pure Tailwind class swaps on existing section root elements.
- Produces: first three content sections + MountainPass have translucent/backdrop-blurred section backgrounds so the fixed valley shows through. All internal cards keep their own solid backgrounds (unchanged).

- [ ] **Step 1: TrustedBy**

In `TrustedBy.tsx`, line ~16, change:

```tsx
<section className="py-section-sm bg-background border-b border-gray-100 dark:border-white/5">
```

to:

```tsx
<section className="py-section-sm bg-background/70 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
```

- [ ] **Step 2: PopularTreksV2**

In `PopularTreksV2.tsx`, line ~74, change:

```tsx
<section id="treks" className="py-section-sm bg-background">
```

to:

```tsx
<section id="treks" className="py-section-sm bg-background/70 backdrop-blur-md">
```

- [ ] **Step 3: HimalayanMap**

In `HimalayanMap.tsx`, line ~87, change:

```tsx
<section className="py-section-sm bg-gradient-to-b from-background to-accent/5">
```

to:

```tsx
<section className="py-section-sm bg-gradient-to-b from-background/70 via-background/40 to-accent/10 backdrop-blur-md">
```

- [ ] **Step 4: MountainPass**

In `MountainPass.tsx`, line ~51, change:

```tsx
className="relative h-[110vh] overflow-hidden bg-gradient-to-b from-white via-secondary/10 to-background"
```

to:

```tsx
className="relative h-[110vh] overflow-hidden bg-gradient-to-b from-white/70 via-secondary/10 to-background/80"
```

Keep everything else in MountainPass (SVG layers, copy, mist) unchanged.

- [ ] **Step 5: Verify build + lint**

Run: `npm run build` — expected pass.
Run: `npx eslint src/components/TrustedBy.tsx src/components/PopularTreksV2.tsx src/components/HimalayanMap.tsx src/components/MountainPass.tsx` — expected clean.

- [ ] **Step 6: Commit**

```bash
git add adventure-travel/src/components/TrustedBy.tsx adventure-travel/src/components/PopularTreksV2.tsx adventure-travel/src/components/HimalayanMap.tsx adventure-travel/src/components/MountainPass.tsx
git commit -m "style: translucent section backgrounds over the valley scene"
```

---

### Task 4: Final verification

**Files:**
- None (verification only).

- [ ] **Step 1: Full build + lint**

Run: `npm run build` — expected success.
Run: `npx eslint src/components/three/ValleyScene.tsx src/components/ValleyHero.tsx src/components/HeroContent.tsx src/components/HeroSplit.tsx src/components/TrustedBy.tsx src/components/PopularTreksV2.tsx src/components/HimalayanMap.tsx src/components/MountainPass.tsx src/app/page.tsx` — expected clean.

- [ ] **Step 2: Playwright — desktop scroll-through**

Dev server at `http://localhost:3000` (or `npm run dev`). Playwright:
- Navigate to `http://localhost:3000`; wait ~2s.
- Assert `document.querySelectorAll("canvas").length >= 2` (WebGL scene + paused DOM snow).
- Assert `document.documentElement.dataset.hero3d === "true"`.
- Assert H1 "Surreal Summits & Wild Frontiers" visible.
- Scroll the full page via `page.mouse.wheel` in ~10 increments, ~600ms between, collecting console errors after each — expect zero.
- Assert page height > 5 viewport heights.

- [ ] **Step 3: Playwright — scene changes across the page**

While scrolling top → bottom, take two `canvas` element screenshots (e.g. near top and near bottom) and assert their bytes differ (camera flew from trailhead to summit).

- [ ] **Step 4: Playwright — mobile + reduced motion + fallback**

Mobile:
```js
async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  return {
    canvasCount: await page.locator('canvas').count(),
    scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
    errors: 0,
  };
}
```
Expected: ≥2 canvases, `scrollWidth <= 390`, zero console errors.

Reduced motion: `emulateMedia({ reducedMotion: 'reduce' })`, reload — expected: scene canvas present (static frame), zero errors.

WebGL-unavailable fallback (simulate in a new context):
```js
async (page) => {
  const ctx = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      const t = String(type);
      if (t.startsWith('webgl') || t.startsWith('experimental-webgl')) return null;
      return orig.call(this, type, ...args);
    };
  });
  const p2 = await ctx.newPage();
  await p2.goto('http://localhost:3000', { waitUntil: 'load' });
  await p2.waitForTimeout(2000);
  const out = await p2.evaluate(() => ({
    webglUnavailable: !(document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')),
    noHero300: Array.from(document.querySelectorAll('section')).filter(s => s.getAttribute('style')?.includes('300vh')).length === 0,
    hero3d: document.documentElement.dataset.hero3d ?? null,
    h1: document.querySelector('h1')?.textContent ?? null,
    splitImageVisible: !!Array.from(document.querySelectorAll('img')).find(i => i.src.includes('images.unsplash.com') && i.getBoundingClientRect().top < window.innerHeight),
  }));
  await ctx.close();
  return out;
}
```
Expected: `webglUnavailable: true`, `noHero300: true`, `hero3d: null`, H1 present, split hero image visible, zero console errors.

- [ ] **Step 5: Report**

Summarize in a report: what shipped, fallback behavior, performance notes (scene now renders behind the whole page — note the deliberate tradeoff), and any deferred issues. No commit in this task.

---

## Self-Review

- **Spec coverage:** fixed whole-page scene (Task 2), hero content as first section (Task 2), content wrapped `relative z-10` (Task 1), camera driven by full-page scroll (Task 2), scrolled-past bails removed / `document.hidden` kept (Task 2), first three sections translucent (Task 3), MountainPass relocated + translucent (Tasks 1, 3), mount-gate + `dataset.hero3d` + no-WebGL fallback preserved (Task 2), performance tradeoff documented (Task 4).
- **Placeholder scan:** every code step contains full exact code; no TBD/TODO.
- **Type consistency:** `ValleyScene()` and `ValleyHero()` both take no props everywhere; `Rig({ progressRef, staticView })` matches its call site; `SnowDrift({ count, height })` matches its call site; no remaining `sectionRef` references in scene files; `CAMERA_PATH` unchanged.

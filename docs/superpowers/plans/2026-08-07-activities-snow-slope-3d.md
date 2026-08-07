# Activities page fixed snow-slope 3D backdrop — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/activities` the same WebGL treatment as the homepage valley flythrough: a fixed whole-page snow-slope scene with a stylized skier carving down the run, behind all content.

**Architecture:** Mirror the shipped `ValleyScene`/`ValleyHero` pair, untouched. New `ski.ts` geometry helpers + `SkiScene.tsx` (the R3F scene: slope, pines, skier, powder, snow drift, camera rig) + `SkiHero.tsx` (fixed `z-0` backdrop host with mount-gate and gradient fallback). `ActivitiesPageClient.tsx` drops its photo hero, renders `<SkiHero />` first, and wraps all content after it in `relative z-10`.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · three / @react-three/fiber (already installed) · no new dependencies.

## Global Constraints

- No new npm dependencies; no external model/skeleton assets for the skier (primitives only).
- Do NOT modify the homepage valley feature files: `ValleyScene.tsx`, `ValleyHero.tsx`, `terrain.ts` (the plan only *imports* `simplex2` from `terrain.ts`).
- ESLint convention: targeted `eslint-disable-next-line react-hooks/<rule> -- <reason>` / block `eslint-disable react-hooks/purity` comments only, never whole-file disables. eslint output must be pristine (0 errors AND 0 warnings).
- `// ponytail:` comments mark deliberate simplifications (keep them).
- All npm commands run from `adventure-travel/` (workdir); git commands from repo root. Windows PowerShell — `&&` does not work; chain with `;` or `if ($?) {}`.
- No test framework in this repo. Verify with `npm run build`, `npx tsc --noEmit`, and `npx eslint <files>`.
- Palette (bright alpine day): fog/background `#dff0ff`, slope white→pale-blue vertex gradient (`#f8fbff` → `#cfe3f5`), pines `#224f3d`, skier jacket amber `#f59e0b`, helmet sky `#0ea5e9`, skis `#1f2b45`.
- Scroll drive identical to the valley: `progressRef.current = clamp(scrollY / (scrollHeight - innerHeight), 0, 1)` in a passive scroll listener.
- Reduced-motion `staticView` freeze, `document.hidden` frame-loop guard, and `dpr [1, 1.75]` all required (same as the valley).

---

### Task 1: Ski slope geometry helpers

**Files:**
- Create: `adventure-travel/src/components/three/ski.ts`

**Interfaces:**
- Consumes: `simplex2(x: number, y: number): number` from `./terrain`.
- Produces:
  - `slopeHeight(x: number, z: number): number` — slope height at (x, z); ridge (~44) at `z = 180`, base (~1) at `z = -120`, with an S-shaped run groove.
  - `runCurve(): THREE.CatmullRomCurve3` — the skier's carve path from ridge `(z = 180)` to base `(z = -120)`, S-turning ±8 in x.
  - `buildSkiSlope(): THREE.Mesh` — vertex-colored descending plane spanning `x ∈ [-70, 70]`, `z ∈ [-120, 180]`.
  - `buildPines(count: number): THREE.InstancedMesh` — instanced cone pines on the flanks (run kept clear).

- [ ] **Step 1: Write `adventure-travel/src/components/three/ski.ts`**

```ts
import * as THREE from "three";
import { simplex2 } from "./terrain";

// ponytail: slope descends toward -z with an S-shaped run groove; pines clump on the flanks.

export function slopeHeight(x: number, z: number): number {
  const base = THREE.MathUtils.mapLinear(z, -120, 180, 1, 44);
  const noise = simplex2(x * 0.04, z * 0.04) * 3;
  const t = THREE.MathUtils.clamp((z + 120) / 300, 0, 1);
  const cx = Math.sin(t * Math.PI * 2.2) * 8;
  const groove = Math.max(0, 2.2 - Math.abs(x - cx)) * 1.6;
  return Math.max(0, base + noise - groove);
}

export function runCurve(): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const z = 180 - t * 300;
    const cx = Math.sin(t * Math.PI * 2.2) * 8;
    pts.push(new THREE.Vector3(cx, slopeHeight(cx, z) + 0.5, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

const COLORS = {
  snow: new THREE.Color("#f8fbff"),
  base: new THREE.Color("#cfe3f5"),
};

export function buildSkiSlope(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(140, 300, 70, 140);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, 30);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = slopeHeight(x, z);
    pos.setY(i, y);
    const t = Math.min(1, Math.max(0, y / 44));
    c.copy(COLORS.base).lerp(COLORS.snow, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
}

export function buildPines(count: number): THREE.InstancedMesh {
  const geo = new THREE.ConeGeometry(0.8, 3, 6);
  const mat = new THREE.MeshStandardMaterial({ color: "#224f3d", roughness: 1 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  let placed = 0;
  let guard = 0;
  while (placed < count && guard < count * 30) {
    guard++;
    const x = (Math.random() - 0.5) * 130;
    const z = -120 + Math.random() * 300;
    const y = slopeHeight(x, z);
    if (y < 1.5 || y > 32) continue;
    const t = (z + 120) / 300;
    const cx = Math.sin(t * Math.PI * 2.2) * 8;
    if (Math.abs(x - cx) < 9) continue; // keep the run clear
    if (simplex2(x * 0.08, z * 0.08) < 0.2) continue;
    dummy.position.set(x, y - 0.6, z);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    const s = 0.7 + Math.random() * 1.2;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    mesh.setMatrixAt(placed++, dummy.matrix);
  }
  mesh.count = placed;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}
```

- [ ] **Step 2: Verify typecheck + lint**

Run (workdir `adventure-travel/`): `npx tsc --noEmit` — expected exit 0.
Run: `npx eslint src/components/three/ski.ts` — expected 0 errors, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add adventure-travel/src/components/three/ski.ts
git commit -m "feat: ski slope geometry helpers for activities 3D scene"
```

---

### Task 2: WebGL ski scene with carving skier

**Files:**
- Create: `adventure-travel/src/components/three/SkiScene.tsx`

**Interfaces:**
- Consumes: `slopeHeight`, `runCurve`, `buildSkiSlope`, `buildPines` from `./ski`.
- Produces: `SkiScene()` — default export, **no props**. `RUN` module constant, `SKIER_STATIC_P = 0.35`.

- [ ] **Step 1: Write `adventure-travel/src/components/three/SkiScene.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildPines, buildSkiSlope, runCurve } from "./ski";

const RUN = runCurve();
const SKIER_STATIC_P = 0.35; // reduced-motion static vantage: mid-run

function Skier({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const parts = useMemo(() => {
    const g = new THREE.Group();
    const skiMat = new THREE.MeshStandardMaterial({ color: "#1f2b45", roughness: 0.6 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: "#f59e0b", roughness: 0.8 });
    const darkMat = new THREE.MeshStandardMaterial({ color: "#333a47", roughness: 0.9 });
    const helmetMat = new THREE.MeshStandardMaterial({ color: "#0ea5e9", roughness: 0.5 });
    for (const sx of [-0.42, 0.42]) {
      const ski = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 3.1), skiMat);
      ski.position.set(sx, 0.06, 0);
      g.add(ski);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.5, 0.55), darkMat);
      boot.position.set(sx, 0.45, 0.15);
      g.add(boot);
    }
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.1, 0.6), jacketMat);
    body.position.set(0, 1.15, -0.1);
    body.rotation.x = 0.25;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), helmetMat);
    head.position.set(0, 1.9, -0.25);
    g.add(head);
    for (const sx of [-0.55, 0.55]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), darkMat);
      pole.position.set(sx, 0.8, 0.5);
      pole.rotation.x = 0.7;
      g.add(pole);
    }
    return g;
  }, []);
  return <primitive object={parts} ref={groupRef} />;
}

// ponytail: local copy of ValleyScene's SnowDrift; not worth exporting/sharing for one more consumer
function SnowDrift({
  count,
  height,
  staticView,
}: {
  count: number;
  height: number;
  staticView: boolean;
}) {
  const points = useMemo(() => {
    /* eslint-disable react-hooks/purity -- procedural particle field samples Math.random during render (R3F pattern) */
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 44;
      pos[i * 3 + 2] = -120 + Math.random() * 300;
    }
    /* eslint-enable react-hooks/purity */
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: "white",
      size: 0.35,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }, [count]);

  useFrame((_, delta) => {
    if (document.hidden) return;
    if (staticView) return;
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

function Powder({
  skierRef,
  staticView,
}: {
  skierRef: React.RefObject<THREE.Group | null>;
  staticView: boolean;
}) {
  const COUNT = 50;
  const points = useMemo(() => {
    /* eslint-disable react-hooks/purity -- procedural particle field samples Math.random during render (R3F pattern) */
    const pos = new Float32Array(COUNT * 3);
    /* eslint-enable react-hooks/purity */
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: "white",
      size: 0.45,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }, []);

  // eslint-disable-next-line react-hooks/immutability -- R3F frame loop mutates the buffer attr imperatively
  useFrame(() => {
    if (document.hidden) return;
    if (staticView) return;
    const g = skierRef.current;
    if (!g) return;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      attr.setXYZ(
        i,
        g.position.x + (Math.random() - 0.5) * 1.8,
        g.position.y + 0.3 + Math.random() * 0.9,
        g.position.z + (Math.random() - 0.5) * 1.2,
      );
    }
    // eslint-disable-next-line react-hooks/immutability -- buffer attr mutated in the R3F frame loop
    attr.needsUpdate = true;
  });
  return <primitive object={points} />;
}

function Rig({
  progressRef,
  staticView,
  skierRef,
}: {
  progressRef: React.MutableRefObject<number>;
  staticView: boolean;
  skierRef: React.RefObject<THREE.Group | null>;
}) {
  const camera = useThree((s) => s.camera);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // eslint-disable-next-line react-hooks/immutability -- R3F frame loop drives camera + skier imperatively by design
  useFrame((state) => {
    if (document.hidden) return;
    const p = staticView ? SKIER_STATIC_P : progressRef.current;
    const runPoint = RUN.getPoint(p);
    const tangent = RUN.getTangent(p);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    const sway = staticView ? 0 : Math.sin(state.clock.elapsedTime * 1.6 + p * 6) * 1.6;
    const skier = skierRef.current;
    if (skier) {
      skier.position.copy(runPoint).addScaledVector(side, sway);
      skier.rotation.y = Math.atan2(tangent.x, tangent.z);
      skier.rotation.z = staticView ? 0 : -sway * 0.22;
    }

    const camTarget = RUN.getPoint(Math.min(1, p + 0.02));
    camera.position.copy(camTarget).add(new THREE.Vector3(0, 7.5, 6));
    if (!staticView) {
      // eslint-disable-next-line react-hooks/immutability -- camera is a live THREE.Vector3, mutated per frame
      camera.position.x += mouse.current.x * 1.2;
      camera.position.y += mouse.current.y * 0.8;
    }
    camera.lookAt(skier ? skier.position : runPoint);
  });
  return null;
}

export default function SkiScene() {
  const progressRef = useRef(0);
  const skierRef = useRef<THREE.Group>(null);
  const [staticView, setStaticView] = useState(false);
  const slope = useMemo(() => buildSkiSlope(), []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const pineCount = isMobile ? 700 : 1100;
  const snowCount = isMobile ? 150 : 300;
  const pines = useMemo(() => buildPines(pineCount), [pineCount]);

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
      camera={{ fov: 55, near: 0.1, far: 500, position: [0, 40, 170] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <color attach="background" args={["#dff0ff"]} />
      <fog attach="fog" args={["#dff0ff", 70, 340]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[30, 80, 50]} intensity={1.5} />
      <primitive object={slope} />
      <primitive object={pines} />
      <Skier groupRef={skierRef} />
      <SnowDrift count={snowCount} height={40} staticView={staticView} />
      <Powder skierRef={skierRef} staticView={staticView} />
      <Rig progressRef={progressRef} staticView={staticView} skierRef={skierRef} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Verify typecheck + lint + build**

Run (workdir `adventure-travel/`): `npx tsc --noEmit` — expected exit 0.
Run: `npx eslint src/components/three/SkiScene.tsx` — expected 0 errors, 0 warnings.

If a NEW `react-hooks/immutability` violation appears on a specific line that the provided code doesn't already guard, add exactly one targeted `// eslint-disable-next-line react-hooks/immutability -- <one-line reason>` for that line (matching the repo's existing pattern). Never disable a whole file or a whole block you don't need.

Run: `npm run build` — expected success.

- [ ] **Step 3: Commit**

```bash
git add adventure-travel/src/components/three/SkiScene.tsx
git commit -m "feat: WebGL ski scene with carving skier for activities page"
```

---

### Task 3: SkiHero fixed backdrop with gradient fallback

**Files:**
- Create: `adventure-travel/src/components/SkiHero.tsx`

**Interfaces:**
- Consumes: `isWebGLAvailable` from `@/lib/webgl`, `dynamic` from `next/dynamic`, `SkiScene` default export.
- Produces: `SkiHero()` — default export, **no props**. Sets `document.documentElement.dataset.snow3d = "true"` when the scene mounts. Renders the fixed `z-0` scene container (WebGL only) plus the first `min-h-screen` hero section with the "Activities" title.

- [ ] **Step 1: Write `adventure-travel/src/components/SkiHero.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isWebGLAvailable } from "@/lib/webgl";

const SkiScene = dynamic(() => import("./three/SkiScene"), { ssr: false });

export default function SkiHero() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    // ponytail: mount-gate so SSR and first client render both output the fallback, avoiding a hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-gate after hydration is the intended post-SSR capability check
    if (isWebGLAvailable()) setWebgl(true);
  }, []);

  useEffect(() => {
    if (!webgl) return;
    document.documentElement.dataset.snow3d = "true";
    return () => {
      delete document.documentElement.dataset.snow3d;
    };
  }, [webgl]);

  return (
    <>
      {webgl && (
        <div className="fixed inset-0 z-0" aria-hidden>
          <SkiScene />
        </div>
      )}

      {/* Hero headline over the live slope (gradient band when WebGL is unavailable) */}
      <section
        className={`relative z-10 flex min-h-screen items-center ${
          webgl ? "" : "bg-gradient-to-b from-sky-200 via-sky-100 to-white"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="text-center px-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Choose Your Adventure
            </p>
            <h1 className="mb-6 text-5xl md:text-7xl font-heading font-bold text-foreground">
              Activities
            </h1>
            <p className="max-w-2xl text-lg text-muted">
              From Himalayan treks to snow-covered slopes, riverside camps to tandem flights — find your perfect adventure in the Indian Himalayas.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify typecheck + lint + build**

Run (workdir `adventure-travel/`): `npx tsc --noEmit` — expected exit 0.
Run: `npx eslint src/components/SkiHero.tsx` — expected 0 errors, 0 warnings.
Run: `npm run build` — expected success.

- [ ] **Step 3: Commit**

```bash
git add adventure-travel/src/components/SkiHero.tsx
git commit -m "feat: SkiHero fixed backdrop with gradient fallback"
```

---

### Task 4: Integrate into the activities page

**Files:**
- Modify: `adventure-travel/src/app/activities/ActivitiesPageClient.tsx`

**Interfaces:**
- Consumes: `SkiHero` default export from `@/components/SkiHero`.
- Produces: `/activities` renders `<SkiHero />` as the first section; all other content after it sits in `<div className="relative z-10">`; the page root is transparent; the `#skiing` feature banner background is translucent.

- [ ] **Step 1: Import SkiHero**

Add to the imports (keep alphabetical order with the existing `@/components` imports):

```tsx
import SkiHero from "@/components/SkiHero";
```

- [ ] **Step 2: Replace the photo hero banner with SkiHero and open the z-10 wrapper**

Change the page root element:

```tsx
<div className="min-h-screen bg-white dark:bg-background">
```

to:

```tsx
<div className="relative min-h-screen overflow-x-hidden">
```

Replace the entire photo hero banner block (the `<section className="relative h-[50vh] min-h-[400px] overflow-hidden">...</section>` that ends right before the `{/* Skiing & Snowboarding feature banner */}` comment) with:

```tsx
      <SkiHero />

      <div className="relative z-10">
```

So the JSX order becomes: root div → `<SkiHero />` → `<div className="relative z-10">` → `{/* Skiing & Snowboarding feature banner */}` section → ... (all other sections unchanged, NOT re-indented — JSX does not require indentation; keep the existing content byte-identical).

- [ ] **Step 3: Close the z-10 wrapper before the modal**

Change the tail of the JSX from:

```tsx
      <SkiingCourseModal open={showCourse} onClose={() => setShowCourse(false)} />
    </div>
```

to:

```tsx
      </div>

      <SkiingCourseModal open={showCourse} onClose={() => setShowCourse(false)} />
    </div>
```

- [ ] **Step 4: Make the skiing feature banner translucent**

Change:

```tsx
<section id="skiing" className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100">
```

to:

```tsx
<section id="skiing" className="relative overflow-hidden bg-gradient-to-br from-sky-50/60 via-blue-50/50 to-sky-100/60 backdrop-blur-md">
```

Leave everything else in `ActivitiesPageClient.tsx` untouched: the dark ILP section and the final gradient CTA stay solid; "What Adventure Calls You?" (`py-20`, transparent) and "Why Adventure With Us?" (`bg-accent/5`) stay as they are; the Skills Academy cards, video embeds, activity cards, and the course modal unchanged.

- [ ] **Step 5: Verify typecheck + lint + build**

Run (workdir `adventure-travel/`): `npx tsc --noEmit` — expected exit 0.
Run: `npx eslint src/app/activities/ActivitiesPageClient.tsx` — expected 0 errors, 0 warnings.
Run: `npm run build` — expected success.

- [ ] **Step 6: Commit**

```bash
git add adventure-travel/src/app/activities/ActivitiesPageClient.tsx
git commit -m "feat: use 3D ski scene as activities page hero and backdrop"
```

---

### Task 5: Final verification

**Files:**
- None (verification only).

- [ ] **Step 1: Full build + lint**

Run (workdir `adventure-travel/`): `npm run build` — expected success.
Run: `npx eslint src/components/three/ski.ts src/components/three/SkiScene.tsx src/components/SkiHero.tsx src/app/activities/ActivitiesPageClient.tsx` — expected clean (0 errors, 0 warnings).

- [ ] **Step 2: Playwright — desktop, `/activities#skiing`**

Dev server at `http://localhost:3000` (or `npm run dev`). Playwright:
- Navigate to `http://localhost:3000/activities#skiing`; wait ~2s.
- Assert `document.querySelectorAll("canvas").length === 1` (SkiScene only — this page has no DOM-snow overlay).
- Assert `document.documentElement.dataset.snow3d === "true"`.
- Assert H1 "Activities" visible.
- Scroll the full page via `page.mouse.wheel` (increments of ~1200px, ~600ms between), collecting console errors — expect zero.
- Assert the page height is > 5 viewports.

- [ ] **Step 3: Playwright — scene changes across the page**

Take two screenshots of the (single) `canvas` element near the top and near the bottom of the page; assert their bytes differ (camera followed the skier down the run). Note: this page has no Lenis, so `window.scrollTo` works for positioning — but keep using `page.mouse.wheel` for the full scroll-through so the scroll listener fires naturally.

- [ ] **Step 4: Playwright — mobile + reduced motion + fallback**

Mobile:
```js
async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/activities', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  return {
    canvasCount: await page.locator('canvas').count(),
    scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
  };
}
```
Expected: `canvasCount === 1`, `scrollWidth <= 390`, zero console errors.

Reduced motion: `emulateMedia({ reducedMotion: 'reduce' })`, reload `/activities` — expected: 1 canvas (static frame), `snow3d === "true"`, zero console errors.

WebGL-unavailable fallback (new context with `getContext` overridden to return null for `webgl`, `webgl2`, AND `experimental-webgl`):
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
  await p2.goto('http://localhost:3000/activities', { waitUntil: 'load' });
  await p2.waitForTimeout(2000);
  const out = await p2.evaluate(() => ({
    snow3d: document.documentElement.dataset.snow3d ?? null,
    noFixedScene: Array.from(document.querySelectorAll('.fixed.inset-0')).filter(el => el.querySelector('canvas')).length === 0,
    gradientHero: !!document.querySelector('section.bg-gradient-to-b.from-sky-200'),
    h1: document.querySelector('h1')?.textContent ?? null,
    canvasCount: document.querySelectorAll('canvas').length,
  }));
  await ctx.close();
  return out;
}
```
Expected: `snow3d: null`, `noFixedScene: true`, `gradientHero: true`, H1 present, `canvasCount === 0`, zero console errors.

- [ ] **Step 5: Report**

Summarize in a report: what shipped, fallback behavior, performance notes (scene renders behind the whole page — deliberate tradeoff; only the skiing banner uses `backdrop-blur`), and any deferred issues. No commit in this task.

---

## Self-Review

- **Spec coverage:** fixed whole-page backdrop (Tasks 1-4) · stylized skier (Task 2 `Skier`) · scroll = descent + always-carving (Task 2 `Rig` sway) · bright alpine palette (Task 1 colors, Task 2 fog `#dff0ff`) · 3D scene as hero, photo banner removed (Task 3, Task 4) · gradient fallback + mount-gate + `dataset.snow3d` (Task 3) · translucent skiing banner, root transparent, ILP/CTA solid (Task 4) · mobile counts + reduced-motion static frame + `document.hidden` guards (Task 2) · verification incl. fallback (Task 5).
- **Placeholder scan:** every code step contains full exact code; no TBD/TODO.
- **Type consistency:** `SkiScene()` and `SkiHero()` both take no props; `slopeHeight(x, z)`, `runCurve()`, `buildSkiSlope()`, `buildPines(count)` match their call sites; `skierRef` is `React.RefObject<THREE.Group | null>` throughout; `simplex2` import from `./terrain` (never modified); `dataset.snow3d` (not `hero3d`) distinguishes this page's scene.

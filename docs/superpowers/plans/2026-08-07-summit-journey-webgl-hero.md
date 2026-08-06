# Summit Journey WebGL Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2D homepage hero with a full-screen procedural WebGL valley flythrough — scroll flies the camera up a winding Himalayan trail to the summit, handing off to the existing `MountainPass` section.

**Architecture:** A `ValleyHero` section owns a 300vh scroll zone with a `sticky` full-screen `<Canvas>`. Inside the canvas, a procedural `terrain.ts` module builds the valley (noise-displaced plane, vertex-colored grass→rock→snow), a trail ribbon follows a spline up the valley, an `InstancedMesh` forest and a `Points` snow drift decorate the scene. A camera rig reads window scroll progress each frame and moves the camera along a `CatmullRomCurve3` path. `ValleyHero` overlays the existing hero content and falls back to `HeroSplit` when WebGL is unavailable.

**Tech Stack:** React 19 · Next.js 16 (App Router, "use client") · `three` · `@react-three/fiber@^9` · TypeScript strict · Tailwind v4 · Playwright MCP for verification.

## Global Constraints

- Run ALL npm commands from `adventure-travel/` (use the `workdir` param — never `cd`).
- **No test framework exists.** Verify with `npm run build` + `npx eslint <touched files>` + Playwright browser checks. Never claim success without running them.
- React 19.2.4 requires `@react-three/fiber@^9` (v8 is React 18-only).
- **Do NOT install `@react-three/drei`.** Everything needed (InstancedMesh, Points, CatmullRomCurve3, `THREE.MathUtils.simplex2` noise) comes from `three` + `@react-three/fiber` directly. drei is heavy and unused here (ponytail).
- All scene content is **procedural** — zero downloaded models, textures, or images. No new files in `public/`.
- Respect `prefers-reduced-motion` (via `window.matchMedia`) — reduced-motion users get a static scenic frame; content still scrolls.
- Existing lint errors in `src/app/dashboard/page.tsx` and `src/app/SkiingCourseModal.tsx` are pre-existing — do not touch them.
- Windows PowerShell: `&&` does not work; chain with `;` + `if ($?)` or use separate tool calls.
- Use the codebase path alias `@/*` → `src/*`. All new components are `"use client"`.
- Heavy client libs are imported via `next/dynamic` with `{ ssr: false }` (matching the existing `SeasonalExplorer` pattern in `page.tsx`).

---

### Task 1: Install 3D dependencies

**Files:**
- Modify: `adventure-travel/package.json` (via npm)

**Interfaces:**
- Produces: `three`, `@react-three/fiber@^9`, `@types/three` in `package.json`.

- [ ] **Step 1: Install packages**

Run (workdir `adventure-travel`):
```powershell
npm install three @react-three/fiber@^9 @types/three
```

- [ ] **Step 2: Verify versions**

Run: `npm ls three @react-three/fiber`
Expected: `three@^0.1xx` and `@react-three/fiber@^9.x`, no `invalid`/`UNMET`.

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: `✓ Compiled successfully` and all 33 routes generated.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add three and react-three-fiber for WebGL hero"
```

---

### Task 2: WebGL detection helper

**Files:**
- Create: `adventure-travel/src/lib/webgl.ts`

**Interfaces:**
- Produces: `isWebGLAvailable(): boolean` — used by `ValleyHero` (Task 7) to choose canvas vs `HeroSplit` fallback.

- [ ] **Step 1: Create the helper**

```ts
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined" || typeof WebGLRenderingContext === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Verify it builds and lints**

Run: `npx eslint src/lib/webgl.ts`
Expected: no output (clean).

Run: `npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add src/lib/webgl.ts
git commit -m "feat: add WebGL availability helper"
```

---

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

### Task 4: Procedural terrain + trail module

Pure three.js geometry builders — no React, no R3F. Uses `THREE.MathUtils.simplex2` for noise (bundled with three, no extra dep).

**Files:**
- Create: `adventure-travel/src/components/three/terrain.ts`

**Interfaces:**
- Produces:
  - `heightAt(x: number, z: number): number` — world height of the valley surface
  - `trailCurve(): THREE.CatmullRomCurve3` — the trail spline up the valley (also used for camera path reference)
  - `buildTerrain(): THREE.Mesh` — vertex-colored plane (valley floor → rock → snowcap)
  - `buildTrail(): THREE.Mesh` — light ribbon strip along `trailCurve()`
- Consumes: `three` only.

- [ ] **Step 1: Create `terrain.ts`**

```ts
import * as THREE from "three";

export function heightAt(x: number, z: number): number {
  const ridge = Math.min(1, Math.abs(x) / 60); // 0 at valley center → 1 at flanks
  const noise = THREE.MathUtils.simplex2(x * 0.025, z * 0.025) * 6;
  const detail = THREE.MathUtils.simplex2(x * 0.12, z * 0.12) * 1.5;
  return Math.max(0, ridge * ridge * 20 + noise + detail);
}

const COLORS = {
  grass: new THREE.Color("#3e8e5a"),
  rock: new THREE.Color("#8a7a66"),
  snow: new THREE.Color("#f4f8ff"),
  trail: new THREE.Color("#d8c49a"),
};

export function trailCurve(): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const z = -170 + t * 340;
    const x = Math.sin(t * Math.PI * 2.5) * 5;
    pts.push(new THREE.Vector3(x, heightAt(x, z) + 0.3, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

export function buildTerrain(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(200, 400, 100, 200);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = heightAt(x, z);
    pos.setY(i, y);
    const t = Math.min(1, Math.max(0, y / 20));
    c.copy(COLORS.grass).lerp(COLORS.rock, Math.max(0, (t - 0.2) / 0.4));
    c.lerp(COLORS.snow, Math.max(0, (t - 0.7) / 0.3));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
}

export function buildTrail(): THREE.Mesh {
  const pts = trailCurve().getPoints(200);
  const w = 1.2;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const tangent =
      i > 0 && i < pts.length - 1
        ? new THREE.Vector3().subVectors(pts[i + 1], pts[i - 1]).normalize()
        : new THREE.Vector3(0, 0, 1);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const p0 = pts[i].clone().addScaledVector(side, w);
    const p1 = pts[i].clone().addScaledVector(side, -w);
    pos.push(p0.x, p0.y + 0.05, p0.z, p1.x, p1.y + 0.05, p1.z);
    if (i < pts.length - 1) {
      const a = i * 2;
      idx.push(a, a + 2, a + 3, a, a + 3, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: COLORS.trail, roughness: 1 }));
}
```

- [ ] **Step 2: Verify it builds and lints**

Run: `npx eslint src/components/three/terrain.ts` — expected clean.
Run: `npm run build` — expected to pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/terrain.ts
git commit -m "feat: procedural valley terrain and trail geometry"
```

---

### Task 5: `ValleyScene` — canvas, decorations, camera rig, scroll drive

The full R3F scene. Builds geometry imperatively (via `primitive`) to stay version-proof against R3F's JSX attachment API changes. Camera is driven by window scroll progress (matches the existing `ElevationGauge`/`ScrollProgress` pattern — window scroll events fire under Lenis).

**Files:**
- Create: `adventure-travel/src/components/three/ValleyScene.tsx`

**Interfaces:**
- Consumes: `heightAt`, `trailCurve`, `buildTerrain`, `buildTrail` from `./terrain`
- Consumes (prop): `sectionRef: React.RefObject<HTMLElement | null>` — the 300vh hero section, used to compute scroll progress and skip work when scrolled past.
- Produces: `ValleyScene({ sectionRef })` — renders the full-screen `<Canvas>`.

- [ ] **Step 1: Create `ValleyScene.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildTerrain, buildTrail, heightAt } from "./terrain";

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
  sectionRef,
  progressRef,
  staticView,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
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

  useFrame(() => {
    if (document.hidden) return;
    const sec = sectionRef.current;
    if (sec && sec.getBoundingClientRect().top > window.innerHeight) return; // scrolled past

    const p = staticView ? 0 : progressRef.current;
    camera.position.copy(CAMERA_PATH.getPoint(p));
    look.current.copy(CAMERA_PATH.getPoint(Math.min(1, p + 0.06)));
    if (!staticView) {
      camera.position.x += mouse.current.x * 1.5;
      camera.position.y += mouse.current.y * 1.0;
    }
    camera.lookAt(look.current);
  });
  return null;
}

function Forest({ count }: { count: number }) {
  const inst = useMemo(() => {
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
      if (THREE.MathUtils.simplex2(x * 0.05, z * 0.05) < 0.1) continue;
      dummy.position.set(x, y, z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.6 + Math.random() * 1.1;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(placed++, dummy.matrix);
    }
    mesh.count = placed;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return mesh;
  }, [count]);
  return <primitive object={inst} />;
}

function SnowDrift({ count, height }: { count: number; height: number }) {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
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

  useFrame((_, delta) => {
    if (document.hidden) return;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) - delta * 3;
      if (y < -2) y = height + 2;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });
  return <primitive object={points} />;
}

export default function ValleyScene({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const progressRef = useRef(0);
  const [staticView, setStaticView] = useState(false);
  const terrain = useMemo(() => buildTerrain(), []);
  const trail = useMemo(() => buildTrail(), []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const forestCount = isMobile ? 1000 : 1500;
  const snowCount = isMobile ? 400 : 800;

  useEffect(() => {
    setStaticView(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const onScroll = () => {
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progressRef.current = total > 0 ? THREE.MathUtils.clamp(-r.top / total, 0, 1) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionRef]);

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
      <Rig sectionRef={sectionRef} progressRef={progressRef} staticView={staticView} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Verify it builds and lints**

Run: `npx eslint src/components/three/ValleyScene.tsx` — expected clean.
Run: `npm run build` — expected to pass. (Canvas renders only once wired in Task 7.)

- [ ] **Step 3: Commit**

```bash
git add src/components/three/ValleyScene.tsx
git commit -m "feat: WebGL valley scene with camera rig and scroll drive"
```

---

### Task 6: Pause DOM snow while the 3D hero is active

The DOM `SnowParticles` canvas sits above the WebGL canvas (z-55 vs z-0). While the hero flythrough is on screen we get double snow and wasted CPU — pause the DOM canvas via a document flag set by `ValleyHero`.

**Files:**
- Modify: `adventure-travel/src/components/SnowParticles.tsx`

**Interfaces:**
- Consumes: `document.documentElement.dataset.hero3d === "true"` (set/removed by `ValleyHero`, Task 7).

- [ ] **Step 1: Skip drawing while hero is active**

In `SnowParticles.tsx`, inside the `draw` loop guard (alongside the `document.hidden` check at line ~55):

```tsx
    const draw = () => {
      if (document.hidden || document.documentElement.dataset.hero3d === "true") {
        animId = requestAnimationFrame(draw);
        return;
      }
      // ...existing drawing...
    };
```

- [ ] **Step 2: Verify**

Run: `npx eslint src/components/SnowParticles.tsx` — expected clean.
Run: `npm run build` — expected to pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/SnowParticles.tsx
git commit -m "perf: pause DOM snow during WebGL hero"
```

---

### Task 7: `ValleyHero` section shell — scroll zone, overlay, fallback, handoff

**Files:**
- Create: `adventure-travel/src/components/ValleyHero.tsx`

**Interfaces:**
- Consumes: `isWebGLAvailable` (Task 2), `HeroContent` with `variant="scene"` (Task 3), `ValleyScene` (Task 5, dynamic `ssr:false`), `HeroSplit` (fallback).
- Produces: `ValleyHero()` — default export, no props. Renders either the flythrough or the `HeroSplit` fallback.

- [ ] **Step 1: Create `ValleyHero.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import HeroSplit from "./HeroSplit";
import HeroContent from "./HeroContent";
import { isWebGLAvailable } from "@/lib/webgl";

const ValleyScene = dynamic(() => import("./three/ValleyScene"), { ssr: false });

const SCROLL_HEIGHT = "300vh";

export default function ValleyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [webgl] = useState(isWebGLAvailable);

  useEffect(() => {
    document.documentElement.dataset.hero3d = "true";
    return () => {
      delete document.documentElement.dataset.hero3d;
    };
  }, []);

  useEffect(() => {
    const sec = sectionRef.current;
    const fade = fadeRef.current;
    if (!sec || !fade) return;
    const onScroll = () => {
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      const opacity = Math.min(1, Math.max(0, (p - 0.85) / 0.15));
      fade.style.opacity = String(opacity);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!webgl) return <HeroSplit />;

  return (
    <section ref={sectionRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <ValleyScene sectionRef={sectionRef} />

        {/* Handoff fade — blends the canvas into the MountainPass section below */}
        <div
          ref={fadeRef}
          className="pointer-events-none absolute inset-0 z-20 bg-background"
          style={{ opacity: 0 }}
        />

        {/* Overlay content */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <HeroContent variant="scene" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

> Notes:
> - The `bg-background` fade overlay starts `opacity: 0` and ends `opacity: 1` as scroll progress crosses 85–100% of the hero zone, so the scene dissolves into the `MountainPass` section.
> - `dataset.hero3d` pauses the DOM snow (Task 6) for the whole time the hero is mounted.
> - The Navbar renders above the canvas (check z-index — Navbar should be `z-[70]` or higher; verify visually in Step 2).

- [ ] **Step 2: Verify with Playwright**

Run: `npm run build` then `npm start` (or use the running `next dev` on `http://localhost:3000`).

Playwright:
- Navigate to `http://localhost:3000`.
- Evaluate: `document.querySelectorAll("canvas").length` → expect ≥ 1 (the WebGL canvas).
- Check console: zero errors.
- `window.scrollTo(0, document.body.scrollHeight * 0.1)` then evaluate that the canvas exists and the page still scrolls; check console has no errors after scroll.
- Take a viewport screenshot to confirm the scene + overlay render and the Navbar stays on top.

- [ ] **Step 3: Commit**

```bash
git add src/components/ValleyHero.tsx
git commit -m "feat: WebGL valley hero with overlay and HeroSplit fallback"
```

---

### Task 8: Swap `HeroSplit` for `ValleyHero` on the homepage

**Files:**
- Modify: `adventure-travel/src/app/page.tsx`

**Interfaces:**
- Consumes: `ValleyHero` from `@/components/ValleyHero`.

- [ ] **Step 1: Swap the import and usage**

In `page.tsx`:
- Replace `import HeroSplit from "@/components/HeroSplit";` with `import ValleyHero from "@/components/ValleyHero";`
- Replace `<HeroSplit />` (line 78) with `<ValleyHero />`.

Keep everything else (SnowParticles, ElevationGauge, MountainPass, ScrollDepth wrappers) as-is.

- [ ] **Step 2: Verify build + lint**

Run: `npm run build` — expected to pass.
Run: `npx eslint src/app/page.tsx` — expected clean (ignore pre-existing dashboard/SkiingCourseModal errors if running full lint).

- [ ] **Step 3: Playwright end-to-end check (desktop)**

- Navigate to `http://localhost:3000`, wait for load.
- Verify `canvas` present, H1 "Surreal Summits" visible over the scene, zero console errors.
- Scroll in increments (0 → 25% → 50% → 75% of page height); after each, confirm no console errors and the page height is stable (~5+ screens).
- Confirm the `ElevationGauge` desktop gauge is still visible on the right edge.

- [ ] **Step 4: Playwright check (mobile + reduced motion + fallback)**

Use `playwright_browser_run_code_unsafe` for these:

Mobile:
```js
async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  return {
    canvasCount: await page.locator('canvas').count(),
    errors: 0,
  };
}
```
Expected: canvas present, no console errors, no horizontal overflow (`document.documentElement.scrollWidth <= 390`).

Reduced motion:
```js
async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  return { canvasCount: await page.locator('canvas').count() };
}
```
Expected: canvas present (static frame), no crash.

WebGL-unavailable fallback (simulate):
```js
async (page) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (String(type).toLowerCase().includes('webgl')) return null;
      return orig.call(this, type, ...args);
    };
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  return {
    canvasCount: await page.locator('canvas').count(),
    hasSplitImage: await page.locator('img[src*="images.unsplash.com"]').first().isVisible(),
  };
}
```
Expected: no WebGL canvas, and the `HeroSplit` fallback image is visible.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: use WebGL valley hero on homepage"
```

---

### Task 9: Final verification + performance sanity

**Files:**
- None (verification only).

- [ ] **Step 1: Full build + lint**

Run: `npm run build` (workdir `adventure-travel`) — expect success, 33 routes.
Run: `npx eslint src/components/three/ValleyScene.tsx src/components/three/terrain.ts src/components/ValleyHero.tsx src/components/HeroContent.tsx src/components/HeroSplit.tsx src/components/SnowParticles.tsx src/app/page.tsx` — expect clean.

- [ ] **Step 2: Console + frame sanity**

Playwright: reload `http://localhost:3000`, scroll from top to bottom slowly; collect console messages (filter level `error`) — expect zero. Capture `window.performance` memory/timeToInteractive if available; confirm snow particles paused (`document.documentElement.dataset.hero3d === "true"`).

- [ ] **Step 3: Report**

Summarize: what shipped, the fallback behavior, and the deliberate simplification (drei skipped — add it only if a future feature needs its helpers). No commit in this task.

---

## Self-Review (done by plan author)

- **Spec coverage:** 300vh scroll zone ✓ (Task 7), procedural terrain ✓ (4), trail ✓ (4), forest + snow ✓ (5), camera path + scroll drive ✓ (5 Rig), mouse parallax ✓ (5), reduced-motion static frame ✓ (5 `staticView`), mobile counts ✓ (5), dpr clamp ✓ (5), render pause on hidden/scrolled-past ✓ (5), DOM snow pause ✓ (6), fade handoff to MountainPass ✓ (7), WebGL fallback → HeroSplit ✓ (7), overlay hero content ✓ (7 via HeroContent), page.tsx swap ✓ (8), Playwright verification desktop/mobile/reduced-motion/fallback ✓ (8-9).
- **Placeholder scan:** No TBD/TODO. All code blocks complete.
- **Type consistency:** `sectionRef` is `React.RefObject<HTMLElement | null>` everywhere it is passed (Task 5 prop, Task 7 `<section ref>`); `progressRef` is `React.MutableRefObject<number>`; `ValleyScene({ sectionRef })` matches `dynamic` import usage; `HeroContent({ variant })` matches both callers.

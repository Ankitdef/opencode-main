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

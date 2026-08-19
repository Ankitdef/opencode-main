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

// ── Device quality tiers ──────────────────────────────────────────────
// Scale object counts + pixel ratio to the hardware so weaker laptops/phones
// stay smooth while capable machines get the full scene.
type Tier = "low" | "mid" | "high";

type TierConfig = {
  forest: number;
  clouds: number;
  caps: boolean;
  dpr: [number, number];
};

const TIERS: Record<Tier, TierConfig> = {
  low: { forest: 800, clouds: 6, caps: false, dpr: [1, 1.25] },
  mid: { forest: 1400, clouds: 9, caps: true, dpr: [1, 1.5] },
  high: { forest: 2200, clouds: 12, caps: true, dpr: [1, 2] },
};

function detectTier(): Tier {
  if (typeof navigator === "undefined") return "mid";
  const mobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory is non-standard but widely supported on Chrome/Android
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (mobile || cores <= 4 || mem <= 4) return "low";
  if (cores <= 8 || mem <= 8) return "mid";
  return "high";
}

// ── Builders (kept outside render so procedural Math.random stays pure to
//    the component and the results can be mutated via refs in the frame loop) ─

function buildForest(count: number, withCaps: boolean): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.ConeGeometry(0.72, 3.6, 7);
  // white base material so per-instance colours carry the true tint (frost + green variation)
  const mat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1 });
  const trees = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  const capMatrices: THREE.Matrix4[] = [];
  let placed = 0;
  let guard = 0;
  while (placed < count && guard < count * 20) {
    guard++;
    const x = (Math.random() - 0.5) * 160;
    const z = (Math.random() - 0.5) * 340;
    const y = heightAt(x, z);
    if (y < 1.5 || y > 14) continue;          // only mid flanks
    if (Math.abs(x) < 6) continue;            // keep the valley/trail clear
    if (simplex2(x * 0.05, z * 0.05) < 0.1) continue;
    const s = 0.6 + Math.random() * 1.2;
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    trees.setMatrixAt(placed, dummy.matrix);

    // deep desaturated green low down, frosted paler as altitude climbs
    const frost = THREE.MathUtils.clamp((y - 7) / 7, 0, 1);
    col.setHSL(
      0.31 + (Math.random() - 0.5) * 0.04,
      0.42 - frost * 0.22,
      0.16 + Math.random() * 0.07 + frost * 0.22,
    );
    trees.setColorAt(placed, col);

    // white snow cap on taller / higher trees
    if (withCaps && (y > 8 || s > 1.35) && Math.random() < 0.6) {
      dummy.position.set(x, y + 3.2 * s * 0.34, z);
      dummy.updateMatrix();
      capMatrices.push(dummy.matrix.clone());
    }
    placed++;
  }
  trees.count = placed;
  trees.instanceMatrix.needsUpdate = true;
  if (trees.instanceColor) trees.instanceColor.needsUpdate = true;
  trees.frustumCulled = false;
  g.add(trees);

  if (capMatrices.length) {
    const capGeo = new THREE.ConeGeometry(0.5, 1.1, 7);
    const capMat = new THREE.MeshStandardMaterial({ color: "#eef4ff", roughness: 0.85 });
    const caps = new THREE.InstancedMesh(capGeo, capMat, capMatrices.length);
    capMatrices.forEach((m, i) => caps.setMatrixAt(i, m));
    caps.instanceMatrix.needsUpdate = true;
    caps.frustumCulled = false;
    g.add(caps);
  }
  return g;
}

function makeSoftCircleTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makeSkyTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#2b5f96"); // zenith deep blue
  g.addColorStop(0.45, "#6ea2cf"); // mid sky
  g.addColorStop(0.75, "#b9d3e8"); // haze
  g.addColorStop(1, "#e8f1f8"); // pale horizon
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CLOUD_SPAN = 220; // wrap width along x

function buildClouds(count: number): THREE.Group {
  const g = new THREE.Group();
  const tex = makeSoftCircleTexture();
  for (let i = 0; i < count; i++) {
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.42 + Math.random() * 0.2,
      depthWrite: false,
      fog: true,
    });
    const sprite = new THREE.Sprite(mat);
    const scale = 34 + Math.random() * 40;
    sprite.scale.set(scale, scale * (0.5 + Math.random() * 0.2), 1);
    sprite.position.set(
      (Math.random() - 0.5) * CLOUD_SPAN,
      34 + Math.random() * 42,
      (Math.random() - 0.5) * 360 - 20,
    );
    sprite.userData.speed = 1.4 + Math.random() * 2.6; // units/sec on the wind
    g.add(sprite);
  }
  return g;
}

// ── Components ─────────────────────────────────────────────────────────

// Natural vertical sky gradient (deep blue zenith → pale haze horizon).
function SkyGradient() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const tex = makeSkyTexture();
    // eslint-disable-next-line react-hooks/immutability -- scene is a live R3F object; assigning background is the intended side effect
    scene.background = tex;
    return () => {
      scene.background = null;
      tex.dispose();
    };
  }, [scene]);
  return null;
}

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

function Forest({ count, withCaps }: { count: number; withCaps: boolean }) {
  const group = useMemo(() => buildForest(count, withCaps), [count, withCaps]);
  return <primitive object={group} />;
}

function Clouds({ count, staticView }: { count: number; staticView: boolean }) {
  const group = useMemo(() => buildClouds(count), [count]);
  const ref = useRef<THREE.Group | null>(null);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || document.hidden || staticView) return;
    for (const sprite of g.children) {
      sprite.position.x += (sprite.userData.speed as number) * delta;
      if (sprite.position.x > CLOUD_SPAN / 2) sprite.position.x = -CLOUD_SPAN / 2;
    }
  });
  return <primitive ref={ref} object={group} />;
}

// Redraw on scroll/resize when the frame loop is paused (reduced motion).
function DemandInvalidator({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    const kick = () => invalidate();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("pointermove", kick, { passive: true });
    kick();
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("pointermove", kick);
    };
  }, [active, invalidate]);
  return null;
}

export default function ValleyScene() {
  const progressRef = useRef(0);
  const [staticView, setStaticView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tier] = useState<Tier>(detectTier);
  const cfg = TIERS[tier];
  const terrain = useMemo(() => buildTerrain(), []);
  const trail = useMemo(() => buildTrail(), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time reduced-motion probe, no deps to subscribe to
    setStaticView(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
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

  // Pause entirely when the tab is hidden; when nothing animates (reduced
  // motion) only redraw on demand instead of every frame.
  const frameloop: "always" | "demand" | "never" = hidden
    ? "never"
    : staticView
      ? "demand"
      : "always";

  return (
    <Canvas
      dpr={cfg.dpr}
      frameloop={frameloop}
      camera={{ fov: 55, near: 0.1, far: 500, position: [0, 4, 160] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <SkyGradient />
      <fog attach="fog" args={["#c6dbe9", 60, 320]} />
      <hemisphereLight args={["#d3e3f5", "#6b5f4d", 0.65]} />
      <directionalLight position={[35, 70, 45]} intensity={1.7} color="#fff1d6" />
      <directionalLight position={[-40, 30, -40]} intensity={0.35} color="#bcd6f2" />
      <primitive object={terrain} />
      <primitive object={trail} />
      <Forest count={cfg.forest} withCaps={cfg.caps} />
      <Clouds count={cfg.clouds} staticView={staticView} />
      <Rig progressRef={progressRef} staticView={staticView} />
      <DemandInvalidator active={frameloop === "demand"} />
    </Canvas>
  );
}

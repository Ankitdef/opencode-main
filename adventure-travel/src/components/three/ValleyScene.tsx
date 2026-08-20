"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildTerrain, buildTrail, heightAt, simplex2 } from "./terrain";
import { PEAKS3D, type Peak3D } from "@/lib/peaks";

// ── Journey camera path (p = page progress 0..1) ─────────────────────
// Phases: 0.00-0.16 hero entrance → 0.16-0.50 valley fly-through (trek cards
// emerge) → 0.50-0.68 aerial rise → 0.68-0.74 map hold (clickable peaks) →
// 0.74-0.86 descend → 0.86-1.00 farewell valley. Scroll progress is mapped
// onto these phases from real DOM anchors (#hero-anchor, #valley-map).
const CAMERA_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 4, 160), // 0.00 hero entrance
  new THREE.Vector3(0, 6, 138), // 0.05
  new THREE.Vector3(0, 9, 114), // 0.12
  new THREE.Vector3(0, 14, 88), // 0.20
  new THREE.Vector3(-2, 20, 58), // 0.28
  new THREE.Vector3(-4, 28, 24), // 0.38
  new THREE.Vector3(-7, 38, -18), // 0.47
  new THREE.Vector3(-10, 52, -62), // 0.53 rise
  new THREE.Vector3(-12, 74, -102), // 0.58
  new THREE.Vector3(-10, 104, -90), // 0.62
  new THREE.Vector3(0, 148, 34), // 0.66 MAP
  new THREE.Vector3(0, 150, 30), // 0.72 hold
  new THREE.Vector3(4, 96, 40), // 0.78 descend
  new THREE.Vector3(5, 56, 74), // 0.84
  new THREE.Vector3(3, 28, 106), // 0.90
  new THREE.Vector3(1, 12, 130), // 0.96
  new THREE.Vector3(0, 6, 148), // 1.00 farewell
]);

const LOOK_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 6, 140), // 0.00
  new THREE.Vector3(0, 8, 118),
  new THREE.Vector3(0, 14, 94),
  new THREE.Vector3(0, 22, 68),
  new THREE.Vector3(-1, 30, 40),
  new THREE.Vector3(-3, 38, 6),
  new THREE.Vector3(-6, 46, -36),
  new THREE.Vector3(-8, 62, -80),
  new THREE.Vector3(-8, 88, -110),
  new THREE.Vector3(0, 44, -42), // 0.62
  new THREE.Vector3(0, 26, -30), // 0.66 MAP look — the range
  new THREE.Vector3(0, 22, -28), // 0.72
  new THREE.Vector3(4, 30, 20), // 0.78
  new THREE.Vector3(4, 18, 54), // 0.84
  new THREE.Vector3(2, 12, 86), // 0.90
  new THREE.Vector3(1, 8, 110), // 0.96
  new THREE.Vector3(0, 5, 128), // 1.00
]);

// ── Device quality tiers ──────────────────────────────────────────────
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
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (mobile || cores <= 4 || mem <= 4) return "low";
  if (cores <= 8 || mem <= 8) return "mid";
  return "high";
}

// ── Builders ──────────────────────────────────────────────────────────

function buildForest(count: number, withCaps: boolean): THREE.Group {
  const g = new THREE.Group();
  const geo = new THREE.ConeGeometry(0.72, 3.6, 7);
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
    if (y < 1.5 || y > 14) continue;
    if (Math.abs(x) < 6) continue;
    if (simplex2(x * 0.05, z * 0.05) < 0.1) continue;
    const s = 0.6 + Math.random() * 1.2;
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    trees.setMatrixAt(placed, dummy.matrix);

    const frost = THREE.MathUtils.clamp((y - 7) / 7, 0, 1);
    col.setHSL(
      0.31 + (Math.random() - 0.5) * 0.04,
      0.42 - frost * 0.22,
      0.16 + Math.random() * 0.07 + frost * 0.22,
    );
    trees.setColorAt(placed, col);

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
  g.addColorStop(0, "#2b5f96");
  g.addColorStop(0.45, "#6ea2cf");
  g.addColorStop(0.75, "#b9d3e8");
  g.addColorStop(1, "#e8f1f8");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CLOUD_SPAN = 220;

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
    sprite.userData.speed = 1.4 + Math.random() * 2.6;
    sprite.userData.baseOpacity = mat.opacity;
    g.add(sprite);
  }
  return g;
}

// Glass chip label drawn to a canvas, used as a billboard sprite.
function makePeakLabel(peak: Peak3D): THREE.CanvasTexture {
  const W = 640;
  const H = 168;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const r = 28;
  ctx.beginPath();
  ctx.roundRect(8, 8, W - 16, H - 16, r);
  ctx.fillStyle = "rgba(8, 18, 34, 0.8)";
  ctx.fill();
  ctx.strokeStyle = peak.landmark ? "rgba(245, 158, 11, 0.6)" : "rgba(255,255,255,0.3)";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = peak.landmark ? "#F59E0B" : "#10B981";
  ctx.beginPath();
  ctx.arc(58, 62, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 44px Poppins, 'Segoe UI', sans-serif";
  ctx.fillText(peak.name, 88, 76);

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "500 38px Inter, 'Segoe UI', sans-serif";
  ctx.fillText(`${peak.alt.toLocaleString("en-IN")} m`, 88, 130);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ── Components ────────────────────────────────────────────────────────

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

type PhaseRef = MutableRefObject<{ map: number }>;

function Rig({
  progressRef,
  staticView,
  selected,
  phaseRef,
  onFlyingChange,
}: {
  progressRef: MutableRefObject<number>;
  staticView: boolean;
  selected: Peak3D | null;
  phaseRef: PhaseRef;
  onFlyingChange: (flying: boolean) => void;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const mouse = useRef({ x: 0, y: 0 });
  const look = useRef(new THREE.Vector3());
  const fly = useRef<{
    from: THREE.Vector3;
    to: THREE.Vector3;
    lookFrom: THREE.Vector3;
    lookTo: THREE.Vector3;
    t: number;
    dur: number;
  } | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Start a flight when a peak is selected; cancel when deselected.
  useEffect(() => {
    if (!selected) {
      fly.current = null;
      onFlyingChange(false);
      return;
    }
    const py = heightAt(selected.x, selected.z);
    fly.current = {
      from: camera.position.clone(),
      to: new THREE.Vector3(selected.x + 20, py + 18, selected.z + 20),
      lookFrom: look.current.clone(),
      lookTo: new THREE.Vector3(selected.x, py + 3, selected.z),
      t: 0,
      dur: staticView ? 0 : 2.6,
    };
    onFlyingChange(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- selection change is the only trigger
  }, [selected]);

  // ponytail: R3F frame loop drives the camera imperatively by design
  /* eslint-disable react-hooks/immutability -- R3F frame loop drives the camera imperatively by design */
  useFrame((_, delta) => {
    if (document.hidden) return;

    const f = fly.current;
    if (f) {
      f.t += delta / Math.max(0.001, f.dur);
      const e = THREE.MathUtils.smoothstep(f.t, 0, 1);
      camera.position.lerpVectors(f.from, f.to, e);
      look.current.lerpVectors(f.lookFrom, f.lookTo, e);
      camera.lookAt(look.current);
      if (f.t >= 1) {
        fly.current = null;
        onFlyingChange(false);
      }
      return;
    }

    const p = staticView ? 0 : progressRef.current;
    camera.position.copy(CAMERA_PATH.getPoint(p));
    look.current.copy(LOOK_PATH.getPoint(p));

    const mapAmt = phaseRef.current.map;
    if (!staticView && mapAmt < 0.5) {
      camera.position.x += mouse.current.x * 1.5;
      camera.position.y += mouse.current.y * 1.0;
    }
    camera.lookAt(look.current);

    const targetFov = THREE.MathUtils.lerp(55, 68, mapAmt);
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov += (targetFov - camera.fov) * Math.min(1, delta * 3);
      camera.updateProjectionMatrix();
    }
  });
  /* eslint-enable react-hooks/immutability */
  return null;
}

function PeakMarkers({ onSelect, phaseRef }: { onSelect: (peak: Peak3D | null) => void; phaseRef: PhaseRef }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const hovered = useRef<number | null>(null);

  const labels = useMemo(
    () =>
      PEAKS3D.map((p) => {
        const mat = new THREE.SpriteMaterial({
          map: makePeakLabel(p),
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        return { mat, y: heightAt(p.x, p.z) + 9 };
      }),
    [],
  );

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const show = THREE.MathUtils.smoothstep(phaseRef.current.map, 0.2, 0.6);
    for (let i = 0; i < g.children.length; i++) {
      const child = g.children[i];
      const spr = child.children[0] as THREE.Sprite;
      const hit = child.children[1] as THREE.Mesh;
      const mat = spr.material as THREE.SpriteMaterial;
      mat.opacity = show;
      const scale = (hovered.current === i ? 1.12 : 1) * (0.85 + show * 0.15);
      spr.scale.set(30 * scale, 8 * scale, 1);
      hit.visible = show > 0.05;
    }
    document.body.style.cursor = hovered.current !== null ? "pointer" : "";
  });

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <group ref={groupRef}>
      {PEAKS3D.map((peak, i) => {
        const y = labels[i].y;
        return (
          <group key={`${peak.slug}-${i}`} position={[peak.x, y, peak.z]}>
            <sprite
              ref={(s) => {
                if (s) s.raycast = () => {};
              }}
              material={labels[i].mat}
              renderOrder={10}
            />
            <mesh
              position={[0, 0, 0]}
              visible={false}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelect(peak);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                hovered.current = i;
              }}
              onPointerOut={() => {
                hovered.current = null;
              }}
            >
              <sphereGeometry args={[7, 10, 10]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Forest({ count, withCaps }: { count: number; withCaps: boolean }) {
  const group = useMemo(() => buildForest(count, withCaps), [count, withCaps]);
  return <primitive object={group} />;
}

function Clouds({ count, staticView, phaseRef }: { count: number; staticView: boolean; phaseRef: PhaseRef }) {
  const group = useMemo(() => buildClouds(count), [count]);
  const ref = useRef<THREE.Group | null>(null);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || document.hidden || staticView) return;
    const mapAmt = phaseRef.current.map;
    for (const sprite of g.children) {
      sprite.position.x += (sprite.userData.speed as number) * delta;
      if (sprite.position.x > CLOUD_SPAN / 2) sprite.position.x = -CLOUD_SPAN / 2;
      ((sprite as THREE.Sprite).material as THREE.SpriteMaterial).opacity =
        (sprite.userData.baseOpacity as number) * (1 - mapAmt * 0.85);
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

export type { Peak3D };

export default function ValleyScene({
  onPeakSelect,
}: {
  onPeakSelect?: (peak: Peak3D | null) => void;
}) {
  const progressRef = useRef(0);
  const phaseRef = useRef({ map: 0 });
  const [staticView, setStaticView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [selected, setSelected] = useState<Peak3D | null>(null);
  const [tier] = useState<Tier>(detectTier);
  const cfg = TIERS[tier];
  const terrain = useMemo(() => buildTerrain(), []);
  const trail = useMemo(() => buildTrail(), []);

  const select = (peak: Peak3D | null) => {
    setSelected(peak);
    onPeakSelect?.(peak);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time reduced-motion probe, no deps to subscribe to
    setStaticView(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Map page scroll onto journey phases using real DOM anchors so the camera
  // reaches the map view exactly when #valley-map is on screen.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const hero = document.getElementById("hero-anchor");
      const map = document.getElementById("valley-map");
      if (!hero || !map || total <= 0) {
        progressRef.current = total > 0 ? THREE.MathUtils.clamp(window.scrollY / total, 0, 1) : 0;
        phaseRef.current.map = 0;
        return;
      }
      const heroH = hero.offsetHeight;
      const mapTop = map.offsetTop;
      const mapBot = mapTop + map.offsetHeight;
      const s = window.scrollY;

      let p: number;
      if (s <= heroH) p = 0.16 * Math.min(1, s / Math.max(1, heroH));
      else if (s < mapTop) p = 0.16 + 0.34 * Math.min(1, (s - heroH) / Math.max(1, mapTop - heroH));
      else if (s < mapBot) p = 0.5 + 0.18 * ((s - mapTop) / Math.max(1, mapBot - mapTop));
      else p = 0.68 + 0.32 * Math.min(1, (s - mapBot) / Math.max(1, total - mapBot));

      progressRef.current = THREE.MathUtils.clamp(p, 0, 1);
      phaseRef.current.map =
        THREE.MathUtils.smoothstep(p, 0.54, 0.64) * (1 - THREE.MathUtils.smoothstep(p, 0.78, 0.86));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
      <Clouds count={cfg.clouds} staticView={staticView} phaseRef={phaseRef} />
      <PeakMarkers onSelect={select} phaseRef={phaseRef} />
      <Rig
        progressRef={progressRef}
        staticView={staticView}
        selected={selected}
        phaseRef={phaseRef}
        onFlyingChange={() => {}}
      />
      <DemandInvalidator active={frameloop === "demand"} />
    </Canvas>
  );
}
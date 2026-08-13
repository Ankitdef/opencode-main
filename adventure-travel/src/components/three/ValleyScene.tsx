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
// stay smooth while capable machines get the full, lively scene.
type Tier = "low" | "mid" | "high";

type TierConfig = {
  forest: number;
  snow: number;
  clouds: number;
  birds: number;
  caps: boolean;
  snowSize: number;
  dpr: [number, number];
};

const TIERS: Record<Tier, TierConfig> = {
  low: { forest: 800, snow: 350, clouds: 6, birds: 2, caps: false, snowSize: 6, dpr: [1, 1.25] },
  mid: { forest: 1400, snow: 700, clouds: 9, birds: 3, caps: true, snowSize: 7, dpr: [1, 1.5] },
  high: { forest: 2200, snow: 1100, clouds: 12, birds: 4, caps: true, snowSize: 7, dpr: [1, 2] },
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
  const geo = new THREE.ConeGeometry(0.9, 3.2, 6);
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

    // deep green low down, frosted paler green as altitude climbs
    const frost = THREE.MathUtils.clamp((y - 7) / 7, 0, 1);
    col.setHSL(
      0.33 + (Math.random() - 0.5) * 0.05,
      0.5 - frost * 0.28,
      0.26 + Math.random() * 0.08 + frost * 0.28,
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
    const capGeo = new THREE.ConeGeometry(0.5, 1.1, 6);
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

function makeWingGeometry(dir: 1 | -1): THREE.BufferGeometry {
  const L = 2.2;
  const g = new THREE.BufferGeometry();
  const verts = new Float32Array([0, 0, -0.16, 0, 0, 0.16, dir * L, 0, 0]);
  g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  g.computeVertexNormals();
  return g;
}

function buildBirds(count: number): THREE.Group {
  const container = new THREE.Group();
  const wingMat = new THREE.MeshBasicMaterial({
    color: "#3a4653",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  const leftGeo = makeWingGeometry(-1);
  const rightGeo = makeWingGeometry(1);
  for (let i = 0; i < count; i++) {
    const group = new THREE.Group();
    const left = new THREE.Mesh(leftGeo, wingMat);
    const right = new THREE.Mesh(rightGeo, wingMat);
    group.add(left, right);
    group.scale.setScalar(1.4 + Math.random() * 1.1);
    // per-bird flight params ride on userData so the frame loop can read them
    group.userData = {
      left,
      right,
      phase: Math.random() * Math.PI * 2,
      flap: 8 + Math.random() * 4,
      cx: (Math.random() - 0.5) * 40,
      cz: -30 - Math.random() * 60,
      prevX: 0,
      prevZ: 0,
    };
    container.add(group);
  }
  return container;
}

// GPU-animated soft snow: fall + wind sway happen in the vertex shader, so the
// frame loop only advances one uniform instead of looping over every flake.
const SNOW_VERT = `
  uniform float uTime;
  uniform float uHeight;
  uniform float uSize;
  uniform float uDpr;
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aSway;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float fall = mod(uTime * aSpeed + aSeed * uHeight, uHeight);
    p.y = uHeight - fall - 2.0;
    float phase = aSeed * 6.2831853;
    p.x += sin(uTime * 0.5 + phase) * aSway;
    p.z += cos(uTime * 0.35 + phase) * aSway * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * (34.0 / -mv.z), 1.0, 9.0) * uDpr;
    vAlpha = clamp(1.0 - (-mv.z) / 320.0, 0.0, 1.0);
  }
`;

const SNOW_FRAG = `
  precision mediump float;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = smoothstep(0.25, 0.02, d);
    gl_FragColor = vec4(1.0, 1.0, 1.0, a * 0.9 * vAlpha);
  }
`;

function buildSnow(count: number, size: number): THREE.Points {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const speed = new Float32Array(count);
  const sway = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 170;
    pos[i * 3 + 1] = Math.random() * 45;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 320;
    seed[i] = Math.random();
    speed[i] = 2 + Math.random() * 4;
    sway[i] = 0.6 + Math.random() * 2.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geo.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
  geo.setAttribute("aSway", new THREE.BufferAttribute(sway, 1));
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uHeight: { value: 47 },
      uSize: { value: size },
      uDpr: { value: dpr },
    },
    vertexShader: SNOW_VERT,
    fragmentShader: SNOW_FRAG,
    transparent: true,
    depthWrite: false,
  });
  const p = new THREE.Points(geo, mat);
  p.frustumCulled = false;
  return p;
}

// ── Components ─────────────────────────────────────────────────────────
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

function Birds({ count, staticView }: { count: number; staticView: boolean }) {
  const container = useMemo(() => buildBirds(count), [count]);
  const ref = useRef<THREE.Group | null>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || document.hidden || staticView) return;
    t.current += delta;
    const time = t.current;
    for (const grp of g.children) {
      const d = grp.userData;
      const x = d.cx + Math.sin(time * 0.15 + d.phase) * 62;
      const z = d.cz + Math.sin(time * 0.11 + d.phase * 1.3) * 92;
      const y = 54 + Math.sin(time * 0.22 + d.phase) * 6;
      const vx = x - d.prevX;
      const vz = z - d.prevZ;
      grp.position.set(x, y, z);
      if (vx * vx + vz * vz > 1e-5) grp.rotation.y = Math.atan2(vx, vz);
      d.prevX = x;
      d.prevZ = z;
      const wing = Math.sin(time * d.flap + d.phase) * 0.6;
      (d.right as THREE.Object3D).rotation.z = wing;
      (d.left as THREE.Object3D).rotation.z = -wing;
    }
  });
  return <primitive ref={ref} object={container} />;
}

function Snow({
  count,
  size,
  staticView,
}: {
  count: number;
  size: number;
  staticView: boolean;
}) {
  const points = useMemo(() => buildSnow(count, size), [count, size]);
  const ref = useRef<THREE.Points | null>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    const p = ref.current;
    if (!p || document.hidden || staticView) return;
    t.current += delta;
    (p.material as THREE.ShaderMaterial).uniforms.uTime.value = t.current;
  });
  return <primitive ref={ref} object={points} />;
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
      <color attach="background" args={["#cfe4f7"]} />
      <fog attach="fog" args={["#cfe4f7", 60, 320]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[30, 60, 40]} intensity={1.4} />
      <primitive object={terrain} />
      <primitive object={trail} />
      <Forest count={cfg.forest} withCaps={cfg.caps} />
      <Clouds count={cfg.clouds} staticView={staticView} />
      <Birds count={cfg.birds} staticView={staticView} />
      <Snow count={cfg.snow} size={cfg.snowSize} staticView={staticView} />
      <Rig progressRef={progressRef} staticView={staticView} />
      <DemandInvalidator active={frameloop === "demand"} />
    </Canvas>
  );
}

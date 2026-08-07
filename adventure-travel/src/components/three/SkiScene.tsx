"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { buildPines, buildSkiSlope, runCurve } from "./ski";

const RUN = runCurve();
const SKIER_STATIC_P = 0.35;

// ─── Jump timing (as fraction of run progress) ───
const JUMP_START = 0.55;
const JUMP_PEAK = 0.62;
const JUMP_END = 0.70;
const JUMP_HEIGHT = 6;
const JUMP_SPINS = 1; // full 360s during airtime

// ─── Slalom gate placement ───
const GATE_COUNT = 8;
const GATE_START_P = 0.08;
const GATE_END_P = 0.50; // gates stop before the jump

// ─── Weather zones (progress → conditions) ───
// 0.0–0.25 clear | 0.25–0.50 light snow | 0.50–0.80 blizzard | 0.80–1.0 clearing

function jumpOffset(p: number): { y: number; spin: number } {
  if (p < JUMP_START || p > JUMP_END) return { y: 0, spin: 0 };
  const t = (p - JUMP_START) / (JUMP_END - JUMP_START);
  const y = Math.sin(t * Math.PI) * JUMP_HEIGHT;
  const spin = t * Math.PI * 2 * JUMP_SPINS;
  return { y, spin };
}

function weatherAt(p: number) {
  // Returns { fogNear, fogFar, snowOpacity, lightIntensity }
  if (p < 0.25) {
    const t = p / 0.25;
    return {
      fogNear: THREE.MathUtils.lerp(70, 60, t),
      fogFar: THREE.MathUtils.lerp(340, 280, t),
      snowOpacity: THREE.MathUtils.lerp(0.3, 0.5, t),
      lightIntensity: THREE.MathUtils.lerp(1.5, 1.3, t),
    };
  }
  if (p < 0.5) {
    const t = (p - 0.25) / 0.25;
    return {
      fogNear: THREE.MathUtils.lerp(60, 40, t),
      fogFar: THREE.MathUtils.lerp(280, 180, t),
      snowOpacity: THREE.MathUtils.lerp(0.5, 0.75, t),
      lightIntensity: THREE.MathUtils.lerp(1.3, 1.0, t),
    };
  }
  if (p < 0.8) {
    const t = (p - 0.5) / 0.3;
    return {
      fogNear: THREE.MathUtils.lerp(40, 20, t),
      fogFar: THREE.MathUtils.lerp(180, 100, t),
      snowOpacity: THREE.MathUtils.lerp(0.75, 0.95, t),
      lightIntensity: THREE.MathUtils.lerp(1.0, 0.6, t),
    };
  }
  const t = (p - 0.8) / 0.2;
  return {
    fogNear: THREE.MathUtils.lerp(20, 70, t),
    fogFar: THREE.MathUtils.lerp(100, 340, t),
    snowOpacity: THREE.MathUtils.lerp(0.95, 0.3, t),
    lightIntensity: THREE.MathUtils.lerp(0.6, 1.5, t),
  };
}

// ─────────────────────────────────────────────────────────
// Skier (unchanged)
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// 1. Slalom Gates
// ─────────────────────────────────────────────────────────
function SlalomGates({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const gatesRef = useRef<THREE.Group>(null);
  const burstRef = useRef<THREE.Points>(null);
  const lastPassed = useRef(-1);

  const { gates, burst } = useMemo(() => {
    const gatesGroup = new THREE.Group();
    const gatePositions: THREE.Vector3[] = [];

    for (let i = 0; i < GATE_COUNT; i++) {
      const p = GATE_START_P + (i / (GATE_COUNT - 1)) * (GATE_END_P - GATE_START_P);
      const point = RUN.getPoint(p);
      const tangent = RUN.getTangent(p);
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      // Alternate sides to match the skier's sway pattern
      const offset = (i % 2 === 0 ? 1 : -1) * 2.2;
      const gateCenter = point.clone().addScaledVector(side, offset);

      const color = i % 2 === 0 ? "#ef4444" : "#3b82f6";
      const gateMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
      const poleMat = new THREE.MeshStandardMaterial({ color: "#e5e7eb", roughness: 0.7 });

      const gateGroup = new THREE.Group();

      // Two poles
      for (const dx of [-1.2, 1.2]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6), poleMat);
        pole.position.set(dx, 1.2, 0);
        gateGroup.add(pole);
      }

      // Crossbar / flag
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.08), gateMat);
      bar.position.set(0, 2.0, 0);
      gateGroup.add(bar);

      gateGroup.position.copy(gateCenter);
      gateGroup.rotation.y = Math.atan2(tangent.x, tangent.z);
      gatesGroup.add(gateGroup);
      gatePositions.push(gateCenter);
    }

    // Burst particles (reused for all gate passes)
    const BURST_COUNT = 30;
    const pos = new Float32Array(BURST_COUNT * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: "white",
      size: 0.5,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    const burstPoints = new THREE.Points(geo, mat);

    return { gates: gatesGroup, burst: burstPoints };
  }, []);

  const burstVelocities = useMemo(() => {
    const vels: THREE.Vector3[] = [];
    for (let i = 0; i < 30; i++) {
      vels.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          Math.random() * 5,
          (Math.random() - 0.5) * 6,
        ),
      );
    }
    return vels;
  }, []);

  const burstLife = useRef(0);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const p = progressRef.current;

    // Detect gate passage
    for (let i = 0; i < GATE_COUNT; i++) {
      const gateP = GATE_START_P + (i / (GATE_COUNT - 1)) * (GATE_END_P - GATE_START_P);
      if (p >= gateP && lastPassed.current < i) {
        lastPassed.current = i;
        burstLife.current = 1.0; // trigger burst
        // Position burst at gate
        const gatePoint = RUN.getPoint(gateP);
        burst.position.copy(gatePoint).add(new THREE.Vector3(0, 1.5, 0));
        // Reset particle positions
        const attr = burst.geometry.attributes.position as THREE.BufferAttribute;
        for (let j = 0; j < 30; j++) {
          attr.setXYZ(j, 0, 0, 0);
        }
        attr.needsUpdate = true;
        break;
      }
    }

    // Reset if scrolled backward
    if (p < GATE_START_P) lastPassed.current = -1;

    // Animate burst
    if (burstLife.current > 0) {
      burstLife.current -= delta * 1.5;
      const mat = burst.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, burstLife.current);
      const attr = burst.geometry.attributes.position as THREE.BufferAttribute;
      for (let j = 0; j < 30; j++) {
        attr.setXYZ(
          j,
          attr.getX(j) + burstVelocities[j].x * delta,
          attr.getY(j) + burstVelocities[j].y * delta,
          attr.getZ(j) + burstVelocities[j].z * delta,
        );
        burstVelocities[j].y -= 9.8 * delta; // gravity
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <>
      <primitive object={gates} ref={gatesRef} />
      <primitive object={burst} ref={burstRef} />
    </>
  );
}

// ─────────────────────────────────────────────────────────
// 2. Landing Spray (burst when skier lands from jump)
// ─────────────────────────────────────────────────────────
function LandingSpray({
  skierRef,
  progressRef,
}: {
  skierRef: React.RefObject<THREE.Group | null>;
  progressRef: React.MutableRefObject<number>;
}) {
  const COUNT = 50;
  const points = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: "white",
      size: 0.55,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }, []);

  const wasAirborne = useRef(false);
  const sprayLife = useRef(0);
  const velocities = useMemo(() => {
    const vels: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      vels.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          Math.random() * 6 + 2,
          (Math.random() - 0.5) * 8,
        ),
      );
    }
    return vels;
  }, []);

  useFrame((_, delta) => {
    if (document.hidden) return;
    const p = progressRef.current;
    const { y } = jumpOffset(p);
    const isAirborne = y > 0.5;

    // Detect landing
    if (wasAirborne.current && !isAirborne && p > JUMP_START) {
      sprayLife.current = 1.0;
      const skier = skierRef.current;
      if (skier) {
        points.position.copy(skier.position);
        const attr = points.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < COUNT; i++) {
          attr.setXYZ(i, 0, 0.3, 0);
        }
        attr.needsUpdate = true;
      }
    }
    wasAirborne.current = isAirborne;

    // Animate spray
    if (sprayLife.current > 0) {
      sprayLife.current -= delta * 1.2;
      const mat = points.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, sprayLife.current) * 0.8;
      const attr = points.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        attr.setXYZ(
          i,
          attr.getX(i) + velocities[i].x * delta,
          attr.getY(i) + velocities[i].y * delta,
          attr.getZ(i) + velocities[i].z * delta,
        );
        velocities[i].y -= 9.8 * delta;
      }
      attr.needsUpdate = true;
    }
  });

  return <primitive object={points} />;
}

// ─────────────────────────────────────────────────────────
// 3. Weather-driven SnowDrift (modified from original)
// ─────────────────────────────────────────────────────────
function SnowDrift({
  count,
  height,
  staticView,
  progressRef,
}: {
  count: number;
  height: number;
  staticView: boolean;
  progressRef: React.MutableRefObject<number>;
}) {
  const points = useMemo(() => {
    /* eslint-disable react-hooks/purity -- procedural particle field samples Math.random during render (R3F pattern) */
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 44;
adventure-travel/src/components/three/SkiScene.tsx      pos[i * 3 + 2] = -120 + Math.random() * 300;
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

    // Weather-driven fall speed
    const weather = weatherAt(progressRef.current);
    const fallSpeed = 3 + (weather.snowOpacity - 0.3) * 4; // faster in blizzard

    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) - delta * fallSpeed;
      // Add horizontal drift in blizzard
      if (weather.snowOpacity > 0.7) {
        let x = attr.getX(i) + delta * 2;
        if (x > 60) x = -60;
        attr.setX(i, x);
      }
      if (y < -2) y = height + 2;
      attr.setY(i, y);
    }
    // eslint-disable-next-line react-hooks/immutability -- buffer attr mutated in the R3F frame loop
    attr.needsUpdate = true;

    // Adjust opacity based on weather
    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = weather.snowOpacity;
  });
  return <primitive object={points} />;
}

// ─────────────────────────────────────────────────────────
// 4. Speed Lines
// ─────────────────────────────────────────────────────────
function SpeedLines({
  skierRef,
  progressRef,
  staticView,
}: {
  skierRef: React.RefObject<THREE.Group | null>;
  progressRef: React.MutableRefObject<number>;
  staticView: boolean;
}) {
  const LINE_COUNT = 24;
  const linesRef = useRef<THREE.Group>(null);
  const prevProgress = useRef(0);
  const velocity = useRef(0);

  const lines = useMemo(() => {
    const group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0,
    });

    for (let i = 0; i < LINE_COUNT; i++) {
      const length = 2 + Math.random() * 4;
      const geo = new THREE.BoxGeometry(0.04, 0.04, length);
      const line = new THREE.Mesh(geo, mat.clone());
      // Random positions around the skier
      line.position.set(
        (Math.random() - 0.5) * 8,
        Math.random() * 4,
        -2 - Math.random() * 6,
      );
      line.userData.baseOpacity = 0.3 + Math.random() * 0.4;
      group.add(line);
    }
    return group;
  }, []);

  useFrame((_, delta) => {
    if (document.hidden || staticView) return;
    const skier = skierRef.current;
    if (!skier) return;

    // Calculate scroll velocity
    const p = progressRef.current;
    const rawVel = Math.abs(p - prevProgress.current) / Math.max(delta, 0.001);
    velocity.current = THREE.MathUtils.lerp(velocity.current, rawVel, 0.1);
    prevProgress.current = p;

    // Position lines behind skier
    lines.position.copy(skier.position);
    lines.rotation.y = skier.rotation.y;

    // Opacity based on velocity
    const speedFactor = THREE.MathUtils.clamp(velocity.current * 15, 0, 1);

    lines.children.forEach((line) => {
      const mat = (line as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = speedFactor * (line.userData.baseOpacity as number);
      // Stretch lines with speed
      const stretch = 1 + speedFactor * 2;
      line.scale.z = stretch;
    });
  });

  return <primitive object={lines} ref={linesRef} />;
}

// ─────────────────────────────────────────────────────────
// Powder (unchanged)
// ─────────────────────────────────────────────────────────
function Powder({
  skierRef,
  staticView,
}: {
  skierRef: React.RefObject<THREE.Group | null>;
  staticView: boolean;
}) {
  const COUNT = 50;
  const points = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
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

// ─────────────────────────────────────────────────────────
// Weather Controller (fog + lighting)
// ─────────────────────────────────────────────────────────
function WeatherController({
  progressRef,
  fogRef,
  lightRef,
}: {
  progressRef: React.MutableRefObject<number>;
  fogRef: React.MutableRefObject<THREE.Fog | null>;
  lightRef: React.MutableRefObject<THREE.DirectionalLight | null>;
}) {
  useFrame(() => {
    if (document.hidden) return;
    const weather = weatherAt(progressRef.current);

    if (fogRef.current) {
      fogRef.current.near = weather.fogNear;
      fogRef.current.far = weather.fogFar;
    }
    if (lightRef.current) {
      lightRef.current.intensity = weather.lightIntensity;
    }
  });
  return null;
}

// ─────────────────────────────────────────────────────────
// Rig (modified: jump + speed tilt + weather)
// ─────────────────────────────────────────────────────────
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
  const prevProgress = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // eslint-disable-next-line react-hooks/immutability -- R3F frame loop drives camera + skier imperatively by design
  useFrame((state, delta) => {
    if (document.hidden) return;
    const p = staticView ? SKIER_STATIC_P : progressRef.current;
    const runPoint = RUN.getPoint(p);
    const tangent = RUN.getTangent(p);
    const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    // Track velocity for speed-based camera effects
    const rawVel = Math.abs(p - prevProgress.current) / Math.max(delta, 0.001);
    velocity.current = THREE.MathUtils.lerp(velocity.current, rawVel, 0.1);
    prevProgress.current = p;

    const sway = staticView ? 0 : Math.sin(state.clock.elapsedTime * 1.6 + p * 6) * 1.6;
    const { y: jumpY, spin } = staticView ? { y: 0, spin: 0 } : jumpOffset(p);

    const skier = skierRef.current;
    if (skier) {
      skier.position.copy(runPoint).addScaledVector(side, sway);
      skier.position.y += jumpY; // Apply jump height
      skier.rotation.y = Math.atan2(tangent.x, tangent.z) + spin; // Add spin
      skier.rotation.z = staticView ? 0 : -sway * 0.22;
    }

    const camTarget = RUN.getPoint(Math.min(1, p + 0.02));
    camera.position.copy(camTarget).add(new THREE.Vector3(0, 7.5, 6));
    if (!staticView) {
      // eslint-disable-next-line react-hooks/immutability -- camera is a live THREE.Vector3, mutated per frame
      camera.position.x += mouse.current.x * 1.2;
      camera.position.y += mouse.current.y * 0.8;

      // Speed-based camera tilt (dive forward when going fast)
      const speedFactor = THREE.MathUtils.clamp(velocity.current * 10, 0, 1);
      camera.position.y -= speedFactor * 2;
      camera.position.z -= speedFactor * 3;
    }
    camera.lookAt(skier ? skier.position : runPoint);
  });
  return null;
}

// ─────────────────────────────────────────────────────────
// Main SkiScene (modified)
// ─────────────────────────────────────────────────────────
export default function SkiScene() {
  const progressRef = useRef(0);
  const skierRef = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.Fog>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
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
      <fog ref={fogRef} attach="fog" args={["#dff0ff", 70, 340]} />
      <ambientLight intensity={0.6} />
      <directionalLight ref={lightRef} position={[30, 80, 50]} intensity={1.5} />
      <primitive object={slope} />
      <primitive object={pines} />
      <Skier groupRef={skierRef} />
      <SlalomGates progressRef={progressRef} />
      <LandingSpray skierRef={skierRef} progressRef={progressRef} />
      <SnowDrift count={snowCount} height={40} staticView={staticView} progressRef={progressRef} />
      <Powder skierRef={skierRef} staticView={staticView} />
      <SpeedLines skierRef={skierRef} progressRef={progressRef} staticView={staticView} />
      <WeatherController progressRef={progressRef} fogRef={fogRef} lightRef={lightRef} />
      <Rig progressRef={progressRef} staticView={staticView} skierRef={skierRef} />
    </Canvas>
  );
}
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

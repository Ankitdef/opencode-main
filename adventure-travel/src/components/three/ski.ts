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

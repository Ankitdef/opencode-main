import * as THREE from "three";

// ponytail: three removed MathUtils.simplex2 in r150; vendored a small 2D simplex (Gustavson) so no extra dep is needed.
const GRAD2 = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1, 1, 0, -1, 0, 0, 1, 0, -1]);
const PERM = (() => {
  const p = new Uint8Array(256);
  let seed = 1337;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
})();

function simplex2(xin: number, yin: number): number {
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const s = (xin + yin) * F2;
  const i = Math.floor(xin + s);
  const j = Math.floor(yin + s);
  const t = (i + j) * G2;
  const x0 = xin - (i - t);
  const y0 = yin - (j - t);
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  const ii = i & 255;
  const jj = j & 255;
  const gi0 = (PERM[ii + PERM[jj]] % 8) * 2;
  const gi1 = (PERM[ii + i1 + PERM[jj + j1]] % 8) * 2;
  const gi2 = (PERM[ii + 1 + PERM[jj + 1]] % 8) * 2;
  let n0 = 0;
  let n1 = 0;
  let n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * (GRAD2[gi0] * x0 + GRAD2[gi0 + 1] * y0);
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * (GRAD2[gi1] * x1 + GRAD2[gi1 + 1] * y1);
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * (GRAD2[gi2] * x2 + GRAD2[gi2 + 1] * y2);
  }
  return 70 * (n0 + n1 + n2);
}

export function heightAt(x: number, z: number): number {
  const ridge = Math.min(1, Math.abs(x) / 60); // 0 at valley center → 1 at flanks
  const noise = simplex2(x * 0.025, z * 0.025) * 6;
  const detail = simplex2(x * 0.12, z * 0.12) * 1.5;
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

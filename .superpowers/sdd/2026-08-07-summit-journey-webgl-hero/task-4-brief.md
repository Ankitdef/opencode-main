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

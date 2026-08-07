# Task 1 Report: Ski Slope Geometry Helpers

**Status:** DONE

**Files created:**
- `adventure-travel/src/components/three/ski.ts`

**Exports:**
- `slopeHeight(x, z)` — height map with noise + S-shaped run groove
- `runCurve()` — CatmullRomCurve3 for skier path
- `buildSkiSlope()` — vertex-colored descending plane mesh
- `buildPines(count)` — instanced cone pines on flanks

**Verification:**
- `npx tsc --noEmit` — exit 0, no errors
- `npx eslint src/components/three/ski.ts` — exit 0, 0 errors

**Commit:** `52783bf` — `feat: ski slope geometry helpers for activities 3D scene`

**Concerns:** None — code is verbatim from the spec, tsc + eslint clean.

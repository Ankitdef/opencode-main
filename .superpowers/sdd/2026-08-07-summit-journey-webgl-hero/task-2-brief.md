### Task 2: WebGL detection helper

**Files:**
- Create: `adventure-travel/src/lib/webgl.ts`

**Interfaces:**
- Produces: `isWebGLAvailable(): boolean` — used by `ValleyHero` (Task 7) to choose canvas vs `HeroSplit` fallback.

- [ ] **Step 1: Create the helper**

```ts
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined" || typeof WebGLRenderingContext === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Verify it builds and lints**

Run: `npx eslint src/lib/webgl.ts`
Expected: no output (clean).

Run: `npm run build`
Expected: compiles.

- [ ] **Step 3: Commit**

```bash
git add src/lib/webgl.ts
git commit -m "feat: add WebGL availability helper"
```

---

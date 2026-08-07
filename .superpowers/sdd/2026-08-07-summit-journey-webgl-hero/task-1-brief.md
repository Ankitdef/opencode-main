### Task 1: Install 3D dependencies

**Files:**
- Modify: `adventure-travel/package.json` (via npm)

**Interfaces:**
- Produces: `three`, `@react-three/fiber@^9`, `@types/three` in `package.json`.

- [ ] **Step 1: Install packages**

Run (workdir `adventure-travel`):
```powershell
npm install three @react-three/fiber@^9 @types/three
```

- [ ] **Step 2: Verify versions**

Run: `npm ls three @react-three/fiber`
Expected: `three@^0.1xx` and `@react-three/fiber@^9.x`, no `invalid`/`UNMET`.

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: `✓ Compiled successfully` and all 33 routes generated.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add three and react-three-fiber for WebGL hero"
```

---

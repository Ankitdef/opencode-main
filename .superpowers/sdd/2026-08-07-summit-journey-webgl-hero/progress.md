# SDD ledger — plan: docs/superpowers/plans/2026-08-07-summit-journey-webgl-hero.md

## Pre-flight
- Work location: main branch (human consent obtained).
- bash scripts unavailable (WSL broken) - replicating task-brief/review-package manually in PowerShell.
- Plan pre-flight scan: no contradictions found.


Task 1: complete (commits 52323b2..8ee540b, review clean)
  minor (deferred): @types/three in dependencies not devDependencies — spec-faithful, fine.


Task 2: complete (commits 8ee540b..4e792e8, review clean)
  minor (deferred): no webglcontextlost runtime fallback — acceptable, scene is non-critical; add if users report context loss.


Task 3: complete (commits 4e792e8..f2af852, review clean)
  note: brief had 3 bugs (ContactPopup open prop, 46% wrapper, badge colors); implementer reconciled to pre-refactor behavior — verified against 52323b2, correct.
  minor (deferred): class-order drift in concatenated classes (cosmetic, same computed styles).
  minor (deferred): pre-existing mojibake in source for '4.9*' and em-dash — separate cleanup, out of scope.
  minor (deferred): scene variant hardcodes w-full lg:w-[46%] — Task 7 to make wrapper variant-dependent.


Task 4: complete (commits f2af852..a3c4c6c, review clean)
  note: plan assumed THREE.MathUtils.simplex2 (removed in three r150) — implementer vendored verified Gustavson simplex, correct.
  minor (deferred): hardcoded noise seed 1337 — expose param if per-page terrain needed.



Task 5: complete (commits a3c4c6c..3e34a7b, review approved)
  note: brief called THREE.MathUtils.simplex2 in Forest - resolved by exporting terrain.ts's vendored simplex2 (no duplicate).
  note: react-hooks v6 rules false-positive on R3F imperative patterns - 6 targeted eslint-disable comments added, all verified to suppress real errors (--report-unused-disable-directives clean).
  fix round 1 (resolved): Rig/SnowDrift kept animating after scrolling fully past hero - added rect.bottom < 0 bails + sectionRef prop to SnowDrift (3e34a7b).
  minor (deferred): one-shot matchMedia probe for reduced-motion - add change listener if user toggles while scrolled.
  minor (deferred): isMobile sampled once at render - won't react to orientation change; fine for hero.
  minor (deferred): Forest/SnowDrift don't dispose geometry on unmount - moot while whole Canvas teardown owns the GL context.

# Task 3 Report: Extract `HeroContent` from `HeroSplit`

**Status:** DONE
**Commit:** `f2af852` — refactor: extract HeroContent for reuse by WebGL hero

## What I implemented

- Created `adventure-travel/src/components/HeroContent.tsx` — the content column extracted from `HeroSplit` as a self-contained `HeroContent({ variant }: { variant: "split" | "scene" })` component. It owns the `showPopup`/`destination`/`difficulty` state, the search selects (populated from `treks`), both CTAs, trust metrics, and the `ContactPopup` wiring, plus the `variant`-driven class switches from the brief.
- Slimmed `adventure-travel/src/components/HeroSplit.tsx` down to the shell: GSAP parallax/tilt effect, `heroRef`/`imgRef`/`contentRef`, section + background image + white wavy panel, scroll cue. Removed now-unused imports (`useState`, `Link`, `motion`, `treks`, `ContactPopup`); kept `useEffect`, `useRef`, `useReducedMotion`, `gsap`, `ScrollTrigger`. Renders `<HeroContent variant="split" />` inside the `contentRef` wrapper (preserve-3d style intact).

## Brief deviations (reconciled by content — noted per instructions)

The brief's `HeroContent.tsx` code did not match the current `HeroSplit` state in three places. Following the hard requirement that `variant="split"` must render **identically**, I reconciled:

1. **`ContactPopup` `open` prop** — `ContactPopup` (`src/components/ContactPopup.tsx:10`) is a *controlled* component (`{ open, onClose }`, renders nothing when `open` is falsy). The brief's `<ContactPopup onClose={...} />` (no `open`) would never open the popup. I used `<ContactPopup open={showPopup} onClose={() => setShowPopup(false)} />`, matching the pre-refactor call.
2. **Layout wrapper `<div className="w-full lg:w-[46%]">`** — the brief's `HeroContent` returns a bare fragment and the slimmed `HeroSplit` replacement has no wrapper, but the `contentRef` container is `display: flex` (row). A fragment's children would each become flex items and lay out horizontally, breaking the hero. I wrapped the `HeroContent` output in the `w-full lg:w-[46%]` div (computed width verified at ~559px; `contentRef` has exactly 1 child).
3. **Badge classes** — the brief hardcodes `bg-primary/20 text-white`, which on the white split panel would be near-invisible white-on-white. I made the badge variant-dependent: split → `bg-primary/10 text-primary` (pre-refactor value), scene → `bg-primary/20 text-white` (brief's value). Verified the badge resolves to `bg-primary/10 text-primary`.

All other variant classes (select box, headline/body/metric colors, secondary CTA border, panel glass) were verified to concatenate to exactly the pre-refactor `HeroSplit` classes.

## Verification

- **`npm run build`** (adventure-travel): PASSED — compiled successfully, TypeScript finished, 33 static pages generated (18 SSG trek routes).
- **`npx eslint src/components/HeroSplit.tsx src/components/HeroContent.tsx`**: clean (exit 0, no warnings). Note: the first parallel invocation appeared to time out on Windows despite producing no output; a standalone re-run exited cleanly.
- **Playwright** (http://localhost:3000 — an existing `next dev` on port 3000 hot-reloaded the new files; my attempted 3001 spawn exited on its own since 3000 was taken):
  - H1 **"Surreal Summits & Wild Frontiers"** renders. ✓
  - Destination select populated: placeholder + 18 real trek names from `@/data/treks`; difficulty select: placeholder + Easy/Moderate/Challenging/Strenuous. ✓
  - Search button href: `/treks` with no selection; after selecting "Valley of Flowers" it updated to `/treks?search=Valley+of+Flowers`. ✓
  - Clicking **"Talk to a Trek Expert"** opened the contact popup ("Get in Touch" / WhatsApp / Call / Kuldeep Rawat); the close button closed it (modal gone, only the page footer's unrelated "Get in Touch" heading remains). ✓
  - No console errors (0 errors / 0 warnings). ✓
  - Computed style checks: badge `bg-primary/10 text-primary`, wrapper `w-full lg:w-[46%]` (559px), H1 color slate-900 (foreground, correct over white panel). ✓

## Files changed

- `adventure-travel/src/components/HeroContent.tsx` (new, +141)
- `adventure-travel/src/components/HeroSplit.tsx` (-131/+? — net -131 lines to 106 lines)

## Self-review

- Split variant is byte-equivalent in rendered classes to the pre-refactor component (verified via DOM/computed-style checks above).
- No test framework in repo; verification via build + eslint + Playwright as instructed.
- `ContactPopup` note from the brief ("verify the popup still opens") — it does.

## Concerns

- **Scene variant wrapper width**: `HeroContent` hardcodes `w-full lg:w-[46%]` (needed for split fidelity). If Task 7's WebGL overlay wants a different width/position for `variant="scene"`, that task should make the wrapper class variant-dependent — trivial when the overlay is wired up.
- Minor LF→CRLF warnings on commit (pre-existing Windows behavior, no content change).

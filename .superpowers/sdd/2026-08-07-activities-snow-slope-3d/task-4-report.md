# Task 4 Report: Integrate into the Activities Page

## Status: DONE

## Commit

`c543f53` — `feat: use 3D ski scene as activities page hero and backdrop`

## Changes Made

Modified `adventure-travel/src/app/activities/ActivitiesPageClient.tsx`:

1. **Import SkiHero** — Added `import SkiHero from "@/components/SkiHero";` in alphabetical order between SmartImage and SkiingCourseModal imports.
2. **Root div class** — Changed from `"min-h-screen bg-white dark:bg-background"` to `"relative min-h-screen overflow-x-hidden"`.
3. **Hero banner replaced** — Removed the entire photo hero `<section>` block (SmartImage + gradient overlay + heading + subtitle) and replaced with `<SkiHero />` followed by `<div className="relative z-10">`.
4. **z-10 wrapper closed** — Added `</div>` before `<SkiingCourseModal>` to close the z-10 wrapper div.
5. **Translucent skiing banner** — Changed section background from `"relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100"` to `"relative overflow-hidden bg-gradient-to-br from-sky-50/60 via-blue-50/50 to-sky-100/60 backdrop-blur-md"`.

All other content (Skills Academy, video embeds, activity cards, ILP section, Why Adventure With Us, CTA, course modal) left untouched and byte-identical.

## Verification

- `npx tsc --noEmit` — exit 0, no errors
- `npx eslint src/app/activities/ActivitiesPageClient.tsx` — 0 errors, 0 warnings
- `npm run build` — success, all 33 pages generated including `/activities`

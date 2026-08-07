### Task 4: Integrate into the activities page

**Files:**
- Modify: `adventure-travel/src/app/activities/ActivitiesPageClient.tsx`

**Interfaces:**
- Consumes: `SkiHero` default export from `@/components/SkiHero`.
- Produces: `/activities` renders `<SkiHero />` as the first section; all other content after it sits in `<div className="relative z-10">`; the page root is transparent; the `#skiing` feature banner background is translucent.

- [ ] **Step 1: Import SkiHero**

Add to the imports (keep alphabetical order with the existing `@/components` imports):

```tsx
import SkiHero from "@/components/SkiHero";
```

- [ ] **Step 2: Replace the photo hero banner with SkiHero and open the z-10 wrapper**

Change the page root element:

```tsx
<div className="min-h-screen bg-white dark:bg-background">
```

to:

```tsx
<div className="relative min-h-screen overflow-x-hidden">
```

Replace the entire photo hero banner block (the `<section className="relative h-[50vh] min-h-[400px] overflow-hidden">...</section>` that ends right before the `{/* Skiing & Snowboarding feature banner */}` comment) with:

```tsx
      <SkiHero />

      <div className="relative z-10">
```

So the JSX order becomes: root div → `<SkiHero />` → `<div className="relative z-10">` → `{/* Skiing & Snowboarding feature banner */}` section → ... (all other sections unchanged, NOT re-indented — JSX does not require indentation; keep the existing content byte-identical).

- [ ] **Step 3: Close the z-10 wrapper before the modal**

Change the tail of the JSX from:

```tsx
      <SkiingCourseModal open={showCourse} onClose={() => setShowCourse(false)} />
    </div>
```

to:

```tsx
      </div>

      <SkiingCourseModal open={showCourse} onClose={() => setShowCourse(false)} />
    </div>
```

- [ ] **Step 4: Make the skiing feature banner translucent**

Change:

```tsx
<section id="skiing" className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100">
```

to:

```tsx
<section id="skiing" className="relative overflow-hidden bg-gradient-to-br from-sky-50/60 via-blue-50/50 to-sky-100/60 backdrop-blur-md">
```

Leave everything else in `ActivitiesPageClient.tsx` untouched: the dark ILP section and the final gradient CTA stay solid; "What Adventure Calls You?" (`py-20`, transparent) and "Why Adventure With Us?" (`bg-accent/5`) stay as they are; the Skills Academy cards, video embeds, activity cards, and the course modal unchanged.

- [ ] **Step 5: Verify typecheck + lint + build**

Run (workdir `adventure-travel/`): `npx tsc --noEmit` — expected exit 0.
Run: `npx eslint src/app/activities/ActivitiesPageClient.tsx` — expected 0 errors, 0 warnings.
Run: `npm run build` — expected success.

- [ ] **Step 6: Commit**

```bash
git add adventure-travel/src/app/activities/ActivitiesPageClient.tsx
git commit -m "feat: use 3D ski scene as activities page hero and backdrop"
```

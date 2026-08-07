# 3D Scroll Animation Design Spec

## Overview
Add full 3D scroll-driven animations to the homepage using GSAP + ScrollTrigger + Lenis smooth scroll.

## Dependencies
- `@studio-freight/lenis` — smooth inertial scroll
- `gsap` (already installed) + `ScrollTrigger` plugin

## Changes

### 1. Smooth Scroll Provider
- New `SmoothScrollProvider.tsx` wrapping app in Lenis
- Sync ScrollTrigger to Lenis scroll events
- Respect `prefers-reduced-motion`

### 2. Hero Parallax Depth
- Split hero image into depth layers
- Scroll-driven parallax at different speeds
- Slight 3D tilt on text panel

### 3. 3D Card Tilt
- Trek cards get perspective tilt on hover (mouse-driven)
- Scroll-into-viewport 3D entrance animation

### 4. 3D Terrain Map
- Map container gets perspective
- Scroll-driven tilt on the map
- Region paths get translateZ offset

### 5. Section Transitions
- Each section animates from z:-50 to z:0 with rotateX

### 6. Performance
- GPU-composited transforms only
- will-change: transform
- prefers-reduced-motion respect

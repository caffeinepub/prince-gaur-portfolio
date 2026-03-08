# Prince Gaur Portfolio

## Current State
A cinematic, dark-themed portfolio site with black/gold aesthetic. Already includes:
- Framer Motion animations, glitch text effect on hero heading, film grain overlays
- Floating particles, ambient glow pulse, custom gold cursor
- Netflix-style hover video previews, scroll reveal animations
- All four work categories (Films, Commercial, YouTube, Talking Head)

## Requested Changes (Diff)

### Add
- **Sketch/draw-on animation** for hero heading "Hii, I'm Prince Gaur" — SVG text path stroke animation flowing left-to-right, 1–1.5s duration, glowing trail, subtle fade-in finish
- **Arcane-style background glows** — blended warm (gold/amber) + cool (blue/purple) painterly radial blobs behind sections, very subtle depth
- **Film grain texture layer** — additional fine-grain SVG texture pass via CSS pseudo-element on body/sections, barely noticeable
- **Light leak effects** — soft diagonal warm color streaks in hero and contact sections
- **Vignette edges** — cinematic vignette enhancement on work/testimonials sections
- **Projector-style light beam** — faint cone beam in hero background
- **Additional ambient depth** — subtle animated oil-paint-style gradient shapes at section boundaries

### Modify
- Hero heading: replace plain `<h1>` glitch text with SVG-based stroke draw-on animation component while keeping the glitch effect after it finishes
- CSS: add new keyframes for draw-on glow trail, light leak drift, Arcane-style blob pulse
- Tighten existing grain/particle animations for smoother feel

### Remove
- Nothing removed

## Implementation Plan
1. Create `SketchText` component using SVG `<text>` with `stroke-dashoffset` animation to simulate draw-on effect flowing left to right; after draw completes, fade-in fill and re-attach glitch
2. Add `ArcaneGlow` component — absolute-positioned radial blobs with blended warm+cool colors, animated slowly, placed behind sections
3. Add `LightLeak` component — diagonal gradient streaks, low opacity
4. Extend CSS with: `@keyframes draw-stroke`, `@keyframes light-leak-drift`, `@keyframes arcane-blob`, vignette edge class for non-hero sections
5. Wire components into HeroSection, AboutSection, WorkSection, TestimonialsSection
6. Keep all existing content and layout completely untouched

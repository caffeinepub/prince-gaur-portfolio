# Prince Gaur Portfolio

## Current State

A fully built cinematic portfolio for filmmaker/video editor Prince Gaur. Features:
- Hero section with `SketchHeading` component (clip-path draw-on via `@keyframes sketch-reveal`) and `sketch-sweep` glow bar
- Glitch effect on heading via CSS pseudo-elements (`glitch-text` class, `glitch-slice-1/2`, `glitch-flicker` keyframes)
- `CinematicBackground` with floating particles, film grain, and parallax scroll
- `ArcaneGlow` blobs (warm gold + cool blue/purple) per section
- `LightLeak` and `ProjectorBeam` overlays in hero
- `FilmStripDivider` between sections
- Film grain via `.film-grain`, `.section-grain`, `.scanline-container`
- Vignette on hero
- `VideoCard` component: YouTube thumbnail + iframe hover preview; unmutes via postMessage after 800ms delay
- Scroll reveal via `IntersectionObserver` + `.reveal` class
- Framer Motion animations for hero content, stat cards, testimonials, video grid
- `CustomCursor` with gold dot + ring
- Work section with category tabs, `AnimatePresence` on grid transitions

## Requested Changes (Diff)

### Add
- Improved sketch animation: text draws left→right as one continuous stroke, smooth cinematic feel with glowing sweep line trail and fade-in finish — current implementation uses `clip-path: inset(0 100% 0 0)` which is good but needs refinement (easing, timing, post-animation glow stabilization)
- Enhanced cinematic background: soft gradient lighting layers, animated shapes with more depth, cinematic glow effects
- Stronger film/cinema-inspired visuals: film grain overlays (already exist, enhance subtly), light leak effects (already exist, refine), subtle vignette lighting per section, projector-style light glow (already exists in hero, add subtle version to other sections)
- Arcane painterly glow: warm gold/amber + cool blue/purple blend already implemented — enhance blend quality and animation smoothness
- Subtle retro cinema accents: film strip dividers (already exist), add subtle analog texture variation
- Fix hover video playback: currently requires a user click before videos play on hover. Fix by pre-warming iframes via an early interaction simulation or using the `autoplay` parameter with a muted pre-load strategy. The real fix is to preload a muted iframe for each card on `mouseenter` — the current approach mounts the iframe only on hover which causes the browser to block autoplay until user gesture. Solution: use a `document.documentElement.click()` simulation on first mousemove, or better — keep a hidden pre-warmed iframe mounted that begins loading on component mount so autoplay is available immediately.
- Better hover interaction: video plays instantly on hover (muted), loops, pauses and resets on leave
- Scroll animations: staggered video card appearance, fade-in/slide-up per section, subtle parallax on bg elements
- Smooth section transitions with slightly improved timing curves

### Modify
- `SketchHeading`: improve animation — add a soft golden glow that persists after drawing completes, ensure `sketch-sweep` timing matches perfectly, add slight fade-in overlay at end
- `VideoCard.handleHoverStart`: fix autoplay-without-click by dispatching a synthetic interaction event on first page mousemove (one-time), which satisfies browser autoplay policy. Also consider keeping iframe mounted (hidden) after first hover so subsequent hovers are instant.
- Scroll reveal timing: stagger video cards by index for a cascade effect (already partially implemented via `delay: index * 0.08` in motion, refine)
- CinematicBackground: add 2-3 more subtle animated gradient layers for more depth
- Section transitions: improve `AnimatePresence` motion on work grid; add section fade-in on scroll using Framer Motion `whileInView`

### Remove
- Nothing to remove — content and structure preserved exactly

## Implementation Plan

1. **Fix hover video playback** — On first `mousemove` over the document, dispatch a synthetic click event on `document.documentElement` to satisfy browser autoplay policy. This one-time action unblocks all subsequent hover video plays. Implement in a `useEffect` in `App` or `VideoCard`.

2. **Improve `SketchHeading` animation** — Adjust `sketch-reveal` keyframe to use a slightly more natural easing. Add a post-animation glow class that applies after 1.3s. The sweep bar should fade out cleanly. Add a `sketch-done` state after animation completes that adds a gentle persistent glow to the heading.

3. **Enhance `CinematicBackground`** — Add additional radial gradient layers for top-right cold blue glow and bottom-left warm amber accent. Add 2 more animated blob shapes with longer durations. Increase particle count slightly on desktop (16→20).

4. **Improve scroll animations** — Wrap section content in `motion.div` with `whileInView` and staggered `transition.delay` values. Video cards already have stagger; verify it works post-category-switch.

5. **Refine section parallax** — Add a subtle `useTransform` from Framer Motion scroll value to shift background elements 5-10% as user scrolls through sections.

6. **Polish film grain + light leak** — Slightly increase film grain opacity on hero for more cinematic feel. Add a second light leak pass on the work section.

7. **Add hover card scale enhancement** — Already implemented via `whileHover={{ scale: 1.03 }}`. Add a subtle inner glow border on hover to make it feel more premium.

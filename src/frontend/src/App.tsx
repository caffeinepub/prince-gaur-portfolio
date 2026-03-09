import { Toaster } from "@/components/ui/sonner";
import { ChevronDown, Instagram, Loader2, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiInstagram } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ─── Types ──────────────────────────────────────────────────────────────────

type WorkCategory = "All" | "Films" | "Commercial" | "YouTube" | "Talking Head";

interface VideoItem {
  embedUrl: string;
  title: string;
  isShort?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WORK_DATA: Record<Exclude<WorkCategory, "All">, VideoItem[]> = {
  Films: [
    {
      embedUrl: "https://www.youtube.com/embed/HgSR6M3XtKU",
      title: "WokTok",
    },
  ],
  Commercial: [
    {
      embedUrl: "https://www.youtube.com/embed/s45E_oVnbNA",
      title: "Urban Company",
      isShort: true,
    },
    {
      embedUrl: "https://www.youtube.com/embed/hapXvoI6gVM",
      title: "Hoopr",
      isShort: true,
    },
  ],
  YouTube: [
    {
      embedUrl: "https://www.youtube.com/embed/XDyKXuuyrn8",
      title: "YouTube Feature",
    },
    {
      embedUrl:
        "https://www.youtube.com/embed/qYQ-ibEhZ44?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&playlist=qYQ-ibEhZ44",
      title: "Youtube Short",
      isShort: true,
    },
  ],
  "Talking Head": [
    {
      embedUrl: "https://www.youtube.com/embed/yM_LU2sv7JQ",
      title: "Introduction",
    },
    {
      embedUrl:
        "https://www.youtube.com/embed/VDnjJzK99-A?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&playlist=VDnjJzK99-A",
      title: "Day-0",
      isShort: false,
    },
  ],
};

// All category: 6 videos mixed from different categories (with category label)
interface VideoItemWithCategory extends VideoItem {
  category: Exclude<WorkCategory, "All">;
}

const ALL_VIDEOS: VideoItemWithCategory[] = [
  // ROW 1 — Vertical cards (9:16 portrait)
  { ...WORK_DATA.Commercial[0], category: "Commercial" }, // Urban Company, isShort: true
  { ...WORK_DATA.Commercial[1], category: "Commercial" }, // Hoopr, isShort: true
  {
    embedUrl:
      "https://www.youtube.com/embed/qYQ-ibEhZ44?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&playlist=qYQ-ibEhZ44",
    title: "Youtube Short",
    isShort: true,
    category: "YouTube",
  },
  // ROW 2 — Horizontal cards (16:9 landscape)
  { ...WORK_DATA.YouTube[0], category: "YouTube" }, // YouTube Feature
  { ...WORK_DATA.Films[0], category: "Films" }, // WokTok
  {
    embedUrl:
      "https://www.youtube.com/embed/VDnjJzK99-A?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&playlist=VDnjJzK99-A",
    title: "Day-0",
    isShort: false,
    category: "Talking Head",
  },
];

const WORK_CATEGORIES: WorkCategory[] = [
  "All",
  "Films",
  "Commercial",
  "YouTube",
  "Talking Head",
];

const SKILLS = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Color Grading",
  "Motion Graphics",
  "Sound Design",
];

const TESTIMONIALS = [
  {
    quote:
      "Prince's editing transformed our brand video. Absolutely cinematic — every cut felt intentional and powerful.",
    name: "Rahul S.",
    role: "Brand Manager, PixelForge",
  },
  {
    quote:
      "Working with Prince felt like collaborating with a true storyteller. He brought an incredible visual language to our documentary.",
    name: "Meera K.",
    role: "Independent Filmmaker",
  },
  {
    quote:
      "Our YouTube channel grew 3x after Prince revamped our editing style. He understands pace, emotion, and audience retention.",
    name: "Arjun D.",
    role: "Content Creator, 200K+ Subscribers",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractVideoId(embedUrl: string): string {
  // Extract video ID from URLs like https://www.youtube.com/embed/VIDEO_ID
  const parts = embedUrl.split("/embed/");
  if (parts.length > 1) {
    return parts[1].split("?")[0];
  }
  return "";
}

// ─── Arcane Glow Blobs ────────────────────────────────────────────────────────

interface ArcaneGlowProps {
  blobs: Array<{
    color: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width?: string;
    height?: string;
    delay?: string;
    duration?: string;
  }>;
}

function ArcaneGlow({ blobs }: ArcaneGlowProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {blobs.map((blob, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: decorative blobs have no identity
          key={i}
          style={{
            position: "absolute",
            top: blob.top,
            bottom: blob.bottom,
            left: blob.left,
            right: blob.right,
            width: blob.width ?? "70vw",
            height: blob.height ?? "60vh",
            background: `radial-gradient(ellipse at center, ${blob.color} 0%, transparent 70%)`,
            borderRadius: "50%",
            animation: `arcane-blob ${blob.duration ?? "20s"} ease-in-out infinite`,
            animationDelay: blob.delay ?? "0s",
            willChange: "transform, opacity",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Light Leak Overlay ───────────────────────────────────────────────────────

function LightLeak({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background:
          "linear-gradient(135deg, oklch(0.75 0.15 70 / 0%) 30%, oklch(0.75 0.15 70 / 3%) 50%, oklch(0.75 0.15 70 / 0%) 70%)",
        backgroundSize: "200% 200%",
        animation: "light-leak-drift 20s ease-in-out infinite",
        opacity,
        willChange: "background-position",
      }}
    />
  );
}

// ─── Film Strip Divider ───────────────────────────────────────────────────────

function FilmStripDivider() {
  return (
    <div className="film-strip-divider" aria-hidden="true">
      <div className="film-strip-ticks">
        {Array.from({ length: 9 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: decorative tick marks
          <span key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Typewriter Heading ───────────────────────────────────────────────────────

const TYPEWRITER_TEXT = "Hii, I'm Prince Gaur";

function TypewriterHeading() {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const indexRef = useRef(0);

  // Typing effect
  useEffect(() => {
    if (indexRef.current >= TYPEWRITER_TEXT.length) return;

    const type = () => {
      if (indexRef.current < TYPEWRITER_TEXT.length) {
        indexRef.current += 1;
        setDisplayed(TYPEWRITER_TEXT.slice(0, indexRef.current));
        // Slight random variation for natural feel (64–94ms per character, 10% faster than previous)
        const delay = 64 + Math.random() * 30;
        setTimeout(type, delay);
      } else {
        setTypingDone(true);
      }
    };

    // Small initial delay so page loads first
    const start = setTimeout(type, 300);
    return () => clearTimeout(start);
  }, []);

  // Blinking cursor — stops blinking 1.2s after typing finishes
  useEffect(() => {
    if (!typingDone) return;
    const stop = setTimeout(() => setCursorVisible(false), 1200);
    return () => clearTimeout(stop);
  }, [typingDone]);

  return (
    <h1
      className="glitch-text font-display text-[clamp(2.8rem,9vw,8rem)] font-bold tracking-[0.04em] text-foreground leading-[1.05]"
      data-text={TYPEWRITER_TEXT}
    >
      {displayed}
      {cursorVisible && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "3px",
            height: "0.85em",
            background: "oklch(0.72 0.12 78)",
            marginLeft: "3px",
            verticalAlign: "middle",
            borderRadius: "1px",
            animation: typingDone
              ? "typewriter-cursor 0.6s step-end 3"
              : "typewriter-cursor 0.7s step-end infinite",
          }}
        />
      )}
    </h1>
  );
}

// ─── Projector Beam ───────────────────────────────────────────────────────────

function ProjectorBeam() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "40vw",
        height: "100%",
        background:
          "linear-gradient(180deg, oklch(0.95 0.005 85 / 2.5%) 0%, transparent 60%)",
        pointerEvents: "none",
        zIndex: 1,
        willChange: "opacity",
      }}
    />
  );
}

// ─── Cinematic Background ─────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 7.3 + 3) % 100}%`,
  size: i % 3 === 0 ? 3 : 2,
  duration: 16 + ((i * 1.3) % 10),
  delay: (i * 1.7) % 12,
  opacity: 0.1 + (i % 4) * 0.04,
  bottom: `${(i * 13) % 30}%`,
}));

function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (containerRef.current) {
        const offset = window.scrollY * 0.05;
        containerRef.current.style.transform = `translateY(${offset}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* Parallax container */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: "-5%",
          width: "110%",
          height: "110%",
        }}
      >
        {/* Film grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
            opacity: 0.025,
            mixBlendMode: "overlay",
            animation: "grain 0.5s steps(1) infinite",
          }}
        />

        {/* Ambient gradient drift — top-left gold glow */}
        <div
          className="cinema-drift"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 40% at 15% 20%, oklch(0.72 0.12 78 / 3%) 0%, transparent 70%),
                          radial-gradient(ellipse 50% 35% at 85% 80%, oklch(0.72 0.12 78 / 2%) 0%, transparent 65%)`,
          }}
        />

        {/* Soft center glow — pulsing */}
        <div
          className="cinema-glow-pulse"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            height: "60vh",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, oklch(0.72 0.12 78 / 4%) 0%, transparent 70%)",
          }}
        />

        {/* Top-right cold blue accent */}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            right: "-10%",
            width: "50vw",
            height: "45vh",
            background:
              "radial-gradient(ellipse at center, oklch(0.55 0.18 270 / 2.5%) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "arcane-blob 24s ease-in-out infinite",
            animationDelay: "6s",
            pointerEvents: "none",
          }}
        />

        {/* Bottom-center warm amber drift */}
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "30%",
            width: "40vw",
            height: "35vh",
            background:
              "radial-gradient(ellipse at center, oklch(0.65 0.14 60 / 1.5%) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "arcane-blob 28s ease-in-out infinite reverse",
            animationDelay: "12s",
            pointerEvents: "none",
          }}
        />

        {/* Floating particles — hidden on mobile */}
        {!isMobile &&
          PARTICLES.map((p) => (
            <div
              key={p.id}
              className="cinema-particle"
              style={{
                left: p.left,
                bottom: p.bottom,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background:
                  p.id % 5 === 0
                    ? `oklch(0.72 0.12 78 / ${p.opacity * 1.5})`
                    : `oklch(0.94 0.012 85 / ${p.opacity})`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                boxShadow:
                  p.id % 5 === 0 ? "0 0 4px oklch(0.72 0.12 78 / 40%)" : "none",
              }}
            />
          ))}
      </div>
    </div>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isHovering = useRef(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button"
      ) {
        isHovering.current = true;
        ringRef.current?.classList.add("hovering");
      }
    };

    const onMouseOut = () => {
      isHovering.current = false;
      ringRef.current?.classList.remove("hovering");
    };

    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.style.left = `${mousePos.current.x}px`;
        dot.style.top = `${mousePos.current.y}px`;
      }

      if (ring) {
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
        ring.style.left = `${ringPos.current.x}px`;
        ring.style.top = `${ringPos.current.y}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const elements = document.querySelectorAll(".reveal");
    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, []);
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.07_0_0/95%)] backdrop-blur-sm border-b border-[oklch(0.72_0.12_78/15%)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="nav-logo-text"
          data-ocid="nav.button"
        >
          Prince Gaur
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="nav-link"
            data-ocid="nav.about.link"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollTo("work")}
            className="nav-link"
            data-ocid="nav.work.link"
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="nav-link"
            data-ocid="nav.contact.link"
          >
            Contact
          </button>
        </div>

        {/* Mobile CTA */}
        <button
          type="button"
          onClick={() => scrollTo("contact")}
          className="md:hidden nav-link text-gold"
          data-ocid="nav.mobile.contact.link"
        >
          Contact
        </button>
      </nav>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden scanline-container film-grain cinema-letterbox"
      style={{
        backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[oklch(0.04_0_0/88%)] z-[1]" />

      {/* Vignette */}
      <div className="absolute inset-0 vignette z-[1]" />

      {/* Arcane background glows */}
      <ArcaneGlow
        blobs={[
          {
            color: "oklch(0.75 0.16 75 / 4%)",
            top: "-10%",
            left: "-15%",
            width: "65vw",
            height: "60vh",
            duration: "22s",
            delay: "0s",
          },
          {
            color: "oklch(0.55 0.18 270 / 3%)",
            bottom: "-10%",
            right: "-15%",
            width: "60vw",
            height: "55vh",
            duration: "18s",
            delay: "4s",
          },
        ]}
      />

      {/* Light leak */}
      <LightLeak />

      {/* Projector beam */}
      <ProjectorBeam />

      {/* Animated grid lines */}
      <div
        className="absolute inset-0 opacity-[0.05] z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.72 0.12 78) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.12 78) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-[10] text-center px-6 max-w-5xl mx-auto">
        {/* Main name — typewriter effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TypewriterHeading />
        </motion.div>

        {/* Gold line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-gold to-transparent my-8 mx-auto max-w-xs"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-body text-lg md:text-2xl text-foreground/80 tracking-[0.12em] uppercase mb-3"
        >
          A Video Editor and Filmmaker
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-body text-sm md:text-base text-muted-foreground tracking-wider mb-12"
        >
          Crafting Visual Stories That Moves the World
        </motion.p>

        {/* CTA */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          onClick={scrollToWork}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold font-body text-sm uppercase tracking-[0.3em] hover:bg-gold hover:text-background transition-all duration-300 animate-gold-pulse"
          data-ocid="hero.primary_button"
        >
          View My Work
          <ChevronDown size={16} />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground z-[10]"
      >
        <span className="text-xs tracking-[0.3em] uppercase text-gold-dim">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-28 px-6 overflow-hidden section-grain section-vignette"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.12 78) 0%, transparent 70%)",
        }}
      />

      {/* Arcane blobs */}
      <ArcaneGlow
        blobs={[
          {
            color: "oklch(0.75 0.16 75 / 3%)",
            top: "-5%",
            right: "-10%",
            width: "55vw",
            height: "50vh",
            duration: "25s",
            delay: "2s",
          },
          {
            color: "oklch(0.55 0.18 270 / 2.5%)",
            bottom: "0%",
            left: "-10%",
            width: "50vw",
            height: "45vh",
            duration: "20s",
            delay: "8s",
          },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label — numbers removed */}
        <div className="reveal flex items-center gap-4 mb-16">
          <div className="gold-divider flex-1 max-w-16" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-wide">
            About
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Bio */}
          <div className="reveal">
            <p className="font-body text-lg text-foreground/85 leading-relaxed mb-8">
              I'm <span className="text-gold font-semibold">Prince Gaur</span>,
              a passionate video editor with{" "}
              <span className="text-gold font-semibold">4 years</span> of
              experience crafting compelling stories through post-production.
              From cinematic films to high-energy commercials, I transform raw
              footage into visual masterpieces.
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-10">
              Every frame is a deliberate decision. Every cut tells a story. I
              believe in the power of rhythm, color, and sound working in
              perfect harmony — turning ordinary footage into extraordinary
              experiences.
            </p>

            {/* Skills */}
            <div>
              <p className="text-gold-dim font-body text-xs tracking-[0.3em] uppercase mb-4">
                Tools & Expertise
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="font-body text-sm px-3 py-1.5 border border-[oklch(0.72_0.12_78/30%)] text-gold-dim tracking-wide hover:border-gold hover:text-gold transition-all duration-200"
                    style={{ borderRadius: "2px" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="reveal">
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  number: "4+",
                  label: "Years Experience",
                  sub: "In professional video editing",
                },
                {
                  number: "50+",
                  label: "Projects Delivered",
                  sub: "Across films, commercials & content",
                },
                {
                  number: "10+",
                  label: "Happy Clients",
                  sub: "From brands to indie filmmakers",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-card"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-5xl font-bold text-gold">
                      {stat.number}
                    </span>
                    <div>
                      <p className="font-body font-semibold text-foreground tracking-wide">
                        {stat.label}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {stat.sub}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Portrait area */}
            <div
              className="mt-6 h-40 relative overflow-hidden"
              style={{ borderRadius: "2px" }}
            >
              <img
                src="/assets/generated/about-bg.dim_1200x800.jpg"
                alt="Cinematic texture"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-display text-sm tracking-[0.5em] text-gold uppercase opacity-80">
                  Frame by Frame
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Video Card (Desktop: zoom-out hover preview | Mobile: scroll IntersectionObserver) ──

interface VideoCardProps {
  video: VideoItem | VideoItemWithCategory;
  displayCategory: string;
  index: number;
  audioEnabled: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

// Detect pointer device once (desktop = hover:hover + pointer:fine)
const isPointerDevice =
  typeof window !== "undefined"
    ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
    : true;

function VideoCard({
  video,
  displayCategory,
  index,
  audioEnabled,
  onHoverChange,
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const unmuteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasBeenHoveredRef = useRef(false);
  const videoId = extractVideoId(video.embedUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // Iframe src — always muted initially, unmuted via postMessage after hover
  const previewSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;

  // Send YouTube IFrame API command via postMessage
  const postYT = useCallback((command: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args }),
      "*",
    );
  }, []);

  // ── Desktop hover handlers (pointer devices only) ─────────────────
  const handleHoverStart = useCallback(() => {
    if (!isPointerDevice) return;
    const firstHover = !hasBeenHoveredRef.current;
    hasBeenHoveredRef.current = true;
    setIsHovered(true);
    onHoverChange?.(true);

    if (firstHover) {
      if (audioEnabled) {
        unmuteTimerRef.current = setTimeout(() => {
          postYT("unMute");
          postYT("setVolume", [80]);
        }, 600);
      }
    } else {
      postYT("seekTo", [0, true]);
      postYT("playVideo");
      if (audioEnabled) {
        unmuteTimerRef.current = setTimeout(() => {
          postYT("unMute");
          postYT("setVolume", [80]);
        }, 400);
      }
    }
  }, [postYT, audioEnabled, onHoverChange]);

  const handleHoverEnd = useCallback(() => {
    if (!isPointerDevice) return;
    setIsHovered(false);
    onHoverChange?.(false);
    if (unmuteTimerRef.current) {
      clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
    postYT("mute");
    postYT("pauseVideo");
    postYT("seekTo", [0, true]);
  }, [postYT, onHoverChange]);

  // ── Mobile: IntersectionObserver scroll-play ──────────────────────
  useEffect(() => {
    if (isPointerDevice) return; // desktop uses hover, not observer
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            postYT("playVideo");
          } else {
            postYT("pauseVideo");
            postYT("seekTo", [0, true]);
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [postYT]);

  // ── Pause on tab hidden ───────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        postYT("pauseVideo");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [postYT]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unmuteTimerRef.current) clearTimeout(unmuteTimerRef.current);
    };
  }, []);

  // Keep iframe in DOM once it has been hovered (for instant re-hover on desktop)
  // On mobile, always show iframe so IntersectionObserver can control it
  const showIframe = !isPointerDevice || isHovered || hasBeenHoveredRef.current;

  return (
    <motion.div
      ref={cardRef}
      className={`portfolio-card gold-card bg-card overflow-hidden group${isHovered ? " is-desktop-hovered" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      data-ocid={`work.item.${index + 1}` as `work.item.${1 | 2 | 3}`}
      style={{
        borderRadius: "4px",
        position: "relative",
        zIndex: isHovered ? 10 : 1,
        willChange: "transform",
      }}
    >
      {/* Video area */}
      <div
        className={`video-container${video.isShort ? " shorts" : ""} video-card-wrapper${isHovered ? " is-hovered" : ""}`}
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="video-thumbnail"
          loading="lazy"
        />

        {/* Card overlay — visible on mobile (0.4), fades on desktop hover */}
        <div
          className="card-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, oklch(0 0 0 / 65%) 0%, oklch(0 0 0 / 30%) 50%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 2,
            opacity: isHovered ? 0.3 : 0.7,
            transition: "opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />

        {/* iframe preview */}
        {showIframe && (
          <iframe
            ref={iframeRef}
            className="video-iframe-preview"
            src={previewSrc}
            title={`${video.title} preview`}
            frameBorder={0}
            allow="autoplay; encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            style={{
              opacity: isHovered || !isPointerDevice ? 1 : 0,
              pointerEvents: "none",
              transition: "opacity 0.35s ease",
            }}
          />
        )}
      </div>

      {/* Card footer */}
      <div
        className="px-4 py-3 border-t border-[oklch(0.72_0.12_78/12%)] flex items-center justify-between"
        style={{
          background:
            "linear-gradient(to right, oklch(0.13 0.006 78 / 80%), oklch(0.11 0 0))",
        }}
      >
        <div>
          <p
            className="font-body text-sm font-medium tracking-wide transition-all duration-300"
            style={{
              color: isHovered
                ? "oklch(0.72 0.12 78)"
                : "oklch(0.94 0.012 85 / 85%)",
              transform: isHovered ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            {video.title}
          </p>
          <p className="font-body text-xs text-muted-foreground mt-0.5 tracking-[0.2em] uppercase">
            {displayCategory}
          </p>
        </div>
        {/* Gold arrow indicator on hover */}
        <span
          className="text-gold text-lg leading-none transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          ›
        </span>
      </div>
    </motion.div>
  );
}

// ─── Work Section ────────────────────────────────────────────────────────────

function WorkSection({ audioEnabled }: { audioEnabled: boolean }) {
  const [activeCategory, setActiveCategory] = useState<WorkCategory>("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const videos =
    activeCategory === "All"
      ? ALL_VIDEOS
      : WORK_DATA[activeCategory as Exclude<WorkCategory, "All">];

  return (
    <section
      id="work"
      className="relative py-28 px-6 bg-[oklch(0.06_0_0)] section-grain section-vignette"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 50%, oklch(0.72 0.12 78) 0%, transparent 60%)",
        }}
      />

      {/* Arcane blob */}
      <ArcaneGlow
        blobs={[
          {
            color: "oklch(0.55 0.18 270 / 2.5%)",
            top: "20%",
            left: "-10%",
            width: "55vw",
            height: "50vh",
            duration: "22s",
            delay: "1s",
          },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label — numbers removed */}
        <div className="reveal flex items-center gap-4 mb-12">
          <div className="gold-divider flex-1 max-w-16" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-wide">
            Work
          </h2>
        </div>

        {/* Category tabs */}
        <div className="reveal flex flex-wrap gap-0 mb-12 border-b border-[oklch(0.72_0.12_78/15%)]">
          {WORK_CATEGORIES.map((cat, i) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-ocid={`work.tab.${i + 1}` as `work.tab.${1 | 2 | 3 | 4}`}
              className={`font-body text-sm uppercase tracking-[0.2em] px-5 py-3 transition-all duration-300 border-b-2 -mb-px ${
                activeCategory === cat
                  ? "text-gold border-gold"
                  : "text-muted-foreground border-transparent hover:text-foreground/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video grid */}
        <div className="relative">
          {/* Subtle dim overlay when a card is hovered on desktop */}
          <AnimatePresence>
            {hoveredIndex !== null && isPointerDevice && (
              <motion.div
                key="dim-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: "-3rem",
                  background: "oklch(0 0 0 / 35%)",
                  zIndex: 5,
                  pointerEvents: "none",
                  borderRadius: "8px",
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ position: "relative" }}
            >
              {activeCategory === "All" ? (
                <>
                  {/* Row 1 — Vertical / portrait cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(videos as VideoItemWithCategory[])
                      .slice(0, 3)
                      .map((video, i) => (
                        <VideoCard
                          key={`${activeCategory}-${video.embedUrl}-${i}`}
                          video={video}
                          displayCategory={
                            (video as VideoItemWithCategory).category
                          }
                          index={i}
                          audioEnabled={audioEnabled}
                          onHoverChange={(hovered) =>
                            setHoveredIndex(hovered ? i : null)
                          }
                        />
                      ))}
                  </div>
                  {/* Row 2 — Horizontal / landscape cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {(videos as VideoItemWithCategory[])
                      .slice(3)
                      .map((video, i) => (
                        <VideoCard
                          key={`${activeCategory}-${video.embedUrl}-${i + 3}`}
                          video={video}
                          displayCategory={
                            (video as VideoItemWithCategory).category
                          }
                          index={i + 3}
                          audioEnabled={audioEnabled}
                          onHoverChange={(hovered) =>
                            setHoveredIndex(hovered ? i + 3 : null)
                          }
                        />
                      ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video, i) => (
                    <VideoCard
                      key={`${activeCategory}-${video.embedUrl}-${i}`}
                      video={video}
                      displayCategory={activeCategory}
                      index={i}
                      audioEnabled={audioEnabled}
                      onHoverChange={(hovered) =>
                        setHoveredIndex(hovered ? i : null)
                      }
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden section-grain section-vignette">
      {/* BG accent */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, oklch(0.72 0.12 78) 0%, transparent 70%)",
        }}
      />

      {/* Arcane warm blob */}
      <ArcaneGlow
        blobs={[
          {
            color: "oklch(0.75 0.16 75 / 3.5%)",
            top: "10%",
            left: "50%",
            width: "60vw",
            height: "55vh",
            duration: "18s",
            delay: "3s",
          },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section label — numbers removed */}
        <div className="reveal flex items-center gap-4 mb-16">
          <div className="gold-divider flex-1 max-w-16" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-wide">
            Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="gold-card bg-card p-8 relative"
              style={{ borderRadius: "4px" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              data-ocid={
                `testimonials.item.${i + 1}` as `testimonials.item.${1 | 2 | 3}`
              }
            >
              {/* Quote mark */}
              <span className="quote-mark" aria-hidden="true">
                "
              </span>

              {/* Quote */}
              <p className="font-body text-base text-foreground/80 leading-relaxed mb-6 relative z-10 mt-6">
                "{t.quote}"
              </p>

              {/* Divider */}
              <div className="gold-divider mb-4" />

              {/* Attribution */}
              <div>
                <p className="font-body font-semibold text-gold text-sm">
                  {t.name}
                </p>
                <p className="font-body text-xs text-muted-foreground tracking-wider mt-0.5">
                  {t.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
  const { actor } = useActor();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!actor) return;
      setIsSubmitting(true);
      setSubmitStatus("idle");

      try {
        await actor.submitContactForm(
          formData.name,
          formData.email,
          formData.message,
        );
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        toast.success("Message sent! I'll get back to you soon.", {
          style: {
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.72 0.12 78 / 40%)",
            color: "oklch(0.94 0.012 85)",
          },
        });
      } catch {
        setSubmitStatus("error");
        toast.error("Something went wrong. Please try again.", {
          style: {
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.58 0.22 27 / 60%)",
            color: "oklch(0.94 0.012 85)",
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [actor, formData],
  );

  return (
    <section
      id="contact"
      className="relative py-28 px-6 bg-[oklch(0.06_0_0)] overflow-hidden section-grain"
    >
      {/* BG grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.72 0.12 78) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.12 78) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Light leak */}
      <LightLeak opacity={0.7} />

      <div className="max-w-7xl mx-auto">
        {/* Section label — numbers removed */}
        <div className="reveal flex items-center gap-4 mb-16">
          <div className="gold-divider flex-1 max-w-16" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-wide">
            Contact
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div className="reveal">
            <p className="font-body text-lg text-foreground/80 leading-relaxed mb-10">
              Have a project in mind? Let's create something extraordinary
              together. Whether it's a cinematic film, brand commercial, or
              YouTube series — I'm ready to bring your vision to life.
            </p>

            {/* Contact details */}
            <div className="space-y-5">
              <a
                href="mailto:gaureditor@gmail.com"
                className="flex items-center gap-4 group"
                data-ocid="contact.email.link"
              >
                <div className="w-10 h-10 border border-[oklch(0.72_0.12_78/30%)] flex items-center justify-center group-hover:border-gold group-hover:bg-[oklch(0.72_0.12_78/10%)] transition-all duration-200">
                  <Mail size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-0.5">
                    Email
                  </p>
                  <p className="font-body text-sm text-foreground group-hover:text-gold transition-colors duration-200">
                    gaureditor@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/gaursesunooo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
                data-ocid="contact.instagram.link"
              >
                <div className="w-10 h-10 border border-[oklch(0.72_0.12_78/30%)] flex items-center justify-center group-hover:border-gold group-hover:bg-[oklch(0.72_0.12_78/10%)] transition-all duration-200">
                  <Instagram size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-0.5">
                    Instagram
                  </p>
                  <p className="font-body text-sm text-foreground group-hover:text-gold transition-colors duration-200">
                    @gaursesunooo
                  </p>
                </div>
              </a>
            </div>

            {/* Availability badge */}
            <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 border border-[oklch(0.72_0.12_78/30%)] text-sm text-gold-dim">
              <span
                className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                style={{ boxShadow: "0 0 6px rgba(74,222,128,0.6)" }}
              />
              <span className="font-body tracking-wider text-xs uppercase">
                Available for projects
              </span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="contact-name"
                  className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-2"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="cinema-input"
                  data-ocid="contact.name.input"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-2"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="cinema-input"
                  data-ocid="contact.email.input"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                  className="cinema-input resize-none"
                  data-ocid="contact.message.textarea"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gold text-background font-body text-sm uppercase tracking-[0.3em] font-semibold hover:bg-gold-glow disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2"
                style={{ borderRadius: "2px" }}
                data-ocid="contact.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

              {/* Status messages */}
              <AnimatePresence>
                {submitStatus === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 font-body text-sm text-center tracking-wide"
                    data-ocid="contact.success_state"
                  >
                    ✓ Message sent successfully!
                  </motion.p>
                )}
                {submitStatus === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 font-body text-sm text-center tracking-wide"
                    data-ocid="contact.error_state"
                  >
                    ✗ Failed to send. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="relative py-10 px-6 border-t border-[oklch(0.72_0.12_78/15%)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <span className="nav-logo-text" style={{ fontSize: "1.1rem" }}>
          Prince Gaur
        </span>

        {/* Copyright */}
        <p className="font-body text-xs text-muted-foreground tracking-wider text-center">
          © {year} Prince Gaur. All rights reserved. &nbsp;·&nbsp; Built with ❤
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-dim hover:text-gold transition-colors duration-200"
          >
            caffeine.ai
          </a>
        </p>

        {/* Social */}
        <a
          href="https://www.instagram.com/gaursesunooo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 border border-[oklch(0.72_0.12_78/30%)] flex items-center justify-center hover:border-gold hover:text-gold text-muted-foreground transition-all duration-200"
          aria-label="Instagram"
          data-ocid="footer.instagram.link"
        >
          <SiInstagram size={15} />
        </a>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  useScrollReveal();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  // On first real click anywhere, mark audio as enabled and hide the prompt
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      setShowAudioPrompt(false);
    };
    window.addEventListener("click", enableAudio, { once: true });
    return () => window.removeEventListener("click", enableAudio);
  }, []);

  return (
    <>
      <CinematicBackground />
      <CustomCursor />
      <Toaster position="bottom-right" />

      {/* One-time audio enable prompt */}
      <AnimatePresence>
        {showAudioPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.25rem",
                background: "oklch(0.1 0 0 / 85%)",
                border: "1px solid oklch(0.72 0.12 78 / 30%)",
                backdropFilter: "blur(12px)",
                borderRadius: "2px",
                color: "oklch(0.72 0.12 78 / 75%)",
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "oklch(0.72 0.12 78)",
                  animation: "grain 1s steps(1) infinite",
                  flexShrink: 0,
                }}
              />
              Click anywhere to enable audio
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky nav */}
      <Navigation />

      <main>
        <HeroSection />

        <FilmStripDivider />
        <AboutSection />

        <FilmStripDivider />
        <WorkSection audioEnabled={audioEnabled} />

        <FilmStripDivider />
        <TestimonialsSection />

        <FilmStripDivider />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const THEME_COLORS: Record<Theme, { bg: string; accent: string }> = {
  light: { bg: "#f1eada", accent: "#3d5c59" },
  dark: { bg: "#25272c", accent: "#6ec9c0" },
};

// When the theme actually flips (screen is fully covered by pixels)
const COMPLETE_AT = 880;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [transition, setTransition] = useState<{
    to: Theme;
    id: number;
    origin: { x: number; y: number };
  } | null>(null);
  const reduce = useReducedMotion();

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current);
    setMounted(true);
  }, []);

  const applyTheme = (next: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-switching");

    if (next === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }

    void root.offsetHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-switching");
      });
    });

    localStorage.setItem("theme", next);
    setTheme(next);
  };

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (reduce) {
      applyTheme(next);
      return;
    }

    // Measure the toggle button's center as a % of the viewport
    const rect = buttonRef.current?.getBoundingClientRect();
    const originX = rect ? ((rect.left + rect.width / 2) / window.innerWidth) * 100 : 92;
    const originY = rect ? ((rect.top + rect.height / 2) / window.innerHeight) * 100 : 6;

    setTransition({
      to: next,
      id: Date.now(),
      origin: { x: originX, y: originY },
    });
  };

  useEffect(() => {
    if (!transition) return;
    const timer = setTimeout(() => {
      applyTheme(transition.to);
      setTransition(null);
    }, COMPLETE_AT);
    return () => clearTimeout(timer);
  }, [transition]);

  if (!mounted) return <div className="h-5 w-5" aria-hidden="true" />;

  const colors = transition ? THEME_COLORS[transition.to] : THEME_COLORS[theme];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        disabled={!!transition}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="relative flex h-5 w-5 items-center justify-center transition-colors duration-200 disabled:opacity-60"
        style={{ color: "var(--color-foreground-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-foreground-muted)")}
      >
        <Sun
          size={16}
          strokeWidth={1.75}
          className="absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: theme === "dark" ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
            opacity: theme === "dark" ? 0 : 1,
          }}
        />
        <Moon
          size={16}
          strokeWidth={1.75}
          className="absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
            opacity: theme === "dark" ? 1 : 0,
          }}
        />
      </button>

      {createPortal(
        <>{transition && <PixelateOverlay key={transition.id} color={colors.bg} origin={transition.origin} />}</>,
        document.body,
      )}
    </>
  );
}

/* =========================================================
   PIXELATE OVERLAY
   ========================================================= */

function PixelateOverlay({ color, origin }: { color: string; origin: { x: number; y: number } }) {
  const isSmall = typeof window !== "undefined" && window.innerWidth < 768;

  const COLS = isSmall ? 30 : 45;
  const ROWS = isSmall ? 18 : 24;
  const CELL_W = 100 / COLS;
  const CELL_H = 100 / ROWS;

  const cells = useState(() => {
    const arr: { x: number; y: number; delay: number }[] = [];

    // Convert the toggle's % position into grid coordinates
    const originCol = (origin.x / 100) * COLS;
    const originRow = (origin.y / 100) * ROWS;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dx = c - originCol;
        const dy = r - originRow;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const jitter = Math.random() * 0.06;

        arr.push({
          x: c * CELL_W,
          y: r * CELL_H,
          delay: dist * 0.01 + jitter,
        });
      }
    }
    return arr;
  })[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-9999 overflow-hidden">
      <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.x}
            y={cell.y}
            width={CELL_W + 0.4}
            height={CELL_H + 0.4}
            fill={color}
            shapeRendering="crispEdges"
            className="pixel-cell"
            style={{ animationDelay: `${cell.delay}s` }}
          />
        ))}
      </motion.svg>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read the current theme from the DOM (set by inline script or default)
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);

    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", next);
  };

  // Placeholder during SSR to avoid layout shift
  if (!mounted) {
    return <div className="h-5 w-5" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="relative flex h-5 w-5 items-center justify-center transition-colors duration-200"
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
  );
}

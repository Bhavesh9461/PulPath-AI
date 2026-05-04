"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() =>
        setTheme(current === "dark" ? "light" : "dark")
      }
      className="h-10 w-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105"
      style={{
        background: "var(--card)",
        color: "var(--foreground)",
        borderColor: "var(--border)",
      }}
      aria-label="Toggle Theme"
    >
      {current === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
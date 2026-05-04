"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Ambulance,
  ArrowRight,
  Activity,
} from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Citizen", href: "/citizen" },
  { name: "Dispatcher", href: "/dispatcher" },
  { name: "Hospitals", href: "/hospital" },
  { name: "Admin", href: "/admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 md:px-5 pt-3">
      <nav
        className={`max-w-7xl mx-auto h-16 rounded-2xl border transition-all duration-300 ease-out ${
          scrolled
            ? "shadow-2xl scale-[0.995]"
            : "shadow-lg"
        }`}
        style={{
          background:
            "color-mix(in srgb, var(--card) 78%, transparent)",
          borderColor: "var(--border)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div
              className="relative h-11 w-11 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:rotate-6 group-hover:scale-105"
              style={{
                background: "var(--gradient-brand)",
              }}
            >
              <Ambulance
                size={18}
                className="text-white relative z-10"
              />

              <span className="absolute inset-0 bg-white/20 blur-xl scale-150 opacity-50" />
            </div>

            <div className="leading-tight">
              <h1 className="text-base md:text-lg font-semibold tracking-tight">
                PulsePath AI
              </h1>

              <p
                className="text-[11px] md:text-xs"
                style={{ color: "var(--muted)" }}
              >
                Smart Emergency Routing
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200"
                style={{
                  color: "var(--foreground)",
                }}
              >
                <span className="relative z-10">
                  {item.name}
                </span>

                {/* Smooth underline hover */}
                <span
                  className="absolute left-4 right-4 bottom-1 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg,var(--primary),var(--secondary))",
                  }}
                />
              </Link>
            ))}

            <div className="ml-2">
              <ThemeToggle />
            </div>

            <button
              className="ml-2 h-11 px-5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-xl active:scale-[0.98]"
              style={{
                background: "var(--gradient-danger)",
              }}
            >
              <Activity size={16} />
              Emergency
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setOpen(!open)}
              className="h-11 w-11 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-95"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          open
            ? "max-h-[500px] opacity-100 mt-3"
            : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div
          className="max-w-7xl mx-auto rounded-2xl border p-3 shadow-xl"
          style={{
            background:
              "color-mix(in srgb, var(--card) 90%, transparent)",
            borderColor: "var(--border)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:translate-x-1"
                style={{
                  background:
                    "color-mix(in srgb, var(--primary) 7%, var(--card))",
                  color: "var(--foreground)",
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                {item.name}
              </Link>
            ))}

            <button
              className="mt-2 h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]"
              style={{
                background: "var(--gradient-danger)",
              }}
            >
              Emergency
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
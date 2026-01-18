"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "RESEARCH", href: "#research" },
  { label: "PRODUCT", href: "#product" },
  { label: "STUDIOS", href: "#studios" },
  { label: "COMPANY", href: "#company" },
];

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-white text-xl font-medium tracking-tight">
          skillify
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-white/90 text-xs font-medium tracking-widest hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant="outline"
          className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white px-5 py-2 text-sm bg-transparent"
        >
          Get Started
        </Button>
      </nav>
    </header>
  );
}

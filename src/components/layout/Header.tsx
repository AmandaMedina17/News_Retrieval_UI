"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "../../data/mock";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4 md:py-6">
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>

          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              EL DIARIO <span className="text-primary">DIGITAL</span>
            </h1>
          </div>
        </div>

        <nav className="hidden md:block border-t border-border">
          <ul className="flex items-center justify-center gap-8 py-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card">
          <ul className="divide-y divide-border">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

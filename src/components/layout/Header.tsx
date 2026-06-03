"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { navItems } from "../../data/mock";

interface HeaderProps {
  user?: string | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
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

          {/* Área de usuario (solo visible en desktop y si está logueado) */}
          {user && (
            <div className="hidden md:flex items-center gap-4 ml-4">
              <span className="text-sm text-muted-foreground">
                Hola, <span className="font-medium text-foreground">{user}</span>
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menú móvil */}
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
            {/* Opción de cerrar sesión en móvil si está logueado */}
            {user && (
              <li>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión ({user})
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
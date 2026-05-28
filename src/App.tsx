"use client";

import { useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { NewsGrid } from "./components/ui/NewsGrid";
import { AuthCard } from "./components/sections/AuthCard";
import { useSearch } from "./hooks/useSearch";
import fondo from "./components/sections/periodico.jpg";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const { query, setQuery, news, isLoading, hasSearched, handleSearch } = useSearch();

  const handleLogin = (username: string) => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setUser(username);
      setIsLeaving(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const bgUrl = fondo && typeof fondo === "object" && "src" in fondo ? fondo : fondo;

  return (
    <>
      {/* Fondo fijo con imagen y overlay */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {!isLoggedIn ? (
          <div
            className={`flex min-h-screen items-center justify-center px-4 py-12 transition-all duration-500 ease-out ${
              isLeaving ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <AuthCard onLogin={handleLogin} />
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <div className="min-h-screen flex flex-col bg-transparent">
              <Header user={user} onLogout={handleLogout} />
              <main className="flex-1">
                <HeroSection
                  query={query}
                  setQuery={setQuery}
                  onSearch={(term?: string) => handleSearch(term)}
                  isLoading={isLoading}
                />

                {/* Sección de noticias con fondo blanco */}
                <section className="w-full bg-muted py-10 md:py-14 mt-0 rounded-t-lg">
                  <div className="max-w-7xl mx-auto px-4">
                    {hasSearched && (
                      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                        <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                          Resultados: <span className="text-primary">{query}</span>
                        </h2>
                        {!isLoading && news.length > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {news.length}{" "}
                            {news.length === 1
                              ? "artículo encontrado"
                              : "artículos encontrados"}
                          </span>
                        )}
                      </div>
                    )}
                    <NewsGrid
                      news={news}
                      isLoading={isLoading}
                      hasSearched={hasSearched}
                      user={user}
                      currentQuery={query}
                    />
                  </div>
                </section>
              </main>
              <Footer />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}
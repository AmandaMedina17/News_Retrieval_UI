"use client";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { NewsGrid } from "./components/ui/NewsGrid";
import { useSearch } from "./hooks/useSearch";

export default function App() {
  const { query, setQuery, news, isLoading, hasSearched, handleSearch } =
    useSearch();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <HeroSection
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <section className="w-full px-4 py-10 md:py-14">
          <div className="max-w-7xl mx-auto">
            {hasSearched && (
              <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                  Resultados: <span className="text-primary">{query}</span>
                </h2>
                {!isLoading && news.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {news.length}{" "}
                    {news.length === 1
                      ? "articulo encontrado"
                      : "articulos encontrados"}
                  </span>
                )}
              </div>
            )}

            <NewsGrid
              news={news}
              isLoading={isLoading}
              hasSearched={hasSearched}
            />
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

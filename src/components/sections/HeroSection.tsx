"use client";

import { SearchBar } from "../ui/SearchBar";
import { categories } from "../../data/mock";

interface HeroSectionProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  isRefined?: boolean;
}

export function HeroSection({
  query,
  setQuery,
  onSearch,
  isLoading,
  isRefined = false,
}: HeroSectionProps) {
  const handleCategoryClick = (category: string) => {
    setQuery(category);
    onSearch(category);
  };

  return (
    <section className="relative w-full text-card py-10 md:py-14">
      {/* Contenido por encima del overlay (el overlay ya está en App.tsx) */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-card/60 font-medium">
            Buscador de noticias
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-card text-balance leading-tight">
            Encuentra la información que necesitas
          </h2>
          <p className="text-card/70 text-base md:text-lg max-w-2xl mx-auto">
            Accede a miles de noticias de fuentes verificadas. Resultados
            actualizados en tiempo real.
          </p>
        </div>

        <div className="pt-2">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={onSearch}
            isLoading={isLoading}
            buttonText={isRefined ? "Refinar búsqueda" : "Buscar"}
          />
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
          <span className="text-xs text-card/50 uppercase tracking-wide">
            Categorias:
          </span>
          {categories.map((tag) => (
            <button
              key={tag}
              onClick={() => handleCategoryClick(tag)}
              className="px-3 py-1.5 text-xs font-medium border border-card/20 text-card/80 hover:bg-card hover:text-foreground transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import { SearchX } from "lucide-react";
import { NewsCard } from "./NewsCard";
import type { NewsItem } from "../../types";

interface NewsGridProps {
  news: NewsItem[];
  isLoading: boolean;
  hasSearched: boolean;
}

export function NewsGrid({ news, isLoading, hasSearched }: NewsGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-card border border-border overflow-hidden animate-pulse">
          <div className="h-72 md:h-96 bg-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 bg-muted" />
                <div className="h-5 bg-muted w-full" />
                <div className="h-5 bg-muted w-3/4" />
                <div className="h-4 bg-muted w-full" />
                <div className="h-4 bg-muted w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hasSearched && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-border bg-card">
        <div className="w-16 h-16 border-2 border-border flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
          Sin resultados
        </h3>
        <p className="text-muted-foreground text-sm max-w-md">
          No se encontraron noticias para tu busqueda. Intenta con otros
          terminos o revisa la ortografia.
        </p>
      </div>
    );
  }

  if (!hasSearched) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item, index) => (
        <NewsCard key={item.id} news={item} index={index} variant="standard" />
      ))}
    </div>
  );
}

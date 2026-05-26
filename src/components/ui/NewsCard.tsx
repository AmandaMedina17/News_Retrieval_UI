"use client";

import { Clock, ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";
import { typeStyles, typeLabels } from "../../data/mock";
import type { NewsItem } from "../../types";

// 🔹 Función auxiliar para formatear fecha
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',   // 'short' da "nov", 'long' da "noviembre"
    year: 'numeric',
  };
  let formatted = date.toLocaleDateString('es-ES', options);
  // Capitalizar primera letra del mes (opcional)
  formatted = formatted.replace(/^\w/, (c) => c.toUpperCase());
  return formatted;
}

interface NewsCardProps {
  news: NewsItem;
  index: number;
  variant?: "featured" | "standard" | "compact";
}

export function NewsCard({ news, index, variant = "compact" }: NewsCardProps) {
  const animationStyle = {
    animationDelay: `${index * 50}ms`,
    animation: "fadeInUp 0.4s ease-out forwards",
    opacity: 0,
  };

  // Variante destacada (no cambiamos el orden, solo aplicamos formato fecha)
  if (variant === "featured") {
    return (
      <article
        className="group relative bg-card border border-border overflow-hidden p-6"
        style={animationStyle}
      >
        <div className="flex items-center gap-3 mb-3">
          {news.type !== "normal" && (
            <span
              className={cn(
                "px-2 py-1 text-xs font-bold uppercase tracking-wide",
                typeStyles[news.type],
              )}
            >
              {typeLabels[news.type]}
            </span>
          )}
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3 line-clamp-3 leading-tight">
          {news.title}
        </h3>

        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {news.source}
        </span>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed max-w-2xl">
          {news.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="w-3.5 h-3.5" />
            <time>{formatDate(news.date)}</time>
          </div>
          {news.url && (
            <a
              href={news.url}
              className="flex items-center gap-1.5 text-primary text-xs font-medium hover:gap-2.5 transition-all"
            >
              Leer noticia completa
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </article>
    );
  }

  // Variante compacta (solo ajustamos formato fecha)
  if (variant === "compact") {
    return (
      <article
        className="group flex flex-col py-4 border-b border-border last:border-b-0"
        style={animationStyle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {news.source}
            </span>
            {news.type !== "normal" && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-bold uppercase",
                  typeStyles[news.type],
                )}
              >
                {typeLabels[news.type]}
              </span>
            )}
          </div>
          <h3 className="font-serif text-base font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            <a href={news.url || "#"}>{news.title}</a>
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="w-3 h-3" />
            <time>{formatDate(news.date)}</time>
          </div>
        </div>
      </article>
    );
  }

  // Cambiamos el orden: título → fuente → contenido → fecha
  return (
    <button
      type="button"
      onClick={() => news.url && window.open(news.url, "_blank")}
      className="group flex flex-col h-full w-full text-left bg-card border border-border overflow-hidden hover:shadow-md hover:border-primary transition-all cursor-pointer p-4"
      style={animationStyle}
    >
      {/* Título primero */}
      <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
        {news.title}
      </h3>

      {/* Fuente (y tipo si no es normal) entre título y contenido */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-primary uppercase tracking-wide">
          {news.source}
        </span>
        {news.type !== "normal" && (
          <span
            className={cn(
              "px-1.5 py-0.5 text-[10px] font-bold uppercase",
              typeStyles[news.type],
            )}
          >
            {typeLabels[news.type]}
          </span>
        )}
      </div>

      {/* Contenido (excerpt) */}
      <p className="text-muted-foreground text-sm mb-3 line-clamp-3 leading-relaxed flex-1">
        {news.excerpt}
      </p>

      {/* Fecha y enlace */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="w-3.5 h-3.5" />
          <time>{formatDate(news.date)}</time>
        </div>
        <span className="flex items-center gap-1 text-foreground text-xs font-medium group-hover:text-primary transition-colors">
          Leer más
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
}
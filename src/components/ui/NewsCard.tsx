"use client";

import { Clock, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "../../utils/cn";
import { typeStyles, typeLabels } from "../../data/mock";
import type { NewsItem } from "../../types";
import { useState } from "react";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  let formatted = date.toLocaleDateString('es-ES', options);
  formatted = formatted.replace(/^\w/, (c) => c.toUpperCase());
  return formatted;
}

interface NewsCardProps {
  news: NewsItem;
  index: number;
  variant?: "featured" | "standard" | "compact";
  user?: string | null;
  currentQuery?: string;
}

export function NewsCard({ news, index, variant = "compact", user, currentQuery }: NewsCardProps) {
  const animationStyle = {
    animationDelay: `${index * 50}ms`,
    animation: "fadeInUp 0.4s ease-out forwards",
    opacity: 0,
  };

  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);
  const [animateLike, setAnimateLike] = useState(false);
  const [animateDislike, setAnimateDislike] = useState(false);

  // Función para enviar feedback al backend
  const sendFeedback = async (rating: boolean) => {
    if (!user) return;
    try {
      const response = await fetch('http://127.0.0.1:5000/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user,
          query: currentQuery || '',
          chunk_id: news.url,
          chunk_content: `${news.title} - ${news.excerpt}`,
          rating: rating
        })
      });
      if (!response.ok) throw new Error('Error al enviar feedback');
      console.log('Feedback enviado correctamente');
    } catch (error) {
      console.error('Error al enviar feedback:', error);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 200);

    if (reaction === 'like') {
      setReaction(null);
      // Opcional: enviar neutral (si el backend soporta eliminación)
    } else {
      setReaction('like');
      sendFeedback(true);
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimateDislike(true);
    setTimeout(() => setAnimateDislike(false), 200);

    if (reaction === 'dislike') {
      setReaction(null);
    } else {
      setReaction('dislike');
      sendFeedback(false);
    }
  };

  // Variante destacada
  if (variant === "featured") {
    return (
      <article
        className="group relative bg-card border border-border overflow-hidden p-6"
        style={animationStyle}
      >
        <div className="flex items-center gap-3 mb-3">
          {news.type !== "normal" && (
            <span className={cn("px-2 py-1 text-xs font-bold uppercase tracking-wide", typeStyles[news.type])}>
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
            <a href={news.url} className="flex items-center gap-1.5 text-primary text-xs font-medium hover:gap-2.5 transition-all">
              Leer noticia completa
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </article>
    );
  }

  // Variante compacta
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
              <span className={cn("px-1.5 py-0.5 text-[10px] font-bold uppercase", typeStyles[news.type])}>
                {typeLabels[news.type]}
              </span>
            )}
          </div>
          <h3 className="font-serif text-base font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            <a href={news.url || "#"}>{news.title}</a>
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock className="w-3 h-3" />
              <time>{formatDate(news.date)}</time>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleLike}
                className={`transition-transform ${animateLike ? 'scale-125' : ''} ${reaction === 'like' ? 'text-green-500' : 'text-muted-foreground'} hover:text-green-500`}
                aria-label="Me gusta"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDislike}
                className={`transition-transform ${animateDislike ? 'scale-125' : ''} ${reaction === 'dislike' ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
                aria-label="No me gusta"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variante standard
  return (
    <button
      type="button"
      onClick={() => news.url && window.open(news.url, "_blank")}
      className="group flex flex-col h-full w-full text-left bg-card border border-border overflow-hidden hover:shadow-md hover:border-primary transition-all cursor-pointer p-4"
      style={animationStyle}
    >
      <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
        {news.title}
      </h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-primary uppercase tracking-wide">
          {news.source}
        </span>
        {news.type !== "normal" && (
          <span className={cn("px-1.5 py-0.5 text-[10px] font-bold uppercase", typeStyles[news.type])}>
            {typeLabels[news.type]}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-3 line-clamp-3 leading-relaxed flex-1">
        {news.excerpt}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <time>{formatDate(news.date)}</time>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleLike}
              className={`transition-transform ${animateLike ? 'scale-125' : ''} ${reaction === 'like' ? 'text-green-500' : 'text-muted-foreground'} hover:text-green-500`}
              aria-label="Me gusta"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDislike}
              className={`transition-transform ${animateDislike ? 'scale-125' : ''} ${reaction === 'dislike' ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
              aria-label="No me gusta"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="flex items-center gap-1 text-foreground text-xs font-medium group-hover:text-primary transition-colors">
          Leer más
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
}
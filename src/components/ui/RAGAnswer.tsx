"use client";

import { Sparkles, Loader2 } from "lucide-react";

interface RAGAnswerProps {
  answer: string | null;
  sources: Array<{
    id: string;
    title: string;
    url: string;
    source: string;
    published_date: string;
    score: number;
    snippet: string;
  }>;
  isLoading: boolean;
}

export function RAGAnswer({ answer, sources, isLoading }: RAGAnswerProps) {
  // Mientras carga, solo un spinner (sin cuadro, sin texto)
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no hay respuesta (y no está cargando), no mostrar nada
  if (!answer) return null;

  // Respuesta lista → mostrar cuadro completo
  return (
    <div className="mb-8 bg-card border border-border rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="bg-primary-dark px-4 py-2 border-b border-border flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-white" />
        <span className="text-xs font-semibold uppercase tracking-wide text-white">
          Respuesta inteligente
        </span>
      </div>
      <div className="p-4">
        <div className="prose prose-sm max-w-none text-foreground mb-3">
          {answer.split('\n').map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed">{paragraph}</p>
          ))}
        </div>
        {sources.length > 0 && (
          <details className="text-xs text-muted-foreground mt-2">
            <summary className="cursor-pointer hover:text-primary transition-colors">
              Fuentes utilizadas ({sources.length})
            </summary>
            <ul className="mt-2 space-y-1 pl-4">
              {sources.map((src, idx) => (
                <li key={idx}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {src.title} – {src.source}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
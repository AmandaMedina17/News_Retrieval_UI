// src/components/ui/RecommendationsGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { NewsCard } from "./NewsCard";
import type { NewsItem } from "../../types";
import { config } from "./../../config/index";

interface RecommendationsGridProps {
  user: string | null; // solo para mostrar el nombre, no se envía al backend
  token: string | null;
}

export function RecommendationsGrid({ user, token }: RecommendationsGridProps) {
  const [recommendations, setRecommendations] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user === "Invitado") {
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        
        const response = await fetch(          
        `${config.apiBaseUrl}/recommend/for-user?max_results=10&include_likes=true&include_queries=true&query_weight=0.3`, 
          {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Recomendaciones recibidas:", data);

        const newsItems: NewsItem[] = data.recommended_docs.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          source: doc.source,
          date: doc.published_date,
          excerpt: doc.snippet,
          url: doc.url,
          imageUrl: undefined,
          type: "normal",
          relevance: doc.score,
        }));
        setRecommendations(newsItems);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("No se pudieron cargar las recomendaciones.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [token, user]); // Dependencia solo token y user (para invitado)

  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">
          Cargando recomendaciones...
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 rounded-lg p-4 animate-pulse h-48"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="mb-10 text-white/70 text-center">{error}</div>;
  }

  if (recommendations.length === 0) {
    return (
      <div className="mb-10 text-center text-white/60">
        <p>Aún no hay recomendaciones personalizadas.</p>
        <p className="text-sm">
          Da like a noticias o realiza búsquedas para recibir sugerencias.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">
        Recomendaciones para ti
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, index) => (
          <NewsCard
            key={item.id}
            news={item}
            index={index}
            variant="standard"
            user={user}
            currentQuery=""
            token={token}
          />
        ))}
      </div>
    </div>
  );
}

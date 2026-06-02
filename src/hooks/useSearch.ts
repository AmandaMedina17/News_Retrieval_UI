import { useState, useCallback } from "react";
import type { NewsItem } from "../types";
import { config } from "../config";

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  news: NewsItem[];
  isLoading: boolean;
  hasSearched: boolean;
  handleSearch: (searchQuery?: string) => Promise<void>;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (searchQuery?: string) => {
      const finalQuery = (searchQuery ?? query).trim();
      if (!finalQuery.trim()) return;
      setIsLoading(true);
      setHasSearched(true);

      try {
        const response = await fetch(
          `${config.apiBaseUrl}/hybrid/web?q=${encodeURIComponent(finalQuery)}&k=12`,
        );
        const data = await response.json();

        const articles = data.results || [];

        const newsItems: NewsItem[] = articles.map((item: any) => ({
          id: item.id,
          title: item.title,
          source: item.source,
          date: item.published_date,
          excerpt: item.snippet,
          url: item.url,
          imageUrl: undefined,
          type: "normal",
          relevance: item.score,
        }));
        setNews(newsItems);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    },
    [query],
  );

  return { query, setQuery, news, isLoading, hasSearched, handleSearch };
}

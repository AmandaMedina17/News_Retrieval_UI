import { useState, useCallback } from "react";
import type { NewsItem } from "../types";

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  news: NewsItem[];
  isLoading: boolean;
  hasSearched: boolean;
  handleSearch: () => Promise<void>;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search/sparse?q=${encodeURIComponent(query)}&k=10`,
      );
      const data = await response.json();

      const newsItems: NewsItem[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        source: item.source,
        date: item.date,
        excerpt: item.excerpt,
        url: item.url,
        type: "normal" as const,
        relevance: Math.round((item.relevance || 0) * 100),
        imageUrl: undefined,
      }));

      setNews(newsItems);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return { query, setQuery, news, isLoading, hasSearched, handleSearch };
}

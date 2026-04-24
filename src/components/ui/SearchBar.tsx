"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchBar({
  query,
  setQuery,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar noticias, temas, eventos..."
            className="w-full pl-12 pr-4 py-3.5 text-base bg-card border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-[52px] px-6 rounded-none text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            "Buscar"
          )}
        </button>
      </div>
    </form>
  );
}

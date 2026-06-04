"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { NewsGrid } from "./components/ui/NewsGrid";
import { AuthCard } from "./components/sections/AuthCard";
import fondo from "./components/sections/periodico.jpg";
import { RAGAnswer } from "./components/ui/RAGAnswer";
import { RecommendationsGrid } from "./components/ui/RecommendationGrid";
import type { NewsItem } from "./types";
import { config } from "./config/config";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // Estados para búsqueda
  const [query, setQuery] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Estados para RAG
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [ragSources, setRagSources] = useState<any[]>([]);
  const [ragLoading, setRagLoading] = useState(false);

  // Estados para refinamiento
  const [refinedQuery, setRefinedQuery] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);

  // Verificar sesión guardada al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username: string, accessToken: string) => {
    setToken(accessToken);
    setUser(username);
    setIsLeaving(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLeaving(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    window.location.reload();
  };

  // Refinamiento cuando el usuario da like
  const handleRefine = async (originalQuery: string, chunkContent: string) => {
    if (!originalQuery || !chunkContent) return;
    console.log("Refinando con:", originalQuery, chunkContent);
    try {
      const refineResponse = await fetch(`${config.apiBaseUrl}/feedback/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_query: originalQuery,
          chunk_contents: [chunkContent],
        }),
      });
      const refineData = await refineResponse.json();
      console.log("Respuesta del refinamiento:", refineData);
      if (!refineResponse.ok) throw new Error("Error en refinamiento");
      const expandedQuery = refineData.expanded_query;
      if (expandedQuery) {
        console.log("Consulta expandida:", expandedQuery);
        setRefinedQuery(expandedQuery);
        setHasLiked(true);
      } else {
        console.warn("No se recibió expanded_query");
      }
    } catch (err) {
      console.error("Error refining query:", err);
    }
  };

  // Búsqueda normal (con la consulta actual de la barra)
  const orchestratedSearch = async (searchTerm?: string) => {
    const finalQuery = (searchTerm ?? query).trim();
    if (!finalQuery) return;

    if (!searchTerm || searchTerm === query) {
      setQuery(finalQuery);
    }
    setHasSearched(true);
    setRagAnswer(null);
    setRagSources([]);
    setRagLoading(true);
    setNewsLoading(true);
    setNews([]);

    try {
      // Construir URL sin user_id si el usuario es Invitado
      let url = `${config.apiBaseUrl}/rag/?q=${encodeURIComponent(finalQuery)}&k=${config.searchLimit}`;
      if (user && user !== "Invitado") {
        url += `&user_id=${encodeURIComponent(user)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setRagAnswer(data.answer);
      setRagSources(data.sources || []);
      const newsItems: NewsItem[] = (data.sources || []).map((item: any) => ({
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
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setRagAnswer("No se pudo generar la respuesta automática.");
      setNews([]);
    } finally {
      setRagLoading(false);
      setNewsLoading(false);
    }
  };

  // Búsqueda con la consulta refinada (el botón "Mejorar búsqueda")
  const searchWithRefined = async () => {
    if (refinedQuery) {
      // Realizamos la búsqueda con la consulta refinada SIN cambiar la barra
      await orchestratedSearch(refinedQuery);
      // Reseteamos el estado para que el botón se deshabilite hasta nuevos likes
      setHasLiked(false);
      setRefinedQuery(null);
    }
  };

  // Cuando el usuario modifica manualmente la barra, reseteamos el refinamiento
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (hasLiked) {
      setHasLiked(false);
      setRefinedQuery(null);
    }
  };

  const bgUrl = fondo && typeof fondo === "object" && "src" in fondo ? fondo : fondo;
  const isSearching = ragLoading || newsLoading;
  const showRAG = ragLoading || ragAnswer !== null;

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        {!isLoggedIn ? (
          <div
            className={`flex min-h-screen items-center justify-center px-4 py-12 transition-all duration-500 ease-out ${
              isLeaving ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <AuthCard onLogin={handleLogin} />
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <div className="min-h-screen flex flex-col bg-transparent">
              <Header user={user} onLogout={handleLogout} />
              <main className="flex-1">
                <HeroSection
                  query={query}
                  setQuery={handleQueryChange}
                  onSearch={orchestratedSearch}
                  isLoading={isSearching}
                />

                {/* Cartel de sugerencia y botón de mejora */}
                {hasSearched && (
                  <div className="w-full px-4 max-w-7xl mx-auto mt-2 mb-4">
                    <div className="bg-transparent backdrop-blur-sm border border-white rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-white text-sm">
                        💡 Si deseas mejorar tu búsqueda, da "like" o "dislike" a las noticias.
                      </p>
                      <button
                        onClick={searchWithRefined}
                        disabled={!hasLiked || !refinedQuery}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                          hasLiked && refinedQuery
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                            : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                        }`}
                      >
                        Mejorar búsqueda
                      </button>
                    </div>
                  </div>
                )}

                {!hasSearched && user && token && (
                  <div className="w-full px-4 max-w-7xl mx-auto">
                    <RecommendationsGrid user={user} token={token} />
                  </div>
                )}

                <section className="w-full bg-transparent py-10 md:py-14 mt-0">
                  <div className="max-w-7xl mx-auto px-4">
                    {hasSearched && (
                      <div className="mb-6 flex items-center justify-between border-b border-white/20 pb-4">
                        <h2 className="font-serif text-xl md:text-2xl font-bold text-white">
                          Resultados: <span className="text-primary">{query}</span>
                        </h2>
                        {!newsLoading && news.length > 0 && (
                          <span className="text-sm text-white/70">
                            {news.length}{" "}
                            {news.length === 1
                              ? "artículo encontrado"
                              : "artículos encontrados"}
                          </span>
                        )}
                      </div>
                    )}

                    {showRAG && (
                      <RAGAnswer
                        answer={ragAnswer}
                        sources={ragSources}
                        isLoading={ragLoading}
                      />
                    )}

                    <NewsGrid
                      news={news}
                      isLoading={newsLoading}
                      hasSearched={hasSearched}
                      user={user}
                      currentQuery={query}
                      token={token}
                      onRefine={handleRefine}
                    />
                  </div>
                </section>
              </main>
              <Footer />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}
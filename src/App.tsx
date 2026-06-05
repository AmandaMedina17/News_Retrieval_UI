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

  // Estados para refinamiento (acumulador de likes)
  const [likedChunks, setLikedChunks] = useState<string[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

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

  // Cuando el usuario da like: acumulamos el contenido y habilitamos botón
  const handleLikeFeedback = (chunkContent: string) => {
    setLikedChunks(prev => [...prev, chunkContent]);
    setHasLiked(true);
  };

  // Refinamiento al hacer clic en el botón "Mejorar búsqueda"
  const refineAndSearch = async () => {
    if (likedChunks.length === 0 || isRefining) return;

    // Activar estados de carga 
    setIsRefining(true);
    setHasSearched(true);
    setRagAnswer(null);
    setRagSources([]);
    setRagLoading(true);
    setNewsLoading(true);
    setNews([]);

    try {
      const response = await fetch(`${config.apiBaseUrl}/feedback/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_query: query,
          chunk_contents: likedChunks,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      // data tiene la forma RAGResponseSchema: { query, answer, sources }
      setRagAnswer(data.answer);
      setRagSources(data.sources || []);

      // Convertir sources a NewsItem[]
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
      console.error("Error en refinamiento:", err);
      setRagAnswer("No se pudo mejorar la búsqueda.");
      setNews([]);
    } finally {
      setRagLoading(false);
      setNewsLoading(false);
      setLikedChunks([]);
      setHasLiked(false);
      setIsRefining(false);
    }
  };

  // Búsqueda normal (con la consulta actual de la barra o la expandida)
  const orchestratedSearch = async (searchTerm?: string) => {
    const finalQuery = (searchTerm ?? query).trim();
    if (!finalQuery) return;

    // Si el término es diferente al de la barra, no actualizamos la barra (búsqueda refinada)
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

  // Cuando el usuario modifica manualmente la barra, reseteamos el refinamiento
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (hasLiked || likedChunks.length > 0) {
      setLikedChunks([]);
      setHasLiked(false);
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
                        ⚖️ Valore la relevancia de los artículos mediante el botón de aprobación.
                        Sus valoraciones se emplearán para refinar los resultados de búsqueda.
                      </p>
                      <button
                        onClick={refineAndSearch}
                        disabled={!hasLiked || likedChunks.length === 0 || isRefining}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                          hasLiked && likedChunks.length > 0 && !isRefining
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                            : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                        }`}
                      >
                        {isRefining ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Optimizando...
                          </>
                        ) : (
                          "Optimizar consulta"
                        )}
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
                      onLike={handleLikeFeedback}
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
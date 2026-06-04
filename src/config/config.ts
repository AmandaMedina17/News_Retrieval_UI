export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:8000',
  searchLimit: Number(import.meta.env.VITE_SEARCH_LIMIT) || 9,
};
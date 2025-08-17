// API configuration for VeganMapAI
export const API_BASE = import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1';

// Build configuration
export const BUILD_VERSION = import.meta.env.VITE_BUILD_SHA || Date.now().toString();

// Environment helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API endpoints
export const API_ENDPOINTS = {
  healthz: `${API_BASE}/healthz`,
  version: `${API_BASE}/version`,
  mapData: `${API_BASE}/map-data`,
  geocode: `${API_BASE}/geocode`,
  restaurants: `${API_BASE}/restaurants`,
  favorites: `${API_BASE}/favorites`,
  userStats: `${API_BASE}/user/stats`,
  userPreferences: `${API_BASE}/user/preferences`
} as const;
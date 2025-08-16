import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { SearchParamsSchema, type SearchParams } from '@shared/searchSchema';

// URL synchronization hook for search parameters
export function useSearchParams() {
  const [location, setLocation] = useLocation();
  
  const parseParamsFromUrl = useCallback((): SearchParams => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    
    // Convert URLSearchParams to plain object
    const params: Record<string, any> = {};
    
    searchParams.forEach((value, key) => {
      // Handle arrays (cuisines, allergens)
      if (key === 'cuisines' || key === 'allergens') {
        params[key] = value.split(',').filter(Boolean);
      } 
      // Handle numbers
      else if (['minScore', 'maxScore', 'priceMin', 'priceMax', 'maxDistanceKm', 'lat', 'lng', 'page', 'limit'].includes(key)) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          params[key] = numValue;
        }
      }
      // Handle strings
      else {
        params[key] = value;
      }
    });
    
    try {
      return SearchParamsSchema.parse(params);
    } catch (error) {
      console.warn('Invalid URL search params:', error);
      return SearchParamsSchema.parse({});
    }
  }, []);

  const [searchParams, setSearchParams] = useState<SearchParams>(parseParamsFromUrl);

  // Update state when URL changes (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(parseParamsFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseParamsFromUrl]);

  const updateSearchParams = useCallback((newParams: SearchParams) => {
    setSearchParams(newParams);
    
    // Update URL
    const url = new URL(window.location.href);
    url.search = ''; // Clear existing params
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            url.searchParams.set(key, value.join(','));
          }
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });
    
    // Update URL without triggering navigation
    const newUrl = url.pathname + url.search;
    if (newUrl !== location) {
      window.history.pushState(null, '', newUrl);
      setLocation(newUrl);
    }

    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search_params_changed', {
        event_category: 'search',
        search_term: newParams.q || '',
        filters_count: Object.keys(newParams).filter(key => 
          newParams[key as keyof SearchParams] !== undefined &&
          newParams[key as keyof SearchParams] !== null &&
          newParams[key as keyof SearchParams] !== '' &&
          key !== 'q'
        ).length
      });
    }
  }, [location, setLocation]);

  const resetSearchParams = useCallback(() => {
    const defaultParams = SearchParamsSchema.parse({});
    updateSearchParams(defaultParams);
  }, [updateSearchParams]);

  return {
    searchParams,
    updateSearchParams,
    resetSearchParams
  };
}
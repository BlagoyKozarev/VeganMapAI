import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type SearchParams, type SearchResult } from '@shared/searchSchema';

// Debounced search hook with caching and analytics
export function useAdvancedSearch(params: SearchParams) {
  const [debouncedParams, setDebouncedParams] = useState<SearchParams>(params);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search parameters changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedParams(params);
    }, 300); // 300ms debounce for text search

    return () => clearTimeout(timeoutId);
  }, [params]);

  // Search query with TanStack Query for caching
  const searchQuery = useQuery({
    queryKey: ['search', debouncedParams],
    queryFn: async (): Promise<SearchResult> => {
      setIsSearching(true);
      
      try {
        const searchParams = new URLSearchParams();
        
        Object.entries(debouncedParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              if (value.length > 0) {
                searchParams.set(key, value.join(','));
              }
            } else {
              searchParams.set(key, String(value));
            }
          }
        });

        const response = await fetch(`/api/search?${searchParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }

        const result: SearchResult = await response.json();
        
        // Analytics tracking for successful search
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'search_submitted', {
            event_category: 'search',
            search_term: debouncedParams.q || '',
            results_count: result.total,
            took_ms: result.took_ms,
            filters: Object.keys(debouncedParams).filter(key => 
              debouncedParams[key as keyof SearchParams] !== undefined &&
              debouncedParams[key as keyof SearchParams] !== null &&
              debouncedParams[key as keyof SearchParams] !== ''
            ).join(',')
          });
        }

        return result;
      } catch (error) {
        // Analytics tracking for failed search
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'search_error', {
            event_category: 'search',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        
        throw error;
      } finally {
        setIsSearching(false);
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors
      if (failureCount < 2 && error instanceof Error) {
        return error.message.includes('fetch') || error.message.includes('network');
      }
      return false;
    }
  });

  // Load more results (pagination)
  const loadMore = useCallback(() => {
    if (searchQuery.data && debouncedParams.page < searchQuery.data.pages) {
      const nextPage = debouncedParams.page + 1;
      setDebouncedParams((prev: SearchParams) => ({ ...prev, page: nextPage }));
      
      // Analytics tracking for pagination
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pagination_changed', {
          event_category: 'search',
          page: nextPage,
          limit: debouncedParams.limit
        });
      }
    }
  }, [searchQuery.data, debouncedParams.page, debouncedParams.limit]);

  // Refresh search results
  const refresh = useCallback(() => {
    searchQuery.refetch();
  }, [searchQuery]);

  return {
    data: searchQuery.data,
    error: searchQuery.error,
    isLoading: searchQuery.isLoading || isSearching,
    isFetching: searchQuery.isFetching,
    isError: searchQuery.isError,
    loadMore,
    refresh,
    hasNextPage: searchQuery.data ? debouncedParams.page < searchQuery.data.pages : false
  };
}
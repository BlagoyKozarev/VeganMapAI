import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Restaurant, SearchFilters, GeolocationPosition } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useNearbyRestaurants(location: GeolocationPosition | null, radius?: number) {
  return useQuery({
    queryKey: ['/api/restaurants/nearby', location?.lat, location?.lng, radius],
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['/api/restaurants', id],
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSearchRestaurants() {
  return useMutation({
    mutationFn: async ({
      query,
      location,
      filters,
      limit,
    }: {
      query?: string;
      location?: GeolocationPosition;
      filters?: SearchFilters;
      limit?: number;
    }) => {
      const params = new URLSearchParams();
      
      if (query) params.append('q', query);
      if (location) {
        params.append('lat', location.lat.toString());
        params.append('lng', location.lng.toString());
      }
      if (filters?.minVeganScore) params.append('minScore', filters.minVeganScore.toString());
      if (filters?.maxDistance) params.append('maxDistance', filters.maxDistance.toString());
      if (filters?.priceRange) params.append('priceRange', filters.priceRange.join(','));
      if (filters?.cuisineTypes) params.append('cuisineTypes', filters.cuisineTypes.join(','));
      if (limit) params.append('limit', limit.toString());

      const response = await apiRequest('GET', `/api/search/restaurants?${params}`);
      return response.json();
    },
  });
}

export function useSearchSuggestions() {
  return useMutation({
    mutationFn: async ({
      query,
      location,
    }: {
      query: string;
      location?: GeolocationPosition;
    }) => {
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (location) {
        params.append('lat', location.lat.toString());
        params.append('lng', location.lng.toString());
      }

      const response = await apiRequest('GET', `/api/search/suggestions?${params}`);
      return response.json();
    },
  });
}

export function useFavoriteRestaurant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (restaurantId: string) => {
      const response = await apiRequest('POST', '/api/favorites', { restaurantId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: 'Added to Favorites',
        description: 'Restaurant has been added to your favorites.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add restaurant to favorites.',
        variant: 'destructive',
      });
    },
  });
}

export function useUnfavoriteRestaurant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (restaurantId: string) => {
      const response = await apiRequest('DELETE', `/api/favorites/${restaurantId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: 'Removed from Favorites',
        description: 'Restaurant has been removed from your favorites.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to remove restaurant from favorites.',
        variant: 'destructive',
      });
    },
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['/api/favorites'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useRecommendations(location: GeolocationPosition | null, limit?: number) {
  return useQuery({
    queryKey: ['/api/recommendations', location?.lat, location?.lng, limit],
    enabled: !!location,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAddVisit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      restaurantId,
      rating,
      notes,
    }: {
      restaurantId: string;
      rating?: number;
      notes?: string;
    }) => {
      const response = await apiRequest('POST', '/api/visits', {
        restaurantId,
        rating,
        notes,
        visitDate: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profile/stats'] });
      toast({
        title: 'Visit Recorded',
        description: 'Your restaurant visit has been recorded.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to record restaurant visit.',
        variant: 'destructive',
      });
    },
  });
}

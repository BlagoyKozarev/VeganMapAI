import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';

interface FavoriteButtonProps {
  restaurantId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ restaurantId, className = "", size = 'md' }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if restaurant is favorite
  const { data: favoriteData } = useQuery({
    queryKey: ['/api/favorites/check', restaurantId],
    enabled: isAuthenticated,
  });

  const isFavorite = favoriteData?.isFavorite || false;

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ restaurantId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check', restaurantId] });
      toast({
        title: "Added to Favorites",
        description: "Restaurant saved to your favorites list.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add to favorites.",
        variant: "destructive",
      });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/favorites/${restaurantId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check', restaurantId] });
      toast({
        title: "Removed from Favorites",
        description: "Restaurant removed from your favorites list.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove from favorites.",
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to save favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    if (isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
    lg: 'h-8 w-8'
  };

  const buttonSizes = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
      className={`${buttonSizes[size]} hover:bg-red-50 dark:hover:bg-red-900/20 ${className}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeClasses[size]} transition-colors ${
          isFavorite 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-500'
        }`}
      />
    </Button>
  );
}
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './button';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  restaurantId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function FavoriteButton({ restaurantId, size = 'md', showLabel = false }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query favorites
  const { data: favorites = [] } = useQuery<any[]>({
    queryKey: ['/api/v1/favorites'],
    enabled: isAuthenticated,
    retry: false
  });
  
  const isFavorite = favorites.some((fav: any) => fav.id === restaurantId);
  
  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/favorites/${restaurantId}`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Added to favorites",
        description: "Restaurant saved to your favorites list"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive"
      });
    }
  });
  
  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/favorites/${restaurantId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Removed from favorites",
        description: "Restaurant removed from your favorites list"
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to remove from favorites",
        variant: "destructive"
      });
    }
  });
  
  const handleClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to save favorites",
        variant: "destructive"
      });
      return;
    }
    
    if (isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  return (
    <Button
      onClick={handleClick}
      variant={isFavorite ? 'default' : 'outline'}
      size="icon"
      className={`${sizeClasses[size]} ${isFavorite ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
      disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorite ? 'fill-current' : ''}`}
      />
      {showLabel && (
        <span className="ml-2">
          {isFavorite ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
}
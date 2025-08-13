import { Skeleton } from '@/components/ui/skeleton';

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

export function RestaurantListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <RestaurantCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-900 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
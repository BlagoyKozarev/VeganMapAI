import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Map from '@/components/Map'
import VeganScoreLegend from '@/components/VeganScoreLegend'
import { Restaurant } from '@shared/schema'

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({ lat: 42.6977, lng: 23.3219 })
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  // Set Sofia coordinates immediately
  useEffect(() => {
    console.log('Home component loaded, setting Sofia coordinates')
    setUserLocation({ lat: 42.6977, lng: 23.3219 })
  }, [])

  // Fetch restaurants based on location
  const { data: restaurantData, isLoading } = useQuery({
    queryKey: ['/api/restaurants/nearby', userLocation?.lat, userLocation?.lng],
    enabled: !!userLocation,
    queryFn: async () => {
      const params = new URLSearchParams({
        lat: userLocation!.lat.toString(),
        lng: userLocation!.lng.toString(),
        radius: '2'
      })
      const response = await fetch(`/api/restaurants/nearby?${params}`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch restaurants')
      return response.json()
    }
  })

  useEffect(() => {
    if (restaurantData) {
      setRestaurants(restaurantData)
      console.log('Received restaurant data:', restaurantData.length, 'restaurants')
    }
  }, [restaurantData])

  console.log('Rendering Home component', { userLocation, restaurants: restaurants.length })

  if (!userLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Getting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="text-xl font-bold text-primary">VeganMapAI</div>
            <div className="hidden sm:block text-sm text-gray-500">
              Sofia, Bulgaria
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <a
              href="/api/logout"
              className="text-gray-600 hover:text-gray-800 font-medium text-sm"
            >
              Sign Out
            </a>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="pt-16 h-full">
        <Map 
          center={userLocation} 
          restaurants={restaurants}
          isLoading={isLoading}
        />
      </div>

      {/* Vegan Score Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <VeganScoreLegend />
      </div>

      {/* Restaurant Count */}
      <div className="absolute top-20 right-4 z-10 bg-white rounded-lg shadow-md p-3">
        <div className="text-sm font-medium text-gray-700">
          {isLoading ? 'Loading...' : `${restaurants.length} restaurants found`}
        </div>
      </div>
    </div>
  )
}
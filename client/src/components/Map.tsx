import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { Restaurant } from '@shared/schema'

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: { lat: number; lng: number }
  restaurants: Restaurant[]
  isLoading: boolean
}

export default function Map({ center, restaurants, isLoading }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Layer[]>([])

  useEffect(() => {
    if (!mapRef.current) {
      console.log('Initializing map...', center)
      // Initialize map
      mapRef.current = L.map('map').setView([center.lat, center.lng], 13)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)
      
      console.log('Map initialized successfully')
    }
  }, [center])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current!.removeLayer(marker)
    })
    markersRef.current = []

    // Add restaurant markers
    restaurants.forEach(restaurant => {
      const score = parseFloat(restaurant.veganScore)
      const marker = L.circleMarker([parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)], {
        radius: 8,
        fillColor: getScoreColor(score),
        color: 'white',
        weight: 2,
        fillOpacity: 0.8
      })

      marker.bindPopup(`
        <div class="font-sans">
          <h3 class="font-bold text-lg">${restaurant.name}</h3>
          <p class="text-sm text-gray-600">${restaurant.address}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-sm">Vegan Score:</span>
            <span class="font-bold text-lg ${getScoreTextClass(score)}">${score}/10</span>
          </div>
          ${restaurant.website ? `<a href="${restaurant.website}" target="_blank" class="text-blue-600 text-sm hover:underline">Visit Website</a>` : ''}
        </div>
      `)

      marker.addTo(mapRef.current!)
      markersRef.current.push(marker)
    })

    console.log(`Map component - rendering restaurants: ${restaurants.length}`)
  }, [restaurants])

  return (
    <div className="w-full h-full relative">
      <div id="map" className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      )}
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 8.5) return '#059669' // green-600 - Excellent
  if (score >= 7.5) return '#10b981' // green-500 - Very Good  
  if (score >= 6.0) return '#eab308' // yellow-500 - Good
  if (score >= 4.5) return '#f97316' // orange-500 - Fair
  if (score >= 3.0) return '#ef4444' // red-500 - Poor
  return '#dc2626' // red-600 - Very Poor
}

function getScoreTextClass(score: number): string {
  if (score >= 8.5) return 'text-green-600'
  if (score >= 7.5) return 'text-green-500'
  if (score >= 6.0) return 'text-yellow-600'
  if (score >= 4.5) return 'text-orange-500'
  if (score >= 3.0) return 'text-red-500'
  return 'text-red-600'
}
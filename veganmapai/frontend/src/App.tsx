import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

// Fix Leaflet icons
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
})

function App() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    // Load restaurants from GeoJSON endpoint
    fetch('/geojson/sofia.geojson')
      .then(res => res.json())
      .then((data: any) => {
        if (data.features) {
          // Transform GeoJSON to restaurant format
          const restaurantData = data.features.map((feature: any) => ({
            id: feature.properties.id,
            name: feature.properties.name,
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
            veganScore: feature.properties.vegan_score,
            address: feature.properties.address,
            cuisine: feature.properties.cuisine
          }))
          setRestaurants(restaurantData)
        }
      })
      .catch(err => {
        console.log('GeoJSON failed, using API fallback:', err)
        // Fallback to local API
        fetch('/api/restaurants/public/map-data')
          .then(res => res.json())
          .then(data => {
            if (data.restaurants) {
              setRestaurants(data.restaurants)
            }
          })
          .catch(err => console.error('Error fetching restaurants:', err))
      })
  }, [])

  useEffect(() => {
    if (!mapRef.current || restaurants.length === 0) return

    // Create map
    const map = L.map(mapRef.current).setView([42.6977, 23.3219], 12)
    
    // Add tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Create cluster group
    const clusterGroup = (L as any).markerClusterGroup({
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount()
        let color = '#22c55e'
        let size = 40
        
        if (count > 50) {
          color = '#ef4444'
          size = 60
        } else if (count > 20) {
          color = '#f97316'
          size = 50
        }

        return L.divIcon({
          html: `<div style="
            background: ${color};
            color: white;
            border-radius: 50%;
            width: ${size}px;
            height: ${size}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          ">${count}</div>`,
          className: 'cluster-icon',
          iconSize: [size, size]
        })
      }
    })

    // Add markers
    restaurants.forEach((restaurant: any) => {
      if (restaurant.latitude && restaurant.longitude) {
        const lat = parseFloat(restaurant.latitude)
        const lng = parseFloat(restaurant.longitude)
        
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng])
          marker.bindPopup(`
            <div>
              <h3>${restaurant.name}</h3>
              <p>Vegan Score: ${restaurant.veganScore}/10</p>
              ${restaurant.address ? `<p>${restaurant.address}</p>` : ''}
            </div>
          `)
          clusterGroup.addLayer(marker)
        }
      }
    })

    map.addLayer(clusterGroup)

    return () => {
      map.remove()
    }
  }, [restaurants])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#22c55e' }}>VeganMapAI</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
          {restaurants.length} Restaurants in Sofia
        </p>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default App

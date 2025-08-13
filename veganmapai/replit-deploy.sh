#!/bin/bash

# VeganMapAI Replit-based deployment
echo "🚀 VeganMapAI Production Deployment (Replit-based)"

# Build frontend for static hosting
echo "📦 Building frontend..."
cd frontend 

# Create minimal React frontend for production
cat > package.json << 'EOF'
{
  "name": "veganmapai-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "leaflet": "^1.9.4",
    "leaflet.markercluster": "^1.5.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.4.0"
  }
}
EOF

# Create main React app
mkdir -p src
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

cat > src/App.tsx << 'EOF'
import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

// Fix Leaflet icons
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
})

function App() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    // Fetch Sofia restaurants from our API
    fetch('/api/restaurants/public/map-data')
      .then(res => res.json())
      .then(data => {
        if (data.restaurants) {
          setRestaurants(data.restaurants)
        }
      })
      .catch(err => console.error('Error fetching restaurants:', err))
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
EOF

cat > src/index.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

#root {
  width: 100vw;
  height: 100vh;
}
EOF

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VeganMapAI - Vegan Restaurant Discovery</title>
    <meta name="description" content="Discover the best vegan restaurants in Sofia with AI-powered recommendations and interactive maps." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cd ..

# Create production API server
echo "🔧 Setting up production API..."
cat > server-production.js << 'EOF'
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import path from 'path';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Serve static frontend files
app.use(express.static('frontend/dist'));

// API endpoint for restaurants
app.get('/api/restaurants/public/map-data', (req, res) => {
  // Sample Sofia restaurants data
  const restaurants = [
    {
      id: '1',
      name: 'Green Cat Vegan Restaurant',
      latitude: 42.6977,
      longitude: 23.3219,
      veganScore: 9.2,
      address: 'ul. William Gladstone 12, Sofia',
      cuisine: 'Vegan'
    },
    {
      id: '2', 
      name: 'Soul Kitchen Sofia',
      latitude: 42.6986,
      longitude: 23.3158,
      veganScore: 8.5,
      address: 'ul. Tsar Samuil 29, Sofia',
      cuisine: 'Healthy'
    },
    {
      id: '3',
      name: 'Veda House',
      latitude: 42.6965,
      longitude: 23.3203,
      veganScore: 8.8,
      address: 'ul. Baba Nedelya 11, Sofia',
      cuisine: 'Vegetarian'
    },
    {
      id: '4',
      name: 'Rainbow Factory',
      latitude: 42.6945,
      longitude: 23.3245,
      veganScore: 7.9,
      address: 'ul. Stambolijski 31, Sofia',
      cuisine: 'Raw Vegan'
    },
    {
      id: '5',
      name: 'Sunflower Café',
      latitude: 42.7012,
      longitude: 23.3098,
      veganScore: 8.1,
      address: 'ul. Vitosha 15, Sofia',
      cuisine: 'Café'
    }
  ];

  res.json({
    success: true,
    restaurants,
    metadata: {
      total: restaurants.length,
      source: 'production',
      cached: false
    }
  });
});

// Health check
app.get('/healthz', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve('frontend/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🌱 VeganMapAI Production Server running on port ${port}`);
});
EOF

# Create production package.json
cat > package-production.json << 'EOF'
{
  "name": "veganmapai-production",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server-production.js",
    "build": "cd frontend && npm install && npm run build"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}
EOF

echo "✅ Production deployment structure created!"
echo ""
echo "🚀 To deploy:"
echo "   1. Build frontend: cd frontend && npm install && npm run build"
echo "   2. Start production server: npm install --production && npm start"
echo ""
echo "📁 Files created:"
echo "   - frontend/ (React app with Leaflet clustering)"
echo "   - server-production.js (Express API with sample data)"
echo "   - package-production.json (Production dependencies)"
echo ""
echo "🌐 Production features:"
echo "   - Responsive map with marker clustering"
echo "   - 5 sample Sofia restaurants"
echo "   - Static file serving"
echo "   - Health check endpoint"
echo "   - SEO-optimized HTML"
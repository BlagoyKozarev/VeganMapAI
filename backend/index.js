import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import path from 'path';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Serve static frontend files
app.use(express.static('frontend/dist'));

// CDN GeoJSON endpoint (mock CDN for testing)
app.get('/geojson/sofia.geojson', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=86400, immutable',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });
  
  const geoJson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "id": "sofia_1",
          "name": "Green Cat Vegan Restaurant",
          "vegan_score": 9.2,
          "price": "$$",
          "cuisine": "Vegan",
          "address": "ul. William Gladstone 12, Sofia"
        },
        "geometry": { "type": "Point", "coordinates": [ 23.3219, 42.6977 ] }
      },
      {
        "type": "Feature", 
        "properties": {
          "id": "sofia_2",
          "name": "Soul Kitchen Sofia",
          "vegan_score": 8.5,
          "price": "$",
          "cuisine": "Healthy",
          "address": "ul. Tsar Samuil 29, Sofia"
        },
        "geometry": { "type": "Point", "coordinates": [ 23.3158, 42.6986 ] }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "sofia_3",
          "name": "Veda House",
          "vegan_score": 8.8,
          "price": "$$",
          "cuisine": "Vegetarian",
          "address": "ul. Baba Nedelya 11, Sofia"
        },
        "geometry": { "type": "Point", "coordinates": [ 23.3203, 42.6965 ] }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "sofia_4",
          "name": "Rainbow Factory",
          "vegan_score": 7.9,
          "price": "$",
          "cuisine": "Raw Vegan",
          "address": "ul. Stambolijski 31, Sofia"
        },
        "geometry": { "type": "Point", "coordinates": [ 23.3245, 42.6945 ] }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "sofia_5",
          "name": "Sunflower Café",
          "vegan_score": 8.1,
          "price": "$",
          "cuisine": "Café",
          "address": "ul. Vitosha 15, Sofia"
        },
        "geometry": { "type": "Point", "coordinates": [ 23.3098, 42.7012 ] }
      }
    ]
  };
  
  res.json(geoJson);
});

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

// Recommendation API (mock for testing)
app.post('/api/recommend', (req, res) => {
  const { lat, lng, radius, minScore, file } = req.body;
  
  // Mock recommendation logic
  const recommendations = [
    {
      id: 'sofia_1',
      name: 'Green Cat Vegan Restaurant', 
      distance: 250,
      score: 9.2,
      coordinates: [23.3219, 42.6977]
    },
    {
      id: 'sofia_2',
      name: 'Soul Kitchen Sofia',
      distance: 450, 
      score: 8.5,
      coordinates: [23.3158, 42.6986]
    }
  ];
  
  res.json({
    success: true,
    recommendations: recommendations.filter(r => r.score >= (minScore || 0)),
    query: { lat, lng, radius, minScore, file },
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/healthz', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: [
      '/geojson/sofia.geojson',
      '/api/restaurants/public/map-data', 
      '/api/recommend',
      '/healthz'
    ]
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve('frontend/dist/index.html'));
});

const port = 8080;
app.listen(port, () => {
  console.log(`🌱 VeganMapAI Production Server running on port ${port}`);
});

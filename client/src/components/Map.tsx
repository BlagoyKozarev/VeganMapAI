import { useEffect } from "react";
import { GOOGLE } from '@/config/google';

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

export default function MapComponent() {
  useEffect(() => {
    // Load Google Maps JS API with configured API key
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE.apiKey}&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    window.initMap = () => {
      const mapElement = document.getElementById("map");
      if (!mapElement) return;
      
      const map = new window.google.maps.Map(mapElement, {
        center: { lat: 42.6977, lng: 23.3219 },
        zoom: 12,
      });

      // Load GeoJSON from CDN
      map.data.loadGeoJson(
        "https://storage.googleapis.com/veganmapai-cdn/geojson/sofia.geojson"
      );

      // Style markers based on vegan_score
      map.data.setStyle((feature: any) => {
        const scoreProperty = feature.getProperty("vegan_score");
        const score = scoreProperty ? Number(scoreProperty) : 0;
        let color = "#ff0000"; // red for low scores
        if (score > 7) color = "#00cc44"; // green for high vegan scores
        else if (score > 4) color = "#ffcc00"; // yellow for medium scores
        
        return {
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: color,
            fillOpacity: 0.9,
            strokeColor: "#000",
            strokeWeight: 1,
          },
        };
      });

      // InfoWindow on marker click
      const infowindow = new window.google.maps.InfoWindow();
      map.data.addListener("click", (event: any) => {
        const name = event.feature.getProperty("name") || "Unknown Restaurant";
        const rating = event.feature.getProperty("rating") || "N/A";
        const address = event.feature.getProperty("address") || "Address not available";
        const veganScoreProperty = event.feature.getProperty("vegan_score");
        const veganScore = veganScoreProperty ? Number(veganScoreProperty) : 0;
        
        infowindow.setContent(`
          <div style="padding: 8px; min-width: 200px;">
            <strong style="font-size: 16px; color: #2d3748;">${name}</strong><br/>
            <div style="margin: 4px 0; color: #4a5568;">
              Rating: ${rating}<br/>
              Vegan Score: ${veganScore}/8<br/>
              ${address}
            </div>
          </div>
        `);
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
      });

      console.log('[MAP] Google Maps initialized with CDN data loading');
    };

    return () => {
      // Cleanup script on unmount
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return <div id="map" style={{ width: "100%", height: "600px" }} />;
}
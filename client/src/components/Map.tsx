import { useEffect } from "react";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

export default function MapComponent() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    window.initMap = () => {
      const mapElement = document.getElementById("map");
      if (!mapElement) return;
      
      const map = new window.google.maps.Map(mapElement, {
        center: { lat: 42.6977, lng: 23.3219 }, // Sofia
        zoom: 12,
      });

      const CDN_URL = "https://storage.googleapis.com/veganmapai-cdn/geojson/sofia.geojson";
      const API_URL = "/api/restaurants/geojson";

      // try load from CDN
      fetch(CDN_URL, { cache: "reload" })
        .then((res) => {
          if (!res.ok) throw new Error("CDN failed");
          return res.json();
        })
        .then((data) => {
          console.log('[MAP] Loaded data from CDN:', data.features?.length, 'restaurants');
          map.data.addGeoJson(data);
        })
        .catch(() => {
          console.warn("CDN failed, fallback to API");
          map.data.loadGeoJson(API_URL);
        });

      // style markers by vegan_score
      map.data.setStyle((feature: any) => {
        const score = Number(feature.getProperty("vegan_score")) || 0;
        let color = "#ff0000";
        if (score > 7) color = "#00cc44";
        else if (score > 4) color = "#ffcc00";
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

      // InfoWindow popup
      const infowindow = new window.google.maps.InfoWindow();
      map.data.addListener("click", (event: any) => {
        const name = event.feature.getProperty("name");
        const rating = event.feature.getProperty("rating");
        const address = event.feature.getProperty("address");
        const veganScore = event.feature.getProperty("vegan_score");
        infowindow.setContent(
          `<strong>${name}</strong><br/>Rating: ${rating}<br/>Vegan Score: ${veganScore}/8<br/>${address}`
        );
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
      });
    };

    return () => {
      // Cleanup script on unmount
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return <div id="map" style={{ width: "100%", height: "600px" }} />;
}
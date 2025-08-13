declare module 'leaflet.markercluster' {
  import * as L from 'leaflet';

  namespace L {
    interface MarkerClusterGroupOptions {
      showCoverageOnHover?: boolean;
      zoomToBoundsOnClick?: boolean;
      maxClusterRadius?: number;
      iconCreateFunction?: (cluster: MarkerCluster) => L.DivIcon | L.Icon;
      [key: string]: any;
    }

    interface MarkerCluster {
      getChildCount(): number;
      getAllChildMarkers(): L.Marker[];
    }

    interface MarkerClusterGroup extends L.LayerGroup {
      addLayer(layer: L.Layer): this;
      addLayers(layers: L.Layer[]): this;
      removeLayer(layer: L.Layer): this;
      clearLayers(): this;
    }

    function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
  }
}
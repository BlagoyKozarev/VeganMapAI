export const GOOGLE = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  map: {
    center: { lat: 42.6977, lng: 23.3219 }, // Sofia, Bulgaria
    zoom: 13,
    mapId: undefined as string | undefined
  },
  places: {
    queryRadiusMeters: 3000,
    types: ["restaurant"] as google.maps.places.PlaceType[],
    keyword: "vegan"
  }
};

export const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];
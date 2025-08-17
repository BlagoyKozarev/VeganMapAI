export type MapPoint = { 
  id: string; 
  name: string; 
  lat: number; 
  lng: number; 
  score?: number;
  address?: string;
};

export function normalizeItem(x: any): MapPoint | null {
  const lat = Number(x.lat ?? x.latitude ?? x.location?.lat ?? x.coordinates?.lat);
  const lng = Number(x.lng ?? x.longitude ?? x.location?.lng ?? x.coordinates?.lng);
  
  if (!isFinite(lat) || !isFinite(lng)) {
    console.warn('[NORMALIZE] Invalid coordinates:', { lat, lng, item: x });
    return null;
  }
  
  return {
    id: String(x.id ?? x.place_id ?? x._id ?? `${lat},${lng}`),
    name: String(x.name ?? x.title ?? 'Restaurant'),
    lat, 
    lng,
    score: Number(x.score ?? x.veganScore ?? x.rating ?? 0),
    address: x.address || x.location?.address
  };
}
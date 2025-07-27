import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
  price_level?: number;
  types: string[];
  opening_hours?: any;
  photos?: any[];
  rating?: number;
  user_ratings_total?: number;
  reviews?: any[];
  editorial_summary?: {
    overview?: string;
  };
}

export async function findNearbyRestaurants(
  lat: number,
  lng: number,
  radiusMeters: number = 2000
): Promise<GooglePlaceDetails[]> {
  try {
    const response = await client.placesNearby({
      params: {
        location: { lat, lng },
        radius: radiusMeters,
        type: 'restaurant',
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    const detailedPlaces: GooglePlaceDetails[] = [];
    
    // Get detailed information for each place - increased limit for comprehensive testing
    for (const place of response.data.results.slice(0, 60)) { // Limit to 60 places
      try {
        const detailsResponse = await client.placeDetails({
          params: {
            place_id: place.place_id!,
            fields: [
              'place_id',
              'name',
              'formatted_address',
              'geometry',
              'formatted_phone_number',
              'website',
              'price_level',
              'types',
              'opening_hours',
              'photos',
              'rating',
              'user_ratings_total',
              'reviews',
              'editorial_summary'
            ],
            key: process.env.GOOGLE_MAPS_API_KEY!,
          },
        });

        if (detailsResponse.data.result) {
          detailedPlaces.push(detailsResponse.data.result as GooglePlaceDetails);
        }
      } catch (error) {
        console.warn(`Failed to get details for place ${place.place_id}:`, error);
      }
    }

    return detailedPlaces;
  } catch (error) {
    console.error('Error fetching nearby restaurants from Google Places:', error);
    throw new Error('Failed to fetch restaurants from Google Places');
  }
}

export async function getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'formatted_phone_number',
          'website',
          'price_level',
          'types',
          'opening_hours',
          'photos',
          'rating',
          'user_ratings_total',
          'reviews',
          'editorial_summary'
        ],
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    return response.data.result as GooglePlaceDetails || null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}
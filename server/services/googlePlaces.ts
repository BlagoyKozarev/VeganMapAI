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
  radiusMeters: number = 4000
): Promise<GooglePlaceDetails[]> {
  try {
    console.log(`Searching for restaurants in ${radiusMeters/1000}km radius from Sofia center`);
    
    const allPlaces: GooglePlaceDetails[] = [];
    let nextPageToken: string | undefined;
    
    // Google Places API returns max 20 results per page, use pagination for comprehensive search
    do {
      const response = await client.placesNearby({
        params: {
          location: { lat, lng },
          radius: radiusMeters,
          type: 'restaurant',
          key: process.env.GOOGLE_MAPS_API_KEY!,
          ...(nextPageToken && { pagetoken: nextPageToken })
        },
      });

      console.log(`Found ${response.data.results.length} restaurants in this page`);
      
      // Get detailed information for each place
      for (const place of response.data.results) {
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
          allPlaces.push(detailsResponse.data.result as GooglePlaceDetails);
        }
      } catch (error) {
        console.warn(`Failed to get details for place ${place.place_id}:`, error);
      }
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    nextPageToken = response.data.next_page_token;
    
    // If there's a next page, wait for it to be ready (Google requires ~2 second delay)
    if (nextPageToken) {
      console.log('Waiting for next page to be ready...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
  } while (nextPageToken && allPlaces.length < 100); // Limit to 100 restaurants for 4km radius

    console.log(`Total restaurants found: ${allPlaces.length}`);
    return allPlaces;
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
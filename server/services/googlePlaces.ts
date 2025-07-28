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
    const processedPlaceIds = new Set<string>();
    
    // Search for multiple types to get more variety including specific Bulgarian establishments
    const searchTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bar', 'night_club'];
    
    for (const searchType of searchTypes) {
      console.log(`Searching for type: ${searchType}`);
      let nextPageToken: string | undefined;
      
      // Google Places API returns max 20 results per page, use pagination for comprehensive search
      do {
        const response = await client.placesNearby({
          params: {
            location: { lat, lng },
            radius: radiusMeters,
            type: searchType as any,
            key: process.env.GOOGLE_MAPS_API_KEY!,
            ...(nextPageToken && { pagetoken: nextPageToken })
          },
        });

      console.log(`Found ${response.data.results.length} ${searchType} places in this page`);
      
      // Get detailed information for each place
      for (const place of response.data.results) {
        // Skip if we already processed this place
        if (processedPlaceIds.has(place.place_id!)) {
          continue;
        }
        processedPlaceIds.add(place.place_id!);
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
      
    } while (nextPageToken && allPlaces.length < 100); // Limit per search type for 4km radius
    
    // Small delay between search types
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Additional keyword-based searches for specific establishment types
  const keywordSearches = [
    'steakhouse', 'seafood', 'механа', 'бистро', 'tavern', 'diner'
  ];

  for (const keyword of keywordSearches) {
    console.log(`Searching for keyword: ${keyword}`);
    let nextPageToken: string | undefined;
    
    do {
      const response = await client.textSearch({
        params: {
          query: `${keyword} restaurant Sofia Bulgaria`,
          location: { lat, lng },
          radius: radiusMeters,
          key: process.env.GOOGLE_MAPS_API_KEY!,
          ...(nextPageToken && { pagetoken: nextPageToken })
        },
      });

      console.log(`Found ${response.data.results.length} ${keyword} places in this page`);
      
      // Filter for restaurant-related places only
      const restaurantPlaces = response.data.results.filter(place => 
        place.types?.some(type => 
          ['restaurant', 'food', 'meal_takeaway', 'establishment', 'bar'].includes(type)
        )
      );

      for (const place of restaurantPlaces) {
        // Skip if we already processed this place
        if (processedPlaceIds.has(place.place_id!)) {
          continue;
        }
        processedPlaceIds.add(place.place_id!);

        try {
          // Get detailed place information
          const detailsResponse = await client.placeDetails({
            params: {
              place_id: place.place_id!,
              fields: [
                'place_id', 'name', 'formatted_address', 'geometry',
                'formatted_phone_number', 'website', 'price_level',
                'rating', 'user_ratings_total', 'types', 'photos',
                'opening_hours', 'reviews'
              ],
              key: process.env.GOOGLE_MAPS_API_KEY!,
            },
          });

          const placeDetails = detailsResponse.data.result;
          if (placeDetails.geometry?.location) {
            const distance = calculateDistance(
              lat, lng,
              placeDetails.geometry.location.lat,
              placeDetails.geometry.location.lng
            );

            console.log(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${placeDetails.name}: distance ~${distance.toFixed(2)}km`);

            if (distance <= radiusMeters / 1000) { // Within radius
              allPlaces.push({
                place_id: placeDetails.place_id!,
                name: placeDetails.name!,
                formatted_address: placeDetails.formatted_address!,
                geometry: {
                  location: {
                    lat: placeDetails.geometry.location.lat,
                    lng: placeDetails.geometry.location.lng,
                  },
                },
                formatted_phone_number: placeDetails.formatted_phone_number,
                website: placeDetails.website,
                price_level: placeDetails.price_level,
                rating: placeDetails.rating,
                user_ratings_total: placeDetails.user_ratings_total,
                types: placeDetails.types,
                photos: placeDetails.photos?.map(photo => photo.photo_reference),
                opening_hours: placeDetails.opening_hours,
                reviews: placeDetails.reviews,
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to get details for ${keyword} place ${place.place_id}:`, error);
        }
        
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      nextPageToken = response.data.next_page_token;
      
      if (nextPageToken) {
        console.log('Waiting for next page to be ready...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } while (nextPageToken && allPlaces.length < 500); // Overall limit
    
    // Small delay between keyword searches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

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
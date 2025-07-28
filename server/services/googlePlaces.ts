import { Client } from '@googlemaps/google-maps-services-js';
import { geoCache, detailsCache, photoCache } from '../utils/geoCache';

const client = new Client({});

// Track API call statistics for cost optimization
let apiCallStats = {
  placesSearch: 0,
  placeDetails: 0,
  photos: 0,
  cacheHits: 0,
  cacheMisses: 0
};

export function getApiStats() {
  return {
    ...apiCallStats,
    cacheHitRate: apiCallStats.cacheHits / (apiCallStats.cacheHits + apiCallStats.cacheMisses) * 100
  };
}

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
    console.log(`Searching for restaurants in ${radiusMeters/1000}km radius from coordinates`);
    
    // Check cache first for this geographic area
    const cacheKey = geoCache.generatePlacesSearchKey(lat, lng, radiusMeters, 'restaurant');
    const cachedResults = geoCache.get(cacheKey);
    
    if (cachedResults) {
      apiCallStats.cacheHits++;
      console.log(`Cache HIT: Returning ${cachedResults.length} cached restaurants for area`);
      return cachedResults;
    }
    
    apiCallStats.cacheMisses++;
    console.log(`Cache MISS: Fetching fresh data from Google Places API`);
    
    const allPlaces: GooglePlaceDetails[] = [];
    const processedPlaceIds = new Set<string>();
    
    // Search for multiple types to get more variety including specific Bulgarian establishments
    const searchTypes = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bar', 'night_club'];
    
    for (const searchType of searchTypes) {
      console.log(`Searching for type: ${searchType}`);
      let nextPageToken: string | undefined;
      
      // Google Places API returns max 20 results per page, use pagination for comprehensive search
      do {
        // Check cache for this specific search type
        const typeKey = geoCache.generatePlacesSearchKey(lat, lng, radiusMeters, searchType);
        let response;
        
        const cachedTypeResults = geoCache.get(typeKey);
        if (cachedTypeResults && !nextPageToken) {
          console.log(`Cache HIT for ${searchType}: Using cached results`);
          response = { data: { results: cachedTypeResults, next_page_token: undefined } };
          apiCallStats.cacheHits++;
        } else {
          console.log(`Fetching ${searchType} from Google Places API`);
          response = await client.placesNearby({
            params: {
              location: { lat, lng },
              radius: radiusMeters,
              type: searchType as any,
              key: process.env.GOOGLE_MAPS_API_KEY!,
              ...(nextPageToken && { pagetoken: nextPageToken })
            },
          });
          apiCallStats.placesSearch++;
          
          // Cache the raw results for this search type (without nextPageToken for first page)
          if (!nextPageToken) {
            geoCache.set(typeKey, response.data.results, 12 * 60 * 60 * 1000); // 12 hours
          }
        }

      console.log(`Found ${response.data.results.length} ${searchType} places in this page`);
      
      // Get detailed information for each place
      for (const place of response.data.results) {
        // Skip if we already processed this place
        if (processedPlaceIds.has(place.place_id!)) {
          continue;
        }
        processedPlaceIds.add(place.place_id!);
        
        try {
          // Check cache for place details first
          const detailsKey = detailsCache.generatePlacesDetailsKey(place.place_id!);
          let detailsResponse;
          
          const cachedDetails = detailsCache.get(detailsKey);
          if (cachedDetails) {
            console.log(`Cache HIT for place details: ${place.name}`);
            detailsResponse = { data: { result: cachedDetails } };
            apiCallStats.cacheHits++;
          } else {
            console.log(`Fetching place details for: ${place.name}`);
            detailsResponse = await client.placeDetails({
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
        apiCallStats.placeDetails++;
        
        // Cache the place details
        if (detailsResponse.data.result) {
          detailsCache.set(detailsKey, detailsResponse.data.result, 7 * 24 * 60 * 60 * 1000); // 7 days
        }
      }

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
          // Check cache for place details first
          const detailsKey = detailsCache.generatePlacesDetailsKey(place.place_id!);
          let detailsResponse;
          
          const cachedDetails = detailsCache.get(detailsKey);
          if (cachedDetails) {
            console.log(`Cache HIT for ${keyword} place: ${place.name}`);
            detailsResponse = { data: { result: cachedDetails } };
            apiCallStats.cacheHits++;
          } else {
            console.log(`Fetching ${keyword} place details: ${place.name}`);
            detailsResponse = await client.placeDetails({
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
            apiCallStats.placeDetails++;
            
            // Cache the place details
            if (detailsResponse.data.result) {
              detailsCache.set(detailsKey, detailsResponse.data.result, 7 * 24 * 60 * 60 * 1000); // 7 days
            }
          }

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
    
    // Cache the complete results for this area
    geoCache.set(cacheKey, allPlaces, 24 * 60 * 60 * 1000); // 24 hours
    
    console.log(`Cost optimization stats - API calls: ${apiCallStats.placesSearch + apiCallStats.placeDetails}, Cache hit rate: ${apiCallStats.cacheHits > 0 ? (apiCallStats.cacheHits / (apiCallStats.cacheHits + apiCallStats.cacheMisses) * 100).toFixed(1) : 0}%`);
    
    return allPlaces;
  } catch (error) {
    console.error('Error fetching nearby restaurants from Google Places:', error);
    throw new Error('Failed to fetch restaurants from Google Places');
  }
}

export async function getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  try {
    // Check cache first
    const cacheKey = detailsCache.generatePlacesDetailsKey(placeId);
    const cachedDetails = detailsCache.get(cacheKey);
    
    if (cachedDetails) {
      console.log(`Cache HIT for place details: ${placeId}`);
      apiCallStats.cacheHits++;
      return cachedDetails;
    }
    
    console.log(`Fetching place details from API: ${placeId}`);
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
    apiCallStats.placeDetails++;
    
    // Cache the result
    if (response.data.result) {
      detailsCache.set(cacheKey, response.data.result, 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    return response.data.result as GooglePlaceDetails || null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}
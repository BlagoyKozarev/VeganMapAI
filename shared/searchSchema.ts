import { z } from 'zod';

// Search query parameters schema
export const SearchParamsSchema = z.object({
  q: z.string().optional(), // free text search
  minScore: z.coerce.number().min(1).max(10).optional(),
  maxScore: z.coerce.number().min(1).max(10).optional(),
  allergens: z.union([
    z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
    z.array(z.string())
  ]).optional(),
  cuisines: z.union([
    z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
    z.array(z.string())
  ]).optional(),
  priceMin: z.coerce.number().min(1).max(4).optional(),
  priceMax: z.coerce.number().min(1).max(4).optional(),
  maxDistanceKm: z.coerce.number().positive().max(50).optional(), // max 50km
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  sort: z.enum(['score', 'distance', 'price', 'rating']).default('score'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(10).max(100).default(20)
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;

// Search result schema
export const SearchResultSchema = z.object({
  items: z.array(z.any()), // Will be Restaurant[]
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pages: z.number().int().min(0),
  took_ms: z.number().min(0),
  facets: z.object({
    cuisines: z.array(z.object({
      name: z.string(),
      count: z.number()
    })),
    priceRanges: z.array(z.object({
      level: z.number(),
      count: z.number()
    }))
  }).optional()
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// Common allergens list
export const COMMON_ALLERGENS = [
  'gluten',
  'peanut',
  'soy',
  'tree nut',
  'sesame',
  'dairy',
  'egg',
  'shellfish',
  'fish'
] as const;

// Common cuisines for multi-select
export const COMMON_CUISINES = [
  'italian',
  'asian',
  'mediterranean',
  'mexican',
  'indian',
  'thai',
  'chinese',
  'japanese',
  'american',
  'french',
  'greek',
  'turkish',
  'middle eastern',
  'vietnamese',
  'korean',
  'spanish',
  'ethiopian',
  'lebanese',
  'moroccan',
  'fusion'
] as const;

// Price level labels
export const PRICE_LEVELS = {
  1: '$',
  2: '$$', 
  3: '$$$',
  4: '$$$$'
} as const;

// Distance options in km
export const DISTANCE_OPTIONS = [1, 2, 5, 10, 20] as const;

// Sort options with labels
export const SORT_OPTIONS = {
  score: 'Vegan Score',
  distance: 'Distance',
  price: 'Price',
  rating: 'Rating'
} as const;
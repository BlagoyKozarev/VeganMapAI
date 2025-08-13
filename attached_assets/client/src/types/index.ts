export interface Restaurant {
  id: string;
  placeId?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  phoneNumber?: string;
  website?: string;
  priceLevel?: '$' | '$$' | '$$$' | '$$$$';
  cuisineTypes?: string[];
  openingHours?: any;
  photos?: string[];
  rating?: string;
  reviewCount?: number;
  veganScore?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VeganScoreBreakdown {
  id: string;
  restaurantId: string;
  menuVariety: string;
  ingredientClarity: string;
  staffKnowledge: string;
  crossContaminationPrevention: string;
  nutritionalInformation: string;
  allergenManagement: string;
  overallScore: string;
  lastUpdated?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  dietaryStyle: 'vegan' | 'vegetarian' | 'flexitarian';
  allergies?: string[];
  preferredCuisines?: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  maxDistance: number;
  isProfileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  profile?: UserProfile;
  hasProfile?: boolean;
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  restaurantRecommendations?: string[];
}

export interface PersonalMatch {
  tasteMatch: number;
  healthFit: number;
}

export interface UserStats {
  placesVisited: number;
  favorites: number;
  reviews: number;
  avgVeganScore: number;
}

export interface SearchFilters {
  minVeganScore?: number;
  maxDistance?: number;
  priceRange?: string[];
  cuisineTypes?: string[];
  allergies?: string[];
  dietaryStyle?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeolocationPosition {
  lat: number;
  lng: number;
  accuracy?: number;
}
